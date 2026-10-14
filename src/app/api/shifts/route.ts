import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shiftSchema } from "@/lib/care-records";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (session.user.role !== "ADMIN") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = shiftSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const staff = await prisma.user.findFirst({ where: { id: parsed.data.staffId, facilityId: session.user.facilityId, status: "ACTIVE" }, select: { id: true } });
  if (!staff) return NextResponse.json({ error: "staff_not_found" }, { status: 404 });
  const shift = await prisma.shift.create({ data: { ...parsed.data, facilityId: session.user.facilityId, startTime: new Date(parsed.data.startTime), endTime: new Date(parsed.data.endTime) }, select: { id: true } });
  return NextResponse.json(shift, { status: 201 });
}
