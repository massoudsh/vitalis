import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell";

const shifts = [
  { name: "صبح", time: "۰۶:۰۰ تا ۱۴:۰۰", staff: "۲ نفر", tone: "bg-amber-50 text-amber-700" },
  { name: "عصر", time: "۱۴:۰۰ تا ۲۲:۰۰", staff: "۲ نفر", tone: "bg-blue-50 text-blue-700" },
  { name: "شب", time: "۲۲:۰۰ تا ۰۶:۰۰", staff: "۱ نفر", tone: "bg-surface-muted text-muted-foreground" },
];

export default async function ShiftsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <AppShell userName={session.user.name}>
      <PageIntro eyebrow="برنامه‌ریزی" title="شیفت‌ها" description="تقویم هفتگی شیفت‌ها و تخصیص پرسنل به هر بازهٔ کاری." action={<button className="button-primary">+ شیفت جدید</button>} />
      <div className="grid gap-4 lg:grid-cols-3">
        {shifts.map((shift) => (
          <SectionCard key={shift.name}>
            <div className="flex items-center justify-between"><h2 className="text-lg font-black">شیفت {shift.name}</h2><span className={`rounded-xl px-3 py-1 text-xs font-bold ${shift.tone}`}>امروز</span></div>
            <p className="mt-4 text-sm text-muted-foreground">بازهٔ کاری</p>
            <p className="font-bold">{shift.time}</p>
            <div className="mt-4 flex items-center justify-between border-t pt-4"><span className="text-sm text-muted-foreground">پرسنل تخصیص‌یافته</span><span className="text-sm font-black">{shift.staff}</span></div>
          </SectionCard>
        ))}
      </div>
      <SectionCard className="mt-6">
        <h2 className="text-lg font-black">تقویم هفتگی</h2>
        <p className="mt-1 text-sm text-muted-foreground">نمای هفتگی تخصیص پرسنل به شیفت‌ها پس از اتصال دادهٔ واقعی نمایش داده می‌شود.</p>
        <div className="mt-6 grid grid-cols-7 gap-2 text-center">
          {["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"].map((day) => (
            <div key={day} className="rounded-2xl border bg-background p-3"><p className="text-xs font-bold">{day}</p><p className="mt-2 text-xs text-muted-foreground">—</p></div>
          ))}
        </div>
      </SectionCard>
    </AppShell>
  );
}
