export default function ResidentsPage() {
  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">سالمندان</h1>
        <button className="rounded bg-vitalis-primary px-4 py-2 text-white">
          + افزودن سالمند
        </button>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        لیست سالمندان (نام، اتاق، سطح ریسک، آخرین رکورد) اینجا از مدل{" "}
        <code>Resident</code> خوانده می‌شود. با کلیک روی هر سالمند به{" "}
        <code>/residents/[id]</code> — نمای Care Timeline — می‌روید.
      </p>
    </main>
  );
}
