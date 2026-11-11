import { isDbConfigured, query } from "./db";
import { CONTENT_FIELDS } from "./content-fields";

export type ContentMap = Record<string, string>;

/**
 * Returns every editable field. The DB value wins when present; otherwise the
 * code default is used, so the site always renders even if the DB is empty or
 * unreachable.
 */
export async function getContent(): Promise<ContentMap> {
  const map: ContentMap = {};
  for (const field of CONTENT_FIELDS) map[field.key] = field.default;

  if (!isDbConfigured()) return map;

  try {
    const rows = await query<{ key: string; value: string }>(
      "select key, value from content_blocks"
    );
    const known = new Set(CONTENT_FIELDS.map((field) => field.key));
    for (const row of rows) {
      if (known.has(row.key) && row.value != null) map[row.key] = row.value;
    }
  } catch {
    // Fail open: keep the code defaults.
  }

  return map;
}

export async function getContentValue(key: string): Promise<string> {
  const map = await getContent();
  return map[key] ?? "";
}
