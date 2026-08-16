import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const severityClass: Record<string, string> = {
  NORMAL: "bg-gray-100 text-gray-600",
  WATCH: "bg-vitalis-risk-medium/10 text-vitalis-risk-medium",
  CONCERN: "bg-vitalis-risk-high/10 text-vitalis-risk-high",
  URGENT: "bg-vitalis-risk-critical/10 text-vitalis-risk-critical",
};

const medStatusLabel: Record<string, string> = {
  GIVEN: "داده‌شده",
  MISSED: "فراموش‌شده",
  REFUSED: "امتناع",
  DELAYED: "تأخیر",
};

type TimelineItem = {
  id: string;
  type: string;
  at: Date;
  summary: string;
  by: string;
  severity?: string;
};

export default async function ResidentTimelinePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const resident = await prisma.resident.findFirst({
    where: { id: params.id, facilityId: session.user.facilityId },
  });
  if (!resident) notFound();

  const [vitals, medAdmins, careNotes, incidents, handoffs] = await Promise.all([
    prisma.vitalSign.findMany({
      where: { residentId: resident.id },
      include: { recordedBy: true },
    }),
    prisma.medicationAdministration.findMany({
      where: { residentId: resident.id },
      include: { medication: true, administeredBy: true },
    }),
    prisma.careNote.findMany({
      where: { residentId: resident.id },
      include: { author: true },
    }),
    prisma.incidentReport.findMany({
      where: { residentId: resident.id },
      include: { reportedBy: true },
    }),
    prisma.handoffNote.findMany({
      where: { residentId: resident.id },
      include: { fromStaff: true },
    }),
  ]);

  // Care Timeline = union مرتب‌شدهٔ ۵ نوع رکورد (طبق docs/wiki/concepts/care-timeline.md)
  const items: TimelineItem[] = [
    ...vitals.map((v) => ({
      id: v.id,
      type: "علائم حیاتی",
      at: v.recordedAt,
      summary: `فشار ${v.bloodPressureSystolic ?? "—"}/${v.bloodPressureDiastolic ?? "—"} · ضربان ${v.heartRate ?? "—"} · دما ${v.temperature ?? "—"} · SpO2 ${v.spo2 ?? "—"}`,
      by: v.recordedBy.fullName,
    })),
    ...medAdmins.map((m) => ({
      id: m.id,
      type: "دارو",
      at: m.administeredTime ?? m.scheduledTime,
      summary: `${m.medication.name} — ${medStatusLabel[m.status]}`,
      by: m.administeredBy.fullName,
    })),
    ...careNotes.map((c) => ({
      id: c.id,
      type: "یادداشت مراقبتی",
      at: c.createdAt,
      summary: c.content,
      by: c.author.fullName,
      severity: c.severity,
    })),
    ...incidents.map((i) => ({
      id: i.id,
      type: "حادثه",
      at: i.createdAt,
      summary: i.description,
      by: i.reportedBy.fullName,
      severity: i.severity,
    })),
    ...handoffs.map((h) => ({
      id: h.id,
      type: "تحویل شیفت",
      at: h.createdAt,
      summary: h.content,
      by: h.fromStaff.fullName,
    })),
  ].sort((a, b) => b.at.getTime() - a.at.getTime());

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold">{resident.fullName}</h1>
      <p className="mt-1 text-sm text-gray-500">
        {resident.roomNumber ? `اتاق ${resident.roomNumber} · ` : ""}Care Timeline
      </p>

      {items.length === 0 ? (
        <p className="mt-6 text-sm text-gray-500">هنوز رکوردی برای این سالمند ثبت نشده.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => (
            <li key={`${item.type}-${item.id}`} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-vitalis-primary">{item.type}</span>
                <span className="text-xs text-gray-400">
                  {item.at.toLocaleString("fa-IR")}
                </span>
              </div>
              <p className="mt-2 text-sm">{item.summary}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-gray-500">ثبت‌کننده: {item.by}</span>
                {item.severity && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityClass[item.severity]}`}
                  >
                    {item.severity}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
