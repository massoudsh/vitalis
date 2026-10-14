import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions); if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null); const status = body?.status;
  if (!["IN_PROGRESS", "COMPLETED"].includes(status)) return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  const shift = await prisma.shift.findFirst({ where: { id: params.id, facilityId: session.user.facilityId }, select: { id: true, staffId: true, status: true } });
  if (!shift) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (session.user.role !== "ADMIN" && shift.staffId !== session.user.id) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  await prisma.shift.update({ where: { id: shift.id }, data: { status } }); return NextResponse.json({ ok: true });
}
