import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

const modules = [
  { href: "/dashboard", title: "داشبورد", desc: "ریسک‌های امروز، داروهای معوق و تحویل‌شیفت‌های در انتظار", icon: "⌂" },
  { href: "/residents", title: "سالمندان", desc: "پروفایل، سطح ریسک و Care Timeline هر سالمند", icon: "♙" },
  { href: "/shifts", title: "شیفت‌ها", desc: "تقویم شیفت و تخصیص پرسنل", icon: "◷" },
  { href: "/handoffs", title: "تحویل شیفت", desc: "یادداشت تحویل و خلاصهٔ AI", icon: "↗" },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-surface/80 px-5 py-4 backdrop-blur lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="brand-mark">ن</span>
            <div>
              <p className="text-lg font-black">نقطه مراقبت</p>
              <p className="text-xs text-muted-foreground">پلتفرم مدیریت عملیات مراقبت سالمندان</p>
            </div>
          </div>
          {session ? (
            <div className="flex items-center gap-4 text-sm">
              <span className="hidden text-muted-foreground sm:inline">{session.user.name}</span>
              <SignOutButton />
            </div>
          ) : (
            <Link href="/login" className="button-primary">ورود به حساب</Link>
          )}
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-10 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border bg-surface px-4 py-2 text-xs font-bold text-muted-foreground">
              <span className="status-dot" /> فاز یک — آمادهٔ استفاده در مرکز
            </span>
            <h1 className="mt-6 text-4xl font-black leading-[1.35] sm:text-5xl">
              مراقبت سالمندان، با یک خط زمانی قابل اعتماد
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
              ثبت مراقبت روزمره، مدیریت دارو و تحویل شیفت را از دفتر کاغذی و فایل‌های پراکنده به یک محل واحد بیاورید — و از روی همان داده، گزارش خانواده و هشدار ریسک بسازید.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={session ? "/dashboard" : "/login"} className="button-primary">
                {session ? "ورود به داشبورد" : "شروع کنید"}
              </Link>
              <Link href="/residents" className="button-secondary">مشاهده سالمندان</Link>
            </div>
          </div>
          <div className="surface-card p-6 lg:p-8">
            <p className="text-sm font-black text-muted-foreground">آنچه در یک نگاه می‌بینید</p>
            <div className="mt-5 space-y-3">
              {modules.map((m) => (
                <div key={m.href} className="flex items-center gap-3 rounded-2xl border bg-background p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-base font-black">{m.icon}</span>
                  <div>
                    <p className="text-sm font-bold">{m.title}</p>
                    <p className="text-xs text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Link key={m.href} href={m.href} className="surface-card transition hover:border-brand hover:shadow-[0_16px_40px_rgba(210,140,43,0.12)]">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand/10 text-lg font-black text-brand">{m.icon}</span>
              <h2 className="mt-4 font-black">{m.title}</h2>
              <p className="mt-1 text-sm leading-7 text-muted-foreground">{m.desc}</p>
              <span className="mt-4 inline-block text-sm font-bold text-brand">مشاهده ←</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
