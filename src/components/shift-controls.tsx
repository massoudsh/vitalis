"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ShiftForm({ staff }: { staff: { id: string; fullName: string }[] }) {
  const router = useRouter(); const [open, setOpen] = useState(false); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) { e.preventDefault(); setLoading(true); setError(""); const raw = Object.fromEntries(new FormData(e.currentTarget)); const body = { type: raw.type, staffId: raw.staffId, startTime: new Date(String(raw.startTime)).toISOString(), endTime: new Date(String(raw.endTime)).toISOString() }; const res = await fetch("/api/shifts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); setLoading(false); if (!res.ok) { setError("ثبت شیفت ناموفق بود."); return; } setOpen(false); router.refresh(); }
  if (!open) return <button className="button-primary" onClick={() => setOpen(true)}>+ شیفت جدید</button>;
  return <form onSubmit={submit} className="surface-card absolute left-5 top-16 z-30 w-[min(92vw,24rem)] space-y-3"><h2 className="font-black">تعریف شیفت</h2><select name="type" className="field !mt-0"><option value="MORNING">صبح</option><option value="EVENING">عصر</option><option value="NIGHT">شب</option></select><select name="staffId" required className="field">{staff.map((member) => <option key={member.id} value={member.id}>{member.fullName}</option>)}</select><label className="block text-xs font-bold">شروع<input name="startTime" type="datetime-local" required className="field !mt-1" /></label><label className="block text-xs font-bold">پایان<input name="endTime" type="datetime-local" required className="field !mt-1" /></label>{error && <p className="text-sm text-red-700">{error}</p>}<div className="flex gap-2"><button disabled={loading} className="button-primary flex-1">{loading ? "در حال ثبت..." : "ثبت"}</button><button type="button" onClick={() => setOpen(false)} className="button-secondary">لغو</button></div></form>;
}

export function ShiftStatusButton({ id, status }: { id: string; status: string }) {
  const router = useRouter(); const [loading, setLoading] = useState(false);
  async function update(nextStatus: string) { setLoading(true); await fetch(`/api/shifts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus }) }); setLoading(false); router.refresh(); }
  if (status === "COMPLETED") return <span className="text-xs font-bold text-emerald-700">تکمیل‌شده</span>;
  return <button disabled={loading} onClick={() => update(status === "SCHEDULED" ? "IN_PROGRESS" : "COMPLETED")} className="rounded-xl bg-brand/10 px-3 py-1 text-xs font-bold text-brand">{status === "SCHEDULED" ? "شروع شیفت" : "پایان شیفت"}</button>;
}
