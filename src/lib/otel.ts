/**
 * Lightweight OpenTelemetry-compatible tracing stub.
 * When OTEL_EXPORTER_OTLP_ENDPOINT is set, spans are exported via fetch OTLP/HTTP JSON.
 * Otherwise spans are no-ops (safe for local/CI without a collector).
 */

import { randomUUID } from "crypto";

export interface SpanHandle {
  end(attrs?: Record<string, string | number | boolean>): void;
}

interface ActiveSpan {
  name: string;
  traceId: string;
  spanId: string;
  start: number;
  attrs: Record<string, string | number | boolean>;
}

function exporterEndpoint(): string | undefined {
  return process.env.OTEL_EXPORTER_OTLP_ENDPOINT?.replace(/\/$/, "");
}

async function exportSpan(span: ActiveSpan, endMs: number): Promise<void> {
  const endpoint = exporterEndpoint();
  if (!endpoint) return;

  const body = {
    resourceSpans: [
      {
        resource: {
          attributes: [
            { key: "service.name", value: { stringValue: "vitalis" } },
          ],
        },
        scopeSpans: [
          {
            spans: [
              {
                traceId: span.traceId,
                spanId: span.spanId,
                name: span.name,
                kind: 1,
                startTimeUnixNano: String(span.start * 1e6),
                endTimeUnixNano: String(endMs * 1e6),
                attributes: Object.entries(span.attrs).map(([key, value]) => ({
                  key,
                  value:
                    typeof value === "number"
                      ? { doubleValue: value }
                      : typeof value === "boolean"
                        ? { boolValue: value }
                        : { stringValue: String(value) },
                })),
              },
            ],
          },
        ],
      },
    ],
  };

  try {
    await fetch(`${endpoint}/v1/traces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    // Never fail the request path because of telemetry.
  }
}

export function startSpan(
  name: string,
  attrs: Record<string, string | number | boolean> = {},
): SpanHandle {
  const span: ActiveSpan = {
    name,
    traceId: randomUUID().replace(/-/g, ""),
    spanId: randomUUID().replace(/-/g, "").slice(0, 16),
    start: Date.now(),
    attrs,
  };

  return {
    end(endAttrs = {}) {
      void exportSpan(
        { ...span, attrs: { ...span.attrs, ...endAttrs } },
        Date.now(),
      );
    },
  };
}
