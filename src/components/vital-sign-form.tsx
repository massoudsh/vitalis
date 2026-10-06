"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { parseOptionalNumber } from "@/lib/vitals";

const numericFields = [
  { name: "bloodPressureSystolic", label: "فشار سیستولیک", hint: "mmHg" },
  { name: "bloodPressureDiastolic", label: "فشار دیاستولیک", hint: "mmHg" },
  { name: "heartRate", label: "ضربان قلب", hint: "bpm" },
  { name: "temperature", label: "دمای بدن", hint: "°C" },
  { name: "spo2", label: "اکسیژن خون", hint: "%" },
  { name: "respiratoryRate", label: "تنفس", hint: "در دقیقه" },
  { name: "bloodSugar", label: "قند خون", hint: "mg/dL" },
  { name: "weightKg", label: "وزن", hint: "kg" },
] as const;

export function VitalSignForm({ residentId }: { residentId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formElement = e.currentTarget;
    setLoading(true);
    setError(null);
    setSaved(false);

    const form = new FormData(formElement);
    const body: Record<string, unknown> = {};
    for (const field of numericFields) {
      const value = parseOptionalNumber(form.get(field.name));
      if (value !== undefined) body[field.name] = value;
    }
    const notes = String(form.get("notes") ?? "").trim();
    if (notes) body.notes = notes;

    if (Object.values(body).some((v) => typeof v === "number" && Number.isNaN(v))) {
      setLoading(false);
      setError("مقادیر عددی را درست وارد کنید.");
      return;
    }

    const res = await fetch(`/api/residents/${residentId}/vitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);

    if (res.status === 403) {
      setError("شما اجازهٔ ثبت علائم حیاتی را ندارید.");
      return;
    }
    if (!res.ok) {
      setError("ثبت ناموفق بود. حداقل یک مقدار معتبر وارد کنید و محدودهٔ اعداد را بررسی کنید.");
      return;
    }

    formElement.reset();
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {numericFields.map((field) => (
          <div key={field.name}>
            <label className="text-xs font-semibold" htmlFor={field.name}>
              {field.label}
              <span className="mr-1 font-normal text-muted-foreground">({field.hint})</span>
            </label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              className="field !mt-1 !py-2"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold" htmlFor="notes">یادداشت</label>
        <textarea id="notes" name="notes" rows={2} maxLength={500} className="field !mt-1 !py-2" />
      </div>
      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
      {saved && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">علائم حیاتی ثبت شد.</p>}
      <button type="submit" disabled={loading} className="button-primary w-full">
        {loading ? "در حال ثبت..." : "ثبت علائم حیاتی"}
      </button>
    </form>
  );
}
