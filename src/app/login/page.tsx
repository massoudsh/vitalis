"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const result = await signIn("credentials", { phone, password, redirect: false });
    setLoading(false);
    if (result?.error) {
      setError("شماره موبایل یا رمز عبور اشتباه است.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12">
      <div aria-hidden="true" className="pointer-events-none absolute -top-32 right-0 h-96 w-96 rounded-full bg-brand/10 blur-3xl" />
      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-[1.05fr_1fr]">
        <section className="hidden flex-col justify-between rounded-3xl bg-foreground p-10 text-white lg:flex">
          <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand text-xl font-black">ن</span><div><p className="font-black">نقطه مراقبت</p><p className="text-xs text-white/60">مدیریت هوشمند مرکز</p></div></div>
          <div><h2 className="text-3xl font-black leading-relaxed">هر رکورد مراقبت، بخشی از یک خط زمانی زنده است.</h2><p className="mt-4 text-sm leading-7 text-white/70">ثبت سریع مراقبت، تحویل شیفت شفاف و گزارش خانواده — همه در یک جای واحد.</p></div>
          <div className="flex items-center gap-3 text-xs text-white/60"><span className="status-dot" /> داده‌های این مرکز به‌صورت جداگانه نگهداری می‌شود</div>
        </section>
        <section className="surface-card p-8 lg:p-10">
          <p className="text-sm font-bold text-brand">خوش آمدید</p>
          <h1 className="mt-2 text-3xl font-black">ورود به حساب کاربری</h1>
          <p className="mt-2 text-sm text-muted-foreground">شماره موبایل و رمز عبور خود را وارد کنید.</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div><label className="text-sm font-semibold">شماره موبایل</label><input type="text" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} required className="field" placeholder="۰۹xxxxxxxxx" /></div>
            <div><div className="flex items-center justify-between"><label className="text-sm font-semibold">رمز عبور</label><span className="text-xs text-muted-foreground">فراموش کرده‌اید؟</span></div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="field" /></div>
            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}
            <button type="submit" disabled={loading} className="button-primary w-full">{loading ? "در حال ورود..." : "ورود"}</button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">دسترسی به داده‌های بالینی تنها برای پرسنل مجاز مرکز فعال است.</p>
        </section>
      </div>
    </main>
  );
}
