export default function FamilyPortalPage({
  params,
}: {
  params: { residentId: string };
}) {
  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="text-2xl font-bold">پورتال خانواده</h1>
      <p className="mt-1 text-sm text-gray-500">
        سالمند: {params.residentId}
      </p>
      <p className="mt-6 text-sm text-gray-500">
        نمای فقط‌خواندنیِ <code>FamilyReport</code>های تأییدشده + اعلان
        حوادث اخیر. دسترسی محدود به همان سالمند (نقش <code>FAMILY_MEMBER</code>).
      </p>
    </main>
  );
}
