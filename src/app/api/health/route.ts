import { NextResponse } from "next/server";
import { startSpan } from "@/lib/otel";

export const dynamic = "force-dynamic";

export function GET() {
  const span = startSpan("http.health", { "http.route": "/api/health" });
  try {
    return NextResponse.json({
      status: "ok",
      service: "vitalis",
      timestamp: new Date().toISOString(),
    });
  } finally {
    span.end({ "http.status_code": 200 });
  }
}
