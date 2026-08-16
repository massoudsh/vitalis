import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
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
      prisma.resident.count({
        where: {
          facilityId,
          status: "ACTIVE",
          riskLevel: { in: ["HIGH", "CRITICAL"] },
        },
      }),
      prisma.medicationAdministration.count({
        where: {
          resident: { facilityId },
          status: "MISSED",
          scheduledTime: { gte: startOfToday, lte: endOfToday },
        },
      }),
      prisma.handoffNote.count({
        where: {
          shift: { facilityId },
          acknowledgedAt: null,
        },
      }),
      prisma.incidentReport.count({
        where: {
          resident: { facilityId },
          createdAt: { gte: startOfWeek },
        },
      }),
    ]);

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold">داشبورد مرکز</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="سالمندان پرریسک امروز" value={highRiskCount} tone="risk" />
        <StatCard title="داروهای معوق امروز" value={overdueMedsCount} tone="warn" />
        <StatCard
          title="تحویل‌شیفت در انتظار تأیید"
          value={pendingHandoffsCount}
          tone="info"
        />
        <StatCard title="حوادث این هفته" value={incidentsThisWeekCount} tone="warn" />
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: number;
  tone: "risk" | "warn" | "info";
}) {
  const toneClass = {
    risk: "border-vitalis-risk-critical/40",
    warn: "border-vitalis-risk-high/40",
    info: "border-vitalis-primary/40",
  }[tone];
  return (
    <div className={`rounded-lg border p-4 ${toneClass}`}>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
