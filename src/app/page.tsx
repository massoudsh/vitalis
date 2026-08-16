import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "@/components/sign-out-button";

const modules = [
  { href: "/dashboard", title: "داشبورد", desc: "ریسک‌های امروز، داروهای معوق، تحویل‌شیفت‌های در انتظار" },
  { href: "/residents", title: "سالمندان", desc: "پروفایل، سطح ریسک و Care Timeline هر سالمند" },
  { href: "/shifts", title: "شیفت‌ها", desc: "تقویم شیفت و تخصیص پرسنل" },
  { href: "/handoffs", title: "تحویل شیفت", desc: "یادداشت تحویل و خلاصهٔ AI" },
];

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto max-w-4xl p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-vitalis-primary">Vitalis</h1>
          <p className="mt-2 text-gray-600">
            پلتفرم هوشمند مدیریت عملیات مراقبت سالمندان
          </p>
        </div>
        {session ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gray-600">{session.user.name}</span>
            <SignOutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="rounded bg-vitalis-primary px-4 py-2 text-sm text-white"
          >
            ورود
          </Link>
        )}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="rounded-lg border p-5 transition hover:border-vitalis-primary hover:shadow"
          >
            <h2 className="font-semibold">{m.title}</h2>
            <p className="mt-1 text-sm text-gray-500">{m.desc}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
