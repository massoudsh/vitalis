# Web Routes (Next.js App Router)

> نقشهٔ صفحات فعلی — همگی در فاز ۰ صرفاً **اسکلت استاتیک** هستند (بدون کوئری Prisma واقعی، بدون فرم فعال، بدون auth guard).

## مسئولیت‌ها
| مسیر | فایل | وضعیت |
|---|---|---|
| `/` | `src/app/page.tsx` | لندینگ، لینک به ۴ ماژول |
| `/dashboard` | `src/app/dashboard/page.tsx` | ۴ StatCard با مقدار placeholder `—` |
| `/residents` | `src/app/residents/page.tsx` | لیست سالمندان (بدون کوئری) |
| `/residents/[id]` | `src/app/residents/[id]/page.tsx` | نمای Care Timeline (بدون کوئری) |
| `/shifts` | `src/app/shifts/page.tsx` | تقویم شیفت (بدون کوئری) |
| `/handoffs` | `src/app/handoffs/page.tsx` | لیست Handoff (بدون کوئری) |
| `/family-portal/[residentId]` | `src/app/family-portal/[residentId]/page.tsx` | نمای فقط‌خواندنی خانواده (بدون کوئری) |

## وابستگی‌ها
- [[entities/resident]], [[entities/shift]], [[entities/handoff-note]], [[entities/family-report]] — هر صفحه داده‌های کدام مدل را نمایش خواهد داد.
- `src/lib/prisma.ts` — singleton کلاینت Prisma، آمادهٔ استفاده در صفحات وقتی به Server Component/Route Handler وصل شوند.

## قراردادها / Edge cases
- همهٔ صفحات `dir="rtl"` و `lang="fa"` از `src/app/layout.tsx` به ارث می‌برند.
- هیچ middleware/auth guard فعلاً روی این مسیرها نیست — قدم بعدی طبق [[concepts/rbac]].

## منابع کد
- `src/app/layout.tsx` — RootLayout مشترک
