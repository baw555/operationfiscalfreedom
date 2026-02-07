import { db } from "../db";
import { identityMap } from "@shared/schema";
import { sql } from "drizzle-orm";
import type { ResolvedIdentity } from "./resolveIdentity";

type IdentitySource = "user" | "vlt_affiliate" | "veteran_oidc" | "ai" | "internal_service";

function mapKindToSource(kind: string): IdentitySource {
  switch (kind) {
    case "internal": return "internal_service";
    case "veteran": return "veteran_oidc";
    case "vlt_affiliate": return "vlt_affiliate";
    case "user": return "user";
    default: return "user";
  }
}

export async function ensureIdentityMap(
  identity: ResolvedIdentity | null
): Promise<string | null> {
  if (!identity) return null;

  const source = mapKindToSource(identity.primary.kind);
  const legacyId = identity.primary.id;

  try {
    const [row] = await db
      .insert(identityMap)
      .values({ source, legacyId })
      .onConflictDoNothing({ target: [identityMap.source, identityMap.legacyId] })
      .returning({ identityId: identityMap.identityId });

    if (row) {
      return row.identityId;
    }

    const [existing] = await db
      .select({ identityId: identityMap.identityId })
      .from(identityMap)
      .where(
        sql`${identityMap.source} = ${source} AND ${identityMap.legacyId} = ${legacyId}`
      )
      .limit(1);

    if (identity.secondary) {
      const secSource = mapKindToSource(identity.secondary.kind);
      const secLegacyId = identity.secondary.id;
      db.insert(identityMap)
        .values({ source: secSource, legacyId: secLegacyId })
        .onConflictDoNothing({ target: [identityMap.source, identityMap.legacyId] })
        .then(() => {})
        .catch((err) => {
          console.error("[identity-map] Secondary shadow write failed:", err.message);
        });
    }

    return existing?.identityId ?? null;
  } catch (err: any) {
    console.error("[identity-map] Shadow write failed:", err.message);
    return null;
  }
}

export function ensureIdentityMapFireAndForget(
  identity: ResolvedIdentity | null
): void {
  if (!identity) return;
  ensureIdentityMap(identity).catch((err) => {
    console.error("[identity-map] Fire-and-forget failed:", err.message);
  });
}
