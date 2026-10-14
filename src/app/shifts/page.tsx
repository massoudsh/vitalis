import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell";
import { ShiftForm, ShiftStatusButton } from "@/components/shift-controls";

const typeLabel: Record<string, string> = { MORNING: "صبح", EVENING: "عصر", NIGHT: "شب" };
const statusLabel: Record<string, string> = { SCHEDULED: "زمان‌بندی‌شده", IN_PROGRESS: "در حال انجام", COMPLETED: "تکمیل‌شده", MISSED: "از دست‌رفته" };
export default async function ShiftsPage() {
  const session = await getServerSession(authOptions); if (!session) redirect("/login");
  const [shifts, staff] = await Promise.all([
    prisma.shift.findMany({ where: { facilityId: session.user.facilityId }, include: { staff: true }, orderBy: { startTime: "desc" }, take: 30 }),
    prisma.user.findMany({ where: { facilityId: session.user.facilityId, status: "ACTIVE", role: { in: ["ADMIN", "NURSE", "CAREGIVER"] } }, select: { id: true, fullName: true }, orderBy: { fullName: "asc" } }),
  ]);
  return <AppShell userName={session.user.name}><div className="relative"><PageIntro eyebrow="برنامه‌ریزی" title="شیفت‌ها" description="تقویم و وضعیت واقعی شیفت‌های مرکز را مدیریت کنید." action={<ShiftForm staff={staff} />} /></div><SectionCard className="overflow-hidden p-0"><div className="hidden grid-cols-[0.7fr_1fr_1fr_1fr_0.8fr] gap-4 border-b bg-surface-muted/50 px-6 py-4 text-xs font-bold text-muted-foreground md:grid"><span>نوع</span><span>شروع</span><span>پایان</span><span>پرسنل</span><span>وضعیت</span></div>{shifts.length===0?<div className="p-12 text-center text-sm text-muted-foreground">هنوز شیفتی ثبت نشده است.</div>:<ul className="divide-y">{shifts.map((shift)=><li key={shift.id} className="grid gap-2 px-5 py-4 md:grid-cols-[0.7fr_1fr_1fr_1fr_0.8fr] md:items-center md:gap-4 md:px-6"><span className="font-black">شیفت {typeLabel[shift.type]}</span><span className="text-sm text-muted-foreground">{shift.startTime.toLocaleString("fa-IR")}</span><span className="text-sm text-muted-foreground">{shift.endTime.toLocaleString("fa-IR")}</span><span className="text-sm font-bold">{shift.staff.fullName}</span><div className="flex items-center gap-2"><span className="text-xs text-muted-foreground">{statusLabel[shift.status]}</span><ShiftStatusButton id={shift.id} status={shift.status}/></div></li>)}</ul>}</SectionCard></AppShell>;
}
