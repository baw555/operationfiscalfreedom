import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _supabaseAdmin: SupabaseClient | null = null;

function getSupabaseAdmin(): SupabaseClient {
  if (!_supabaseAdmin) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error('[PHI_VAULT] SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for PHI operations');
    }
    _supabaseAdmin = createClient(url, key);
  }
  return _supabaseAdmin;
}

function isAvailable(): boolean {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export interface PhiRecord {
  ssn?: string;
  medicalHistory?: string;
  disabilityRating?: string;
  conditions?: string;
  treatmentDetails?: string;
  privateNotes?: string;
}

export interface AuditEntry {
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  ipAddress?: string;
  timestamp: string;
}

async function logAccess(entry: Omit<AuditEntry, 'timestamp'>): Promise<void> {
  try {
    await getSupabaseAdmin().from('phi_audit_log').insert({
      user_id: entry.userId,
      action: entry.action,
      entity_type: entry.entityType,
      entity_id: entry.entityId,
      ip_address: entry.ipAddress ?? null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[PHI_VAULT] Audit log write failed — continuing without blocking');
  }
}

export const phiVault = {
  async store(
    replitUserId: string,
    phiData: PhiRecord,
    accessorInfo: { userId: string; ipAddress?: string }
  ): Promise<{ externalId: string }> {
    const { data, error } = await getSupabaseAdmin()
      .from('veteran_phi')
      .upsert(
        {
          external_id: replitUserId,
          ssn_encrypted: phiData.ssn ?? null,
          medical_history: phiData.medicalHistory ?? null,
          disability_rating: phiData.disabilityRating ?? null,
          conditions: phiData.conditions ?? null,
          treatment_details: phiData.treatmentDetails ?? null,
          private_notes: phiData.privateNotes ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'external_id' }
      )
      .select('id')
      .single();

    if (error) {
      console.error('[PHI_VAULT] Store failed:', error.message);
      throw new Error('Failed to store sensitive data');
    }

    await logAccess({
      userId: accessorInfo.userId,
      action: 'WRITE_PHI',
      entityType: 'veteran_phi',
      entityId: replitUserId,
      ipAddress: accessorInfo.ipAddress,
    });

    return { externalId: data.id };
  },

  async retrieve(
    replitUserId: string,
    accessorInfo: { userId: string; ipAddress?: string }
  ): Promise<PhiRecord | null> {
    const { data, error } = await getSupabaseAdmin()
      .from('veteran_phi')
      .select('ssn_encrypted, medical_history, disability_rating, conditions, treatment_details, private_notes')
      .eq('external_id', replitUserId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('[PHI_VAULT] Retrieve failed:', error.message);
      throw new Error('Failed to retrieve sensitive data');
    }

    await logAccess({
      userId: accessorInfo.userId,
      action: 'READ_PHI',
      entityType: 'veteran_phi',
      entityId: replitUserId,
      ipAddress: accessorInfo.ipAddress,
    });

    if (!data) return null;

    return {
      ssn: data.ssn_encrypted ?? undefined,
      medicalHistory: data.medical_history ?? undefined,
      disabilityRating: data.disability_rating ?? undefined,
      conditions: data.conditions ?? undefined,
      treatmentDetails: data.treatment_details ?? undefined,
      privateNotes: data.private_notes ?? undefined,
    };
  },

  async delete(
    replitUserId: string,
    accessorInfo: { userId: string; ipAddress?: string }
  ): Promise<void> {
    const { error } = await getSupabaseAdmin()
      .from('veteran_phi')
      .delete()
      .eq('external_id', replitUserId);

    if (error) {
      console.error('[PHI_VAULT] Delete failed:', error.message);
      throw new Error('Failed to delete sensitive data');
    }

    await logAccess({
      userId: accessorInfo.userId,
      action: 'DELETE_PHI',
      entityType: 'veteran_phi',
      entityId: replitUserId,
      ipAddress: accessorInfo.ipAddress,
    });
  },

  isAvailable,
  logAccess,
};
