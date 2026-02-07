import { db } from "../db";
import { idempotencyKeys } from "@shared/schema";
import { eq } from "drizzle-orm";

export type IdempotencyReplay = { replay: true; entityId: number };

export function isReplay(result: any): result is IdempotencyReplay {
  return result && result.replay === true && typeof result.entityId === "number";
}

export function withIdempotency<TInput extends {
  idempotencyKey: string;
  userId: number;
}, TResult extends { entityId?: number }>(
  actionName: string,
  handler: (tx: any, input: TInput) => Promise<TResult>
) {
  return async function run(input: TInput): Promise<TResult | IdempotencyReplay> {
    return await db.transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(idempotencyKeys)
        .where(eq(idempotencyKeys.key, input.idempotencyKey));

      if (existing.length) {
        if (existing[0].userId !== input.userId) {
          throw Object.assign(new Error("Invalid request"), { statusCode: 400 });
        }
        if (existing[0].entityId) {
          return { replay: true as const, entityId: existing[0].entityId };
        }
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await tx.insert(idempotencyKeys).values({
        key: input.idempotencyKey,
        userId: input.userId,
        action: actionName,
        expiresAt,
      }).onConflictDoNothing();

      const result = await handler(tx, input);

      if (result.entityId) {
        await tx
          .update(idempotencyKeys)
          .set({ entityId: result.entityId })
          .where(eq(idempotencyKeys.key, input.idempotencyKey));
      }

      return result;
    });
  };
}
