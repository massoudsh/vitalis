import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const createResidentSchema = z.object({
  fullName: z.string().min(2),
  birthDate: z.string().min(1),
  gender: z.enum(["MALE", "FEMALE"]),
  roomNumber: z.string().optional(),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("LOW"),
  primaryDiagnosis: z.string().optional(),
  allergies: z.string().optional(),
});

// فقط ADMIN و NURSE اجازهٔ ثبت سالمند جدید دارند (طبق docs/wiki/concepts/rbac.md)
const ALLOWED_ROLES = ["ADMIN", "NURSE"];

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!ALLOWED_ROLES.includes(session.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createResidentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const resident = await prisma.resident.create({
    data: {
      facilityId: session.user.facilityId,
      fullName: parsed.data.fullName,
      birthDate: new Date(parsed.data.birthDate),
      gender: parsed.data.gender,
      roomNumber: parsed.data.roomNumber || null,
      riskLevel: parsed.data.riskLevel,
      primaryDiagnosis: parsed.data.primaryDiagnosis || null,
      allergies: parsed.data.allergies || null,
    },
  });

  return NextResponse.json({ id: resident.id }, { status: 201 });
}
