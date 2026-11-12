import { isDbConfigured, query } from "./db";

/**
 * A tiny DB-backed sliding-window rate limiter.
 *
 * Fails open: if the DB is down or the query errors, the request is allowed,
 * so a transient storage hiccup never locks people out of the site.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  if (!isDbConfigured()) return { allowed: true, remaining: limit };

  try {
    const rows = await query<{ count: number }>(
      `insert into throttle (key, count, window_start)
       values ($1, 1, now())
       on conflict (key) do update set
         count = case
           when throttle.window_start < now() - make_interval(secs => $2) then 1
           else throttle.count + 1
         end,
         window_start = case
           when throttle.window_start < now() - make_interval(secs => $2) then now()
           else throttle.window_start
         end
       returning count`,
      [key, windowSeconds]
    );
    const count = rows[0]?.count ?? 0;
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    return { allowed: true, remaining: limit };
  }
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}
