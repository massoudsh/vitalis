import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell";

const severityClass: Record<string, string> = { NORMAL: "bg-surface-muted text-muted-foreground", WATCH: "bg-amber-50 text-amber-700", CONCERN: "bg-orange-50 text-orange-700", URGENT: "bg-red-50 text-red-700" };
const severityLabel: Record<string, string> = { NORMAL: "عادی", WATCH: "تحت نظر", CONCERN: "نگران‌کننده", URGENT: "فوری" };
const medStatusLabel: Record<string, string> = { GIVEN: "داده‌شده", MISSED: "فراموش‌شده", REFUSED: "امتناع", DELAYED: "تأخیر" };
const riskLabel: Record<string, string> = { LOW: "کم", MEDIUM: "متوسط", HIGH: "زیاد", CRITICAL: "بحرانی" };
const riskClass: Record<string, string> = { LOW: "bg-emerald-50 text-emerald-700", MEDIUM: "bg-amber-50 text-amber-700", HIGH: "bg-orange-50 text-orange-700", CRITICAL: "bg-red-50 text-red-700" };
const typeMeta: Record<string, { icon: string; tone: string }> = {
  "علائم حیاتی": { icon: "♥", tone: "bg-rose-50 text-rose-600" },
  دارو: { icon: "℞", tone: "bg-blue-50 text-blue-700" },
  "یادداشت مراقبتی": { icon: "✎", tone: "bg-emerald-50 text-emerald-700" },
  حادثه: { icon: "!", tone: "bg-red-50 text-red-600" },
  "تحویل شیفت": { icon: "↗", tone: "bg-amber-50 text-amber-700" },
};

type TimelineItem = { id: string; type: string; at: Date; summary: string; by: string; severity?: string };

export default async function ResidentTimelinePage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resident = await prisma.resident.findFirst({ where: { id: params.id, facilityId: session.user.facilityId } });
  if (!resident) notFound();

  const [vitals, medAdmins, careNotes, incidents, handoffs] = await Promise.all([
    prisma.vitalSign.findMany({ where: { residentId: resident.id }, include: { recordedBy: true } }),
    prisma.medicationAdministration.findMany({ where: { residentId: resident.id }, include: { medication: true, administeredBy: true } }),
    prisma.careNote.findMany({ where: { residentId: resident.id }, include: { author: true } }),
    prisma.incidentReport.findMany({ where: { residentId: resident.id }, include: { reportedBy: true } }),
    prisma.handoffNote.findMany({ where: { residentId: resident.id }, include: { fromStaff: true } }),
  ]);

  const items: TimelineItem[] = [
    ...vitals.map((v) => ({ id: v.id, type: "علائم حیاتی", at: v.recordedAt, summary: `فشار ${v.bloodPressureSystolic ?? "—"}/${v.bloodPressureDiastolic ?? "—"} · ضربان ${v.heartRate ?? "—"} · دما ${v.temperature ?? "—"} · SpO2 ${v.spo2 ?? "—"}`, by: v.recordedBy.fullName })),
    ...medAdmins.map((m) => ({ id: m.id, type: "دارو", at: m.administeredTime ?? m.scheduledTime, summary: `${m.medication.name} — ${medStatusLabel[m.status]}`, by: m.administeredBy.fullName })),
    ...careNotes.map((c) => ({ id: c.id, type: "یادداشت مراقبتی", at: c.createdAt, summary: c.content, by: c.author.fullName, severity: c.severity })),
    ...incidents.map((i) => ({ id: i.id, type: "حادثه", at: i.createdAt, summary: i.description, by: i.reportedBy.fullName, severity: i.severity })),
    ...handoffs.map((h) => ({ id: h.id, type: "تحویل شیفت", at: h.createdAt, summary: h.content, by: h.fromStaff.fullName })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <AppShell userName={session.user.name}>
      <Link href="/residents" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand">→ بازگشت به فهرست سالمندان</Link>
      <PageIntro eyebrow="Care Timeline" title={resident.fullName} description={`${resident.roomNumber ? `اتاق ${resident.roomNumber} · ` : ""}خط زمانی زندهٔ مراقبت از اولین تا آخرین رکورد ثبت‌شده.`} action={<span className={`rounded-full px-4 py-2 text-xs font-bold ${riskClass[resident.riskLevel]}`}>ریسک {riskLabel[resident.riskLevel]}</span>} />

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_2fr]">
        <SectionCard>
          <h2 className="text-sm font-black text-muted-foreground">خلاصهٔ پرونده</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">وضعیت</dt><dd className="font-bold">{resident.status === "ACTIVE" ? "فعال" : resident.status}</dd></div>
            <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">تاریخ پذیرش</dt><dd className="font-bold">{resident.admissionDate.toLocaleDateString("fa-IR")}</dd></div>
            <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">تشخیص اصلی</dt><dd className="font-bold">{resident.primaryDiagnosis ?? "ثبت‌نشده"}</dd></div>
            <div className="flex items-center justify-between gap-3"><dt className="text-muted-foreground">آلرژی‌ها</dt><dd className="font-bold">{resident.allergies ?? "ثبت‌نشده"}</dd></div>
            <div className="flex items-center justify-between gap-3 border-t pt-3"><dt className="text-muted-foreground">تعداد رکوردها</dt><dd className="font-black text-brand">{items.length}</dd></div>
          </dl>
        </SectionCard>
        <SectionCard>
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-black">خط زمانی مراقبت</h2><p className="mt-1 text-sm text-muted-foreground">آخرین رخدادها بر اساس زمان ثبت</p></div><span className="rounded-xl bg-surface-muted px-3 py-2 text-xs font-bold">{items.length} رکورد</span></div>
          {items.length === 0 ? <div className="py-12 text-center"><p className="font-black">هنوز رکوردی ثبت نشده</p><p className="mt-1 text-sm text-muted-foreground">اولین رکورد مراقبت این سالمند را ثبت کنید.</p></div> : (
            <ol className="mt-6 space-y-4">
              {items.map((item) => { const meta = typeMeta[item.type] ?? { icon: "•", tone: "bg-surface-muted text-muted-foreground" }; return (
                <li key={`${item.type}-${item.id}`} className="flex gap-4">
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${meta.tone}`}>{meta.icon}</span>
                  <div className="flex-1 rounded-2xl border bg-background p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-black">{item.type}</span><span className="text-xs text-muted-foreground">{item.at.toLocaleString("fa-IR")}</span></div>
                    <p className="mt-2 text-sm leading-7">{item.summary}</p>
                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2"><span className="text-xs text-muted-foreground">ثبت‌کننده: {item.by}</span>{item.severity && <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${severityClass[item.severity] ?? severityClass.NORMAL}`}>{severityLabel[item.severity] ?? item.severity}</span>}</div>
                  </div>
                </li>); })}
            </ol>
          )}
        </SectionCard>
      </div>
    </AppShell>
  );
}
