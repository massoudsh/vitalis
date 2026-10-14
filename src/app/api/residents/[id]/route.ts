import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { residentUpdateSchema } from "@/lib/care-records";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!(["ADMIN", "NURSE"] as string[]).includes(session.user.role)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid_body" }, { status: 400 }); }
  const parsed = residentUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  const resident = await prisma.resident.updateMany({ where: { id: params.id, facilityId: session.user.facilityId }, data: { ...parsed.data, roomNumber: parsed.data.roomNumber || null, primaryDiagnosis: parsed.data.primaryDiagnosis || null, allergies: parsed.data.allergies || null, dischargeDate: parsed.data.status === "ACTIVE" ? null : new Date() } });
  if (!resident.count) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
