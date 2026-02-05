export type RepairCommandType = 
  | 'APPROVE'
  | 'RETRY'
  | 'LOCK'
  | 'UNLOCK'
  | 'ESCALATE'
  | 'STATUS';

export interface RepairCommand {
  type: RepairCommandType;
  targetId?: string | number;
  raw: string;
  timestamp: Date;
  source: 'email' | 'admin_ui' | 'api';
}

const COMMAND_PATTERNS: Record<RepairCommandType, RegExp> = {
  APPROVE: /^APPROVE\s+(\d+)$/i,
  RETRY: /^RETRY\s+(\d+)$/i,
  LOCK: /^LOCK\s+([a-zA-Z0-9_-]+)$/i,
  UNLOCK: /^UNLOCK\s+([a-zA-Z0-9_-]+)$/i,
  ESCALATE: /^ESCALATE$/i,
  STATUS: /^STATUS$/i,
};

export function parseCommand(text: string, source: 'email' | 'admin_ui' | 'api' = 'email'): RepairCommand | null {
  if (!text || typeof text !== 'string') return null;

  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  for (const line of lines) {
    const cleanLine = line.toUpperCase().trim();
    
    for (const [cmdType, pattern] of Object.entries(COMMAND_PATTERNS)) {
      const match = cleanLine.match(pattern);
      if (match) {
        return {
          type: cmdType as RepairCommandType,
          targetId: match[1] || undefined,
          raw: line,
          timestamp: new Date(),
          source,
        };
      }
    }
  }

  return null;
}

export function validateCommand(command: RepairCommand, context: {
  incidentId: string;
  availableActions: number[];
  isLocked: boolean;
}): { valid: boolean; error?: string } {
  
  switch (command.type) {
    case 'APPROVE':
    case 'RETRY':
      const actionNum = parseInt(command.targetId as string, 10);
      if (!context.availableActions.includes(actionNum)) {
        return { valid: false, error: `Action ${actionNum} not available. Valid: ${context.availableActions.join(', ')}` };
      }
      if (context.isLocked && command.type === 'APPROVE') {
        return { valid: false, error: 'Incident is locked. Use UNLOCK first.' };
      }
      return { valid: true };

    case 'LOCK':
    case 'UNLOCK':
      if (!command.targetId) {
        return { valid: false, error: 'Contract/Incident ID required' };
      }
      return { valid: true };

    case 'ESCALATE':
    case 'STATUS':
      return { valid: true };

    default:
      return { valid: false, error: 'Unknown command type' };
  }
}

export function formatCommandHelp(): string {
  return `
FACER-C COMMAND REFERENCE
═════════════════════════

APPROVE <N>    Execute safe action #N
RETRY <N>      Retry failed action #N
LOCK <ID>      Lock contract/incident
UNLOCK <ID>    Unlock for editing
ESCALATE       Flag for human review
STATUS         Get current status

Example: APPROVE 1
  `.trim();
}
