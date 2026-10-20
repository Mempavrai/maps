/** Canonical format of every file under `public/data/`: 2 spaces + trailing newline. */
export function serializeJson(data: unknown): string {
  return `${JSON.stringify(data, null, 2)}\n`
}
