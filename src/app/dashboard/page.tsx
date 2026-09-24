import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const facilityId = session.user.facilityId;
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const [highRiskCount, overdueMedsCount, pendingHandoffsCount, incidentsThisWeekCount] =
    await Promise.all([
      prisma.resident.count({ where: { facilityId, status: "ACTIVE", riskLevel: { in: ["HIGH", "CRITICAL"] } } }),
      prisma.medicationAdministration.count({ where: { resident: { facilityId }, status: "MISSED", scheduledTime: { gte: startOfToday, lte: endOfToday } } }),
      prisma.handoffNote.count({ where: { shift: { facilityId }, acknowledgedAt: null } }),
      prisma.incidentReport.count({ where: { resident: { facilityId }, createdAt: { gte: startOfWeek } } }),
    ]);

  return (
    <AppShell userName={session.user.name}>
      <PageIntro eyebrow="نمای کلی مرکز" title={`صبح بخیر، ${session.user.name || "همکار عزیز"}`} description="وضعیت مراقبت و مهم‌ترین اقدام‌های امروز را در یک نگاه ببینید." action={<span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700">● همه‌چیز پایدار است</span>} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="سالمندان پرریسک" value={highRiskCount} detail="نیازمند توجه امروز" tone="risk" />
        <StatCard title="داروهای معوق" value={overdueMedsCount} detail="در برنامه امروز" tone="warn" />
        <StatCard title="تحویل شیفت" value={pendingHandoffsCount} detail="در انتظار تأیید" tone="info" />
        <StatCard title="حوادث هفته" value={incidentsThisWeekCount} detail="ثبت‌شده در این هفته" tone="neutral" />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <SectionCard>
          <div className="flex items-center justify-between"><div><h2 className="text-lg font-black">تمرکز امروز</h2><p className="mt-1 text-sm text-muted-foreground">مواردی که نیاز به پیگیری تیم دارند</p></div><span className="rounded-xl bg-surface-muted px-3 py-2 text-xs font-bold">۲۴ شهریور</span></div>
          <div className="mt-6 space-y-3"><ActionRow icon="!" title="بررسی سالمندان پرریسک" text={`${highRiskCount} نفر نیازمند بازبینی پرونده هستند`} tone="red" /><ActionRow icon="◷" title="تکمیل تحویل شیفت" text={`${pendingHandoffsCount} یادداشت منتظر تأیید است`} tone="amber" /><ActionRow icon="✓" title="ثبت مراقبت روزانه" text="رکوردهای امروز را کامل نگه دارید" tone="green" /></div>
        </SectionCard>
        <SectionCard><h2 className="text-lg font-black">راهنمای سریع</h2><p className="mt-1 text-sm text-muted-foreground">برای شروع یک اقدام انتخاب کنید.</p><div className="mt-5 grid gap-3"><QuickLink href="/residents/new" title="افزودن سالمند" icon="+" /><QuickLink href="/residents" title="مشاهده Care Timeline" icon="↗" /><QuickLink href="/handoffs" title="مدیریت تحویل شیفت" icon="≡" /></div></SectionCard>
      </div>
    </AppShell>
  );
}

function StatCard({ title, value, detail, tone }: { title: string; value: number; detail: string; tone: "risk" | "warn" | "info" | "neutral" }) {
  const colors = { risk: "bg-red-50 text-red-600", warn: "bg-amber-50 text-amber-700", info: "bg-blue-50 text-blue-700", neutral: "bg-surface-muted text-muted-foreground" };
  return <div className="surface-card"><div className="flex items-start justify-between"><p className="text-sm font-semibold text-muted-foreground">{title}</p><span className={`rounded-xl px-2.5 py-1 text-xs ${colors[tone]}`}>●</span></div><p className="mt-5 text-4xl font-black">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div>;
}
function ActionRow({ icon, title, text, tone }: { icon: string; title: string; text: string; tone: "red" | "amber" | "green" }) { const colors = { red: "bg-red-50 text-red-600", amber: "bg-amber-50 text-amber-700", green: "bg-emerald-50 text-emerald-700" }; return <div className="flex items-center gap-3 rounded-2xl border bg-background p-3"><span className={`flex h-10 w-10 items-center justify-center rounded-xl font-black ${colors[tone]}`}>{icon}</span><div><p className="text-sm font-bold">{title}</p><p className="text-xs text-muted-foreground">{text}</p></div><span className="mr-auto text-muted-foreground">←</span></div>; }
function QuickLink({ href, title, icon }: { href: string; title: string; icon: string }) { return <a href={href} className="flex items-center gap-3 rounded-2xl border p-3 hover:border-brand hover:bg-brand/5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-muted font-bold">{icon}</span><span className="text-sm font-bold">{title}</span><span className="mr-auto text-muted-foreground">←</span></a>; }
