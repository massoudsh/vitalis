import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
export async function PATCH(req: Request, { params }: { params: { id: string } }) { const session=await getServerSession(authOptions); if(!session)return NextResponse.json({error:"unauthorized"},{status:401}); const handoff=await prisma.handoffNote.findFirst({where:{id:params.id,shift:{facilityId:session.user.facilityId}},select:{id:true}}); if(!handoff)return NextResponse.json({error:"not_found"},{status:404}); await prisma.handoffNote.update({where:{id:handoff.id},data:{acknowledgedAt:new Date()}}); return NextResponse.json({ok:true}); }
