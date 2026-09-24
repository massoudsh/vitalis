"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell";

export default function NewResidentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = { fullName: form.get("fullName"), birthDate: form.get("birthDate"), gender: form.get("gender"), roomNumber: form.get("roomNumber") || undefined, riskLevel: form.get("riskLevel"), primaryDiagnosis: form.get("primaryDiagnosis") || undefined, allergies: form.get("allergies") || undefined };
    const res = await fetch("/api/residents", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setLoading(false);
    if (!res.ok) { setError("ثبت سالمند ناموفق بود. مقادیر فرم را بررسی کنید."); return; }
    const data = await res.json();
    router.push(`/residents/${data.id}`);
  }

  return (
    <AppShell>
      <Link href="/residents" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-brand">→ بازگشت به فهرست سالمندان</Link>
      <PageIntro eyebrow="پرونده جدید" title="افزودن سالمند" description="اطلاعات پایه را ثبت کنید؛ پس از این مرحله می‌توانید رکوردهای مراقبت را اضافه کنید." />
      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <SectionCard>
          <h2 className="text-lg font-black">اطلاعات پایه</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2"><Field label="نام کامل" name="fullName" required /></div>
            <Field label="تاریخ تولد" name="birthDate" type="date" required />
            <div><label className="text-sm font-semibold">جنسیت</label><select name="gender" required className="field"><option value="MALE">مرد</option><option value="FEMALE">زن</option></select></div>
            <Field label="شماره اتاق" name="roomNumber" />
            <div><label className="text-sm font-semibold">سطح ریسک</label><select name="riskLevel" defaultValue="LOW" className="field"><option value="LOW">کم</option><option value="MEDIUM">متوسط</option><option value="HIGH">زیاد</option><option value="CRITICAL">بحرانی</option></select></div>
          </div>
        </SectionCard>
        <div className="space-y-6">
          <SectionCard>
            <h2 className="text-lg font-black">اطلاعات بالینی</h2>
            <div className="mt-5 space-y-5"><Field label="تشخیص اصلی" name="primaryDiagnosis" /><Field label="آلرژی‌ها" name="allergies" /></div>
          </SectionCard>
          <SectionCard>
            {error && <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="button-primary w-full">{loading ? "در حال ثبت..." : "ثبت پرونده سالمند"}</button>
            <p className="mt-3 text-center text-xs text-muted-foreground">تمام رکوردهای این پرونده فقط برای پرسنل همین مرکز قابل مشاهده است.</p>
          </SectionCard>
        </div>
      </form>
    </AppShell>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return <div><label className="text-sm font-semibold">{label}</label><input type={type} name={name} required={required} className="field" /></div>;
}
