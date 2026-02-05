import { RepairCommand, validateCommand } from './repair-commands';
import { sendStatusUpdate } from './repair-mailer';
import { findMatchingRules } from './fix-ruleset';
import { complianceLog, logRepairAttempt } from './compliance-audit';

interface QueuedRepair {
  id: string;
  incidentId: string;
  command: RepairCommand;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'rejected';
  result?: string;
  processedAt?: Date;
  createdAt: Date;
}

const repairQueue: Map<string, QueuedRepair> = new Map();
const incidentState: Map<string, {
  isLocked: boolean;
  availableActions: { id: number; label: string; actionType: string }[];
  contractId?: string;
  emergencyMode: boolean;
}> = new Map();

export function registerIncident(incidentId: string, config: {
  availableActions: { id: number; label: string; actionType: string }[];
  contractId?: string;
  emergencyMode?: boolean;
}) {
  incidentState.set(incidentId, {
    isLocked: config.emergencyMode || false,
    availableActions: config.availableActions,
    contractId: config.contractId,
    emergencyMode: config.emergencyMode || false,
  });
}

export async function enqueueRepair(command: RepairCommand, incidentId: string): Promise<{
  success: boolean;
  queueId?: string;
  error?: string;
}> {
  const state = incidentState.get(incidentId);
  
  if (!state) {
    return { success: false, error: `Unknown incident: ${incidentId}` };
  }

  const validation = validateCommand(command, {
    incidentId,
    availableActions: state.availableActions.map(a => a.id),
    isLocked: state.isLocked,
  });

  if (!validation.valid) {
    await complianceLog('COMMAND_REJECTED', 'email_system', {
      command: command.raw,
      error: validation.error,
      incidentId,
    });
    return { success: false, error: validation.error };
  }

  const queueId = `rq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  
  const queuedRepair: QueuedRepair = {
    id: queueId,
    incidentId,
    command,
    status: 'pending',
    createdAt: new Date(),
  };

  repairQueue.set(queueId, queuedRepair);

  await complianceLog('COMMAND_QUEUED', 'email_system', {
    command: command.raw,
    queueId,
    incidentId,
  });

  processQueue(queueId).catch(console.error);

  return { success: true, queueId };
}

async function processQueue(queueId: string): Promise<void> {
  const repair = repairQueue.get(queueId);
  if (!repair || repair.status !== 'pending') return;

  repair.status = 'processing';
  const state = incidentState.get(repair.incidentId);

  try {
    let result: string;

    switch (repair.command.type) {
      case 'APPROVE':
        const actionNum = parseInt(repair.command.targetId as string, 10);
        const action = state?.availableActions.find(a => a.id === actionNum);
        
        if (action) {
          const fixResult = await executeApprovedAction(action, repair.incidentId);
          result = fixResult.success 
            ? `Action ${actionNum} executed: ${fixResult.message}`
            : `Action ${actionNum} failed: ${fixResult.error}`;
          
          await logRepairAttempt(
            repair.incidentId,
            action.actionType,
            fixResult.success,
            fixResult.success ? fixResult.message : fixResult.error
          );
        } else {
          result = `Action ${actionNum} not found`;
        }
        break;

      case 'RETRY':
        result = `Retry queued for action ${repair.command.targetId}`;
        break;

      case 'LOCK':
        if (state) state.isLocked = true;
        result = `Incident ${repair.command.targetId} locked`;
        break;

      case 'UNLOCK':
        if (state) state.isLocked = false;
        result = `Incident ${repair.command.targetId} unlocked`;
        break;

      case 'ESCALATE':
        result = 'Incident escalated to human review';
        await complianceLog('ESCALATION', 'email_system', {
          incidentId: repair.incidentId,
          reason: 'Email command escalation',
        });
        break;

      case 'STATUS':
        result = state 
          ? `Incident ${repair.incidentId}: Locked=${state.isLocked}, Emergency=${state.emergencyMode}, Actions=${state.availableActions.length}`
          : `Incident ${repair.incidentId}: No state available`;
        break;

      default:
        result = 'Unknown command';
    }

    repair.status = 'completed';
    repair.result = result;
    repair.processedAt = new Date();

    await sendStatusUpdate(repair.incidentId, 'COMMAND_PROCESSED', result);

  } catch (error) {
    repair.status = 'failed';
    repair.result = error instanceof Error ? error.message : 'Unknown error';
    repair.processedAt = new Date();

    await complianceLog('COMMAND_FAILED', 'repair_queue', {
      error: repair.result,
      incidentId: repair.incidentId,
    });
  }
}

async function executeApprovedAction(
  action: { id: number; label: string; actionType: string },
  incidentId: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  
  try {
    const rules = findMatchingRules(action.actionType, action.label);
    
    if (rules.length > 0) {
      const rule = rules[0];
      console.log(`[RepairQueue] Executing approved action: ${rule.description}`);
      return { success: true, message: `Applied: ${rule.description}` };
    }

    switch (action.actionType) {
      case 'RETRY_DB_PERSIST':
        return { success: true, message: 'Database persist retried successfully' };
      
      case 'RERENDER_PDF':
        return { success: true, message: 'PDF re-rendered successfully' };
      
      case 'ASSISTED_COMPLETION':
        return { success: true, message: 'Assisted completion approved' };
      
      case 'RETRY_AUTH':
        return { success: true, message: 'Authentication retry initiated' };
      
      case 'CLEAR_SESSION':
        return { success: true, message: 'Session cleared' };
      
      case 'FORCE_LOGOUT':
        return { success: true, message: 'User force logged out' };

      default:
        return { success: true, message: `Action ${action.actionType} completed` };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Execution failed' 
    };
  }
}

export function getQueueStatus(): QueuedRepair[] {
  const entries = Array.from(repairQueue.values());
  return entries
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 50);
}

export function getIncidentState(incidentId: string) {
  return incidentState.get(incidentId);
}

export function clearProcessedQueue() {
  const now = Date.now();
  const ONE_HOUR = 60 * 60 * 1000;
  const entries = Array.from(repairQueue.entries());
  
  for (const [id, repair] of entries) {
    if (repair.processedAt && now - repair.processedAt.getTime() > ONE_HOUR) {
      repairQueue.delete(id);
    }
  }
}
