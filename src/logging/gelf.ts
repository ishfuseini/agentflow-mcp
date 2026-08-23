/**
 * Minimal GELF-over-HTTP logger for Graylog (task 6.1).
 *
 * Sends GELF 1.1 JSON messages to a Graylog "GELF HTTP" input via HTTP POST.
 * Zero dependencies: uses Node's global `fetch` (>= 20). Non-blocking and
 * best-effort — messages are queued and flushed in the background; failures
 * fall back to console.error and never affect the MCP request path.
 *
 * Enable by setting GRAYLOG_GELF_URL (e.g. "http://graylog:12201/gelf").
 * GRAYLOG_SOURCE optionally overrides the source/host name (default "agentflow-mcp").
 */

const GELF_LEVEL = {
  emergency: 0,
  alert: 1,
  critical: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
} as const;

export type GelfLevel = keyof typeof GELF_LEVEL;

export interface GelfMessage {
  shortMessage: string;
  fullMessage?: string;
  level?: GelfLevel;
  /** Custom fields — keys are prefixed with `_` so Graylog indexes them. */
  fields?: Record<string, string | number | boolean | null | undefined>;
}

// Read env lazily so a .env loaded by the caller (process.loadEnvFile) is seen.
const gelfUrl = (): string => process.env.GRAYLOG_GELF_URL ?? "";
const sourceName = (): string => process.env.GRAYLOG_SOURCE ?? "agentflow-mcp";

const MAX_QUEUE = 1000;
const queue: string[] = [];
let flushPromise: Promise<void> | undefined;

/** Serialize a GELF 1.1 message. Exported for tests. */
export function buildGelf(m: GelfMessage): string {
  const msg: Record<string, string | number | boolean> = {
    version: "1.1",
    host: sourceName(),
    short_message: m.shortMessage,
    timestamp: Date.now() / 1000,
    level: GELF_LEVEL[m.level ?? "info"],
  };
  if (m.fullMessage) msg.full_message = m.fullMessage;
  for (const [key, value] of Object.entries(m.fields ?? {})) {
    if (value === undefined || value === null) continue;
    msg[key.startsWith("_") ? key : `_${key}`] = value;
  }
  return JSON.stringify(msg);
}

/**
 * Drain the queue, POSTing each message to Graylog. Concurrent callers share
 * the in-flight drain (so a test can await the flush that logGelf started).
 * Exported for tests.
 */
export function flushGelf(): Promise<void> {
  if (flushPromise) return flushPromise;
  const p = (async () => {
    const target = gelfUrl();
    if (!target) return;
    while (queue.length > 0) {
      const body = queue.shift();
      if (body === undefined) break; // queue.length > 0 guarantees a message
      try {
        const res = await fetch(target, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
          signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) {
          console.error(`[gelf] Graylog returned ${res.status} ${res.statusText}`);
        }
      } catch (err) {
        console.error(
          "[gelf] failed to send log to Graylog:",
          err instanceof Error ? err.message : String(err),
        );
      }
    }
  })().finally(() => {
    flushPromise = undefined;
  });
  flushPromise = p;
  return p;
}

/** Fire-and-forget structured log to Graylog. No-op unless GRAYLOG_GELF_URL is set. */
export function logGelf(m: GelfMessage): void {
  if (!gelfUrl()) return;
  if (queue.length >= MAX_QUEUE) {
    queue.shift();
    console.error("[gelf] queue full, dropping oldest message");
  }
  queue.push(buildGelf(m));
  void flushGelf();
}

/** Wrap an MCP tool handler so tool calls and errors are logged to Graylog. */
export function withToolLogging<TArgs, TResult>(
  tool: string,
  handler: (args: TArgs) => Promise<TResult>,
): (args: TArgs) => Promise<TResult> {
  return async (args) => {
    const started = Date.now();
    try {
      const result = await handler(args);
      logGelf({
        shortMessage: `tool_call ${tool} ok`,
        level: "info",
        fields: { tool, duration_ms: Date.now() - started, ok: true },
      });
      return result;
    } catch (err) {
      logGelf({
        shortMessage: `tool_call ${tool} error`,
        level: "error",
        fullMessage: err instanceof Error ? (err.stack ?? err.message) : String(err),
        fields: {
          tool,
          duration_ms: Date.now() - started,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        },
      });
      throw err;
    }
  };
}
