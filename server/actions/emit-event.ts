import { db } from "../db";
import { events } from "@shared/schema";

interface EmitEventParams {
  eventType: string;
  userId: number;
  entityId?: number;
  entityType?: string;
  payload: Record<string, unknown>;
  degraded?: boolean;
}

export function emitEvent(params: EmitEventParams): void {
  const { eventType, userId, entityId, entityType, payload, degraded } = params;

  db.insert(events)
    .values({
      eventType,
      userId,
      entityId: entityId ?? null,
      entityType: entityType ?? null,
      payload,
      degraded: degraded ?? false,
    })
    .then(() => {
      console.log(`[Event] ${eventType} for user ${userId}${entityType ? ` on ${entityType}:${entityId}` : ""}`);
    })
    .catch((err) => {
      console.error(`[Event] Failed to emit ${eventType} for user ${userId}:`, err?.message);
    });
}
