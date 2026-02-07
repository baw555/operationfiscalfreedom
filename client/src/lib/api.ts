export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function api<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });

  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");

  const body = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    throw new ApiError(res.status, body?.message || res.statusText);
  }

  return body as T;
}
