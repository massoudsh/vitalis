export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold">داشبورد مرکز</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="سالمندان پرریسک امروز" value="—" tone="risk" />
        <StatCard title="داروهای معوق امروز" value="—" tone="warn" />
        <StatCard title="تحویل‌شیفت در انتظار تأیید" value="—" tone="info" />
        <StatCard title="حوادث این هفته" value="—" tone="warn" />
      </div>
      <p className="mt-8 text-sm text-gray-500">
        این صفحه بعد از اتصال دیتابیس (Prisma + PostgreSQL) با کوئری روی
        جدول‌های <code>Resident</code>، <code>MedicationAdministration</code>{" "}
        و <code>HandoffNote</code> پر می‌شود.
      </p>
    </main>
  );
}

function StatCard({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
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
