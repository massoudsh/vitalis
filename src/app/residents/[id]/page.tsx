export default function ResidentTimelinePage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-2xl font-bold">Care Timeline</h1>
      <p className="mt-1 text-sm text-gray-500">سالمند: {params.id}</p>
      <p className="mt-6 text-sm text-gray-500">
        این صفحه تایم‌لاین یکپارچه‌ای از رکوردهای <code>VitalSign</code>،{" "}
        <code>MedicationAdministration</code>، <code>CareNote</code>،{" "}
        <code>IncidentReport</code> و <code>HandoffNote</code> این سالمند را
        به‌ترتیب زمان نمایش می‌دهد (طبق <code>docs/ARCHITECTURE.md</code> بخش
        Care Timeline).
      </p>
    </main>
  );
}
