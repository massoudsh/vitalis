import Link from "next/link";
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell";

export default function FamilyPortalPage({ params }: { params: { residentId: string } }) {
  return <AppShell userName="خانواده"><PageIntro eyebrow="پورتال خانواده" title="گزارش وضعیت سالمند" description="نمای فقط‌خواندنی از گزارش‌های تأییدشده و رخدادهای مهم." /><SectionCard><div className="py-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-2xl">♡</div><h2 className="mt-4 font-black">گزارشی برای نمایش وجود ندارد</h2><p className="mx-auto mt-2 max-w-md text-sm leading-7 text-muted-foreground">پس از تأیید گزارش دوره‌ای توسط پرستار، خلاصهٔ وضعیت سالمند در همین صفحه نمایش داده می‌شود. شناسهٔ پرونده: <span className="font-bold text-foreground">{params.residentId}</span></p><Link href="/dashboard" className="button-secondary mt-6">بازگشت</Link></div></SectionCard></AppShell>;
}
