// src/lib/authFetch.ts
/**
 * Lightweight type guard for plain objects.
 */
function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

/**
 * Fetch helper that injects a fresh access token, handles JSON parsing,
 * and normalizes errors.
 */
export async function authFetch<Out = unknown>(
  path: string,
  opts: RequestInit = {},
  getValidAccessToken: () => Promise<string | null>
): Promise<Out> {
  const token = await getValidAccessToken();
  const url = `${process.env.NEXT_PUBLIC_API_URL}${path}`;

  // Build headers via Headers so we can safely set values.
  const headers = new Headers(opts.headers ?? {});
  if (!headers.has("Content-Type") && !(opts.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(url, {
    ...opts,
    headers,
    credentials: "include", // keep if backend uses HttpOnly refresh cookie
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    let message = res.statusText;
    if (isRecord(data)) {
      if (typeof data.detail === "string") message = data.detail;
      else if (typeof data.error === "string") message = data.error;
    }
    const err: Error & { status?: number; data?: unknown } = new Error(
      message || "Request failed"
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as Out;
}
