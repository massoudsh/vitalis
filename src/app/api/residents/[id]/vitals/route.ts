import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createVitalSignSchema } from "@/lib/vitals";

const ALLOWED_ROLES = ["ADMIN", "NURSE", "CAREGIVER"];

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!ALLOWED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const resident = await prisma.resident.findFirst({
    where: {
      id: params.id,
      facilityId: session.user.facilityId,
      status: "ACTIVE",
    },
    select: { id: true },
  });
  if (!resident) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  const parsed = createVitalSignSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const vital = await prisma.vitalSign.create({
    data: {
      ...parsed.data,
      notes: parsed.data.notes || null,
      residentId: resident.id,
      recordedById: session.user.id,
    },
    select: { id: true },
  });

  return NextResponse.json({ id: vital.id }, { status: 201 });
}
