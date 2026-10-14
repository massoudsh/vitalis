import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handoffSchema } from "@/lib/care-records";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!["ADMIN", "NURSE", "CAREGIVER"].includes(session.user.role)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = handoffSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const shift = await prisma.shift.findFirst({ where: { id: parsed.data.shiftId, facilityId: session.user.facilityId }, select: { id: true } });
  if (!shift) return NextResponse.json({ error: "shift_not_found" }, { status: 404 });
  if (parsed.data.residentId) {
    const resident = await prisma.resident.findFirst({ where: { id: parsed.data.residentId, facilityId: session.user.facilityId }, select: { id: true } });
    if (!resident) return NextResponse.json({ error: "resident_not_found" }, { status: 404 });
  }
  const handoff = await prisma.handoffNote.create({ data: { shiftId: shift.id, residentId: parsed.data.residentId || null, fromStaffId: session.user.id, content: parsed.data.content, priority: parsed.data.priority }, select: { id: true } });
  return NextResponse.json(handoff, { status: 201 });
}
