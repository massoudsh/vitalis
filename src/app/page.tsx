import Link from "next/link";

const modules = [
  { href: "/dashboard", title: "داشبورد", desc: "ریسک‌های امروز، داروهای معوق، تحویل‌شیفت‌های در انتظار" },
  { href: "/residents", title: "سالمندان", desc: "پروفایل، سطح ریسک و Care Timeline هر سالمند" },
  { href: "/shifts", title: "شیفت‌ها", desc: "تقویم شیفت و تخصیص پرسنل" },
  { href: "/handoffs", title: "تحویل شیفت", desc: "یادداشت تحویل و خلاصهٔ AI" },
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold text-vitalis-primary">Vitalis</h1>
      <p className="mt-2 text-gray-600">
        پلتفرم هوشمند مدیریت عملیات مراقبت سالمندان
      </p>
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
