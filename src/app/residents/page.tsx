import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const riskLabel: Record<string, string> = {
  LOW: "کم",
  MEDIUM: "متوسط",
  HIGH: "زیاد",
  CRITICAL: "بحرانی",
};

const riskClass: Record<string, string> = {
  LOW: "bg-vitalis-risk-low/10 text-vitalis-risk-low",
  MEDIUM: "bg-vitalis-risk-medium/10 text-vitalis-risk-medium",
  HIGH: "bg-vitalis-risk-high/10 text-vitalis-risk-high",
  CRITICAL: "bg-vitalis-risk-critical/10 text-vitalis-risk-critical",
};

export default async function ResidentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const residents = await prisma.resident.findMany({
    where: { facilityId: session.user.facilityId, status: "ACTIVE" },
    orderBy: { fullName: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">سالمندان</h1>
        <Link
          href="/residents/new"
          className="rounded bg-vitalis-primary px-4 py-2 text-white"
        >
          + افزودن سالمند
        </Link>
      </div>

      {residents.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">
          هنوز سالمندی ثبت نشده. با «+ افزودن سالمند» شروع کنید.
        </p>
      ) : (
        <ul className="mt-6 divide-y rounded-lg border">
          {residents.map((r) => (
            <li key={r.id}>
              <Link
                href={`/residents/${r.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium">{r.fullName}</p>
                  <p className="mt-0.5 text-sm text-gray-500">
                    {r.roomNumber ? `اتاق ${r.roomNumber}` : "بدون اتاق"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${riskClass[r.riskLevel]}`}
                >
                  ریسک {riskLabel[r.riskLevel]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
