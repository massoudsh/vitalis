import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell";

export default async function HandoffsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return <AppShell userName={session.user.name}><PageIntro eyebrow="ارتباط تیمی" title="تحویل شیفت" description="یادداشت‌های تحویل را مرور کنید تا هیچ نکته‌ای بین دو شیفت از دست نرود." action={<button className="button-primary">+ ثبت تحویل شیفت</button>} /><div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]"><SectionCard><div className="flex items-center justify-between"><div><h2 className="text-lg font-black">یادداشت‌های اخیر</h2><p className="mt-1 text-sm text-muted-foreground">آخرین وضعیت ثبت‌شده توسط تیم</p></div><span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">در انتظار تأیید</span></div><div className="mt-6 rounded-2xl border border-dashed p-8 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-muted text-xl">↗</div><h3 className="mt-3 font-black">یادداشت تحویلی وجود ندارد</h3><p className="mt-1 text-sm text-muted-foreground">با ثبت اولین تحویل شیفت، خلاصه وضعیت را برای تیم بعدی آماده کنید.</p><button className="button-secondary mt-5">ثبت یادداشت جدید</button></div></SectionCard><SectionCard><h2 className="text-lg font-black">چرخه تحویل شیفت</h2><div className="mt-6 space-y-5">{["ثبت رکوردهای شیفت", "ساخت پیش‌نویس خلاصه با AI", "بازبینی و تأیید پرستار", "مشاهده توسط شیفت بعدی"].map((step, index) => <div key={step} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-black text-white">{index + 1}</span><div><p className="text-sm font-bold">{step}</p><p className="text-xs text-muted-foreground">{index === 0 ? "اطلاعات مراقبت را کامل کنید" : "در انتظار تکمیل مرحله قبل"}</p></div></div>)}</div></SectionCard></div></AppShell>;
}
