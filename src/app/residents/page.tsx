import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell, PageIntro, SectionCard } from "@/components/app-shell";

const riskLabel: Record<string, string> = { LOW: "کم", MEDIUM: "متوسط", HIGH: "زیاد", CRITICAL: "بحرانی" };
const riskClass: Record<string, string> = { LOW: "bg-emerald-50 text-emerald-700", MEDIUM: "bg-amber-50 text-amber-700", HIGH: "bg-orange-50 text-orange-700", CRITICAL: "bg-red-50 text-red-700" };

export default async function ResidentsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const residents = await prisma.resident.findMany({ where: { facilityId: session.user.facilityId, status: "ACTIVE" }, orderBy: { fullName: "asc" } });

  return <AppShell userName={session.user.name}><PageIntro eyebrow="مدیریت پرونده‌ها" title="سالمندان" description="پرونده، وضعیت ریسک و خط زمانی مراقبت هر سالمند را دنبال کنید." action={<Link href="/residents/new" className="button-primary">+ افزودن سالمند</Link>} />
    <div className="mb-5 flex flex-wrap gap-2"><span className="rounded-full bg-foreground px-4 py-2 text-xs font-bold text-white">همه {residents.length}</span><span className="rounded-full border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground">فعال</span><span className="rounded-full border bg-surface px-4 py-2 text-xs font-semibold text-muted-foreground">نیازمند توجه</span></div>
    {residents.length === 0 ? <SectionCard><div className="py-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-muted text-2xl">♙</div><h2 className="mt-4 font-black">هنوز سالمندی ثبت نشده</h2><p className="mt-1 text-sm text-muted-foreground">با افزودن اولین سالمند، پرونده مراقبت را شروع کنید.</p></div></SectionCard> : <SectionCard className="overflow-hidden p-0"><div className="hidden grid-cols-[1.5fr_0.7fr_0.8fr_0.5fr] gap-4 border-b bg-surface-muted/50 px-6 py-4 text-xs font-bold text-muted-foreground md:grid"><span>نام سالمند</span><span>اتاق</span><span>سطح ریسک</span><span></span></div><ul className="divide-y">{residents.map((resident) => <li key={resident.id}><Link href={`/residents/${resident.id}`} className="grid gap-3 px-5 py-4 hover:bg-brand/5 md:grid-cols-[1.5fr_0.7fr_0.8fr_0.5fr] md:items-center md:gap-4 md:px-6"><div className="flex items-center gap-3"><div className="avatar bg-surface-muted text-foreground">{resident.fullName.slice(0, 1)}</div><div><p className="font-bold">{resident.fullName}</p><p className="text-xs text-muted-foreground">پرونده مراقبت فعال</p></div></div><p className="text-sm text-muted-foreground">{resident.roomNumber ? `اتاق ${resident.roomNumber}` : "بدون اتاق"}</p><span className={`w-fit rounded-full px-3 py-1 text-xs font-bold ${riskClass[resident.riskLevel]}`}>ریسک {riskLabel[resident.riskLevel]}</span><span className="text-left text-lg text-muted-foreground">←</span></Link></li>)}</ul></SectionCard>}
  </AppShell>;
}
