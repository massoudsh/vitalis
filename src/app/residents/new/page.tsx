"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewResidentPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      fullName: form.get("fullName"),
      birthDate: form.get("birthDate"),
      gender: form.get("gender"),
      roomNumber: form.get("roomNumber") || undefined,
      riskLevel: form.get("riskLevel"),
      primaryDiagnosis: form.get("primaryDiagnosis") || undefined,
      allergies: form.get("allergies") || undefined,
    };

    const res = await fetch("/api/residents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setLoading(false);

    if (!res.ok) {
      setError("ثبت سالمند ناموفق بود. مقادیر فرم را بررسی کنید.");
      return;
    }

    const data = await res.json();
    router.push(`/residents/${data.id}`);
  }

  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="text-2xl font-bold">افزودن سالمند</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <Field label="نام کامل" name="fullName" required />
        <Field label="تاریخ تولد" name="birthDate" type="date" required />
        <div>
          <label className="block text-sm text-gray-600">جنسیت</label>
          <select name="gender" required className="mt-1 w-full rounded border px-3 py-2">
            <option value="MALE">مرد</option>
            <option value="FEMALE">زن</option>
          </select>
        </div>
        <Field label="شماره اتاق" name="roomNumber" />
        <div>
          <label className="block text-sm text-gray-600">سطح ریسک</label>
          <select name="riskLevel" defaultValue="LOW" className="mt-1 w-full rounded border px-3 py-2">
            <option value="LOW">کم</option>
            <option value="MEDIUM">متوسط</option>
            <option value="HIGH">زیاد</option>
            <option value="CRITICAL">بحرانی</option>
          </select>
        </div>
        <Field label="تشخیص اصلی" name="primaryDiagnosis" />
        <Field label="آلرژی‌ها" name="allergies" />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-vitalis-primary px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "در حال ثبت..." : "ثبت سالمند"}
        </button>
      </form>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        required={required}
        className="mt-1 w-full rounded border px-3 py-2"
      />
    </div>
  );
}
