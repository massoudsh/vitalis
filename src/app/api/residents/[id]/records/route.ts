import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { careRecordSchema } from "@/lib/care-records";

const WRITERS = ["ADMIN", "NURSE", "CAREGIVER"];
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!WRITERS.includes(session.user.role)) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const resident = await prisma.resident.findFirst({ where: { id: params.id, facilityId: session.user.facilityId, status: "ACTIVE" }, select: { id: true } });
  if (!resident) return NextResponse.json({ error: "not_found" }, { status: 404 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid_body" }, { status: 400 }); }
  const parsed = careRecordSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_body", details: parsed.error.flatten() }, { status: 400 });
  const data = parsed.data;
  if (data.type === "CARE_NOTE") await prisma.careNote.create({ data: { residentId: resident.id, authorId: session.user.id, category: data.category, content: data.content, severity: data.severity } });
  if (data.type === "INCIDENT") await prisma.incidentReport.create({ data: { residentId: resident.id, reportedById: session.user.id, type: data.incidentType, description: data.description, severity: data.severity, actionTaken: data.actionTaken || null, familyNotifiedAt: data.familyNotified ? new Date() : null } });
  if (data.type === "MEDICATION") await prisma.medication.create({ data: { residentId: resident.id, name: data.name, dosage: data.dosage, route: data.route, frequency: data.frequency, instructions: data.instructions || null, startDate: new Date() } });
  if (data.type === "MEDICATION_ADMINISTRATION") {
    const medication = await prisma.medication.findFirst({ where: { id: data.medicationId, residentId: resident.id, active: true }, select: { id: true } });
    if (!medication) return NextResponse.json({ error: "medication_not_found" }, { status: 404 });
    await prisma.medicationAdministration.create({ data: { medicationId: medication.id, residentId: resident.id, administeredById: session.user.id, scheduledTime: new Date(), administeredTime: data.status === "GIVEN" ? new Date() : null, status: data.status, notes: data.notes || null } });
  }
  return NextResponse.json({ ok: true }, { status: 201 });
}
