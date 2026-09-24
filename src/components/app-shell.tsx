import Link from "next/link";
import { SignOutButton } from "@/components/sign-out-button";

const navigation = [
  { href: "/dashboard", label: "نمای کلی", icon: "⌂" },
  { href: "/residents", label: "سالمندان", icon: "♙" },
  { href: "/shifts", label: "شیفت‌ها", icon: "◷" },
  { href: "/handoffs", label: "تحویل شیفت", icon: "↗" },
];

export function AppShell({
  children,
  userName = "کاربر مرکز",
}: {
  children: React.ReactNode;
  userName?: string | null;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 right-0 z-20 hidden w-72 border-l border-border bg-surface/95 px-5 py-6 backdrop-blur lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="brand-mark">ن</div>
          <div>
            <p className="text-lg font-black tracking-tight">نقطه مراقبت</p>
            <p className="text-xs text-muted-foreground">مدیریت هوشمند مرکز</p>
          </div>
        </div>

        <nav className="mt-10 space-y-1" aria-label="ناوبری اصلی">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href} className="nav-item">
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute inset-x-5 bottom-6 rounded-2xl border border-border bg-background p-4">
          <p className="text-xs text-muted-foreground">مرکز توان‌بخشی زندگی</p>
          <p className="mt-1 truncate text-sm font-semibold">{userName || "کاربر مرکز"}</p>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="status-dot" /> سیستم فعال
            </span>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="lg:mr-72">
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 px-5 py-4 backdrop-blur lg:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="lg:hidden">
              <p className="font-black">نقطه مراقبت</p>
              <p className="text-xs text-muted-foreground">مرکز توان‌بخشی زندگی</p>
            </div>
            <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
              <span className="status-dot" /> آخرین همگام‌سازی: همین حالا
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-muted-foreground sm:inline">امروز، ۲۴ شهریور ۱۴۰۵</span>
              <div className="avatar">{(userName || "ک").slice(0, 1)}</div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-5 lg:p-10">{children}</main>
      </div>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="mb-2 text-sm font-semibold text-brand">{eyebrow}</p>}
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`surface-card ${className}`}>{children}</section>;
}
