import { db } from "../db";
import { idempotencyKeys } from "@shared/schema";
import { eq } from "drizzle-orm";

export function withIdempotency<TInput extends {
  idempotencyKey: string;
  userId: number;
}, TResult>(
  actionName: string,
  handler: (tx: any, input: TInput) => Promise<TResult & { entityId?: number }>
) {
  return async function run(input: TInput): Promise<TResult & { replay?: boolean }> {
    return await db.transaction(async (tx) => {
      const existing = await tx
        .select()
        .from(idempotencyKeys)
        .where(eq(idempotencyKeys.key, input.idempotencyKey));

      if (existing.length && existing[0].entityId) {
        return { ...(existing[0] as any), replay: true };
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await tx.insert(idempotencyKeys).values({
        key: input.idempotencyKey,
        userId: input.userId,
        action: actionName,
        expiresAt,
      });

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
