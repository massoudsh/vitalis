# Web Routes (Next.js App Router)

> نقشهٔ صفحات فعلی — فاز ۱ در حال انجام: auth واقعی + چند صفحهٔ کلیدی به
> Prisma وصل شده‌اند؛ بقیه هنوز اسکلت‌اند (جدول زیر مشخص می‌کند).

## مسئولیت‌ها
| مسیر | فایل | وضعیت |
|---|---|---|
| `/` | `src/app/page.tsx` | لندینگ + نوار وضعیت ورود (session-aware) |
| `/login` | `src/app/login/page.tsx` | فرم ورود (NextAuth Credentials) |
| `/dashboard` | `src/app/dashboard/page.tsx` | ۴ StatCard با کوئری واقعی Prisma، scope شده روی `facilityId` |
| `/residents` | `src/app/residents/page.tsx` | لیست سالمندان — کوئری واقعی |
| `/residents/new` | `src/app/residents/new/page.tsx` | فرم ثبت سالمند جدید → `POST /api/residents` |
| `/residents/[id]` | `src/app/residents/[id]/page.tsx` | Care Timeline واقعی (union ۵ مدل) |
| `/shifts` | `src/app/shifts/page.tsx` | تقویم شیفت — هنوز اسکلت (بدون کوئری) |
| `/handoffs` | `src/app/handoffs/page.tsx` | لیست Handoff — هنوز اسکلت (بدون کوئری) |
| `/family-portal/[residentId]` | `src/app/family-portal/[residentId]/page.tsx` | نمای فقط‌خواندنی خانواده — هنوز اسکلت |

## API Routes
| مسیر | فایل | مسئولیت |
|---|---|---|
| `/api/auth/[...nextauth]` | `src/app/api/auth/[...nextauth]/route.ts` | NextAuth route handler |
| `/api/residents` (POST) | `src/app/api/residents/route.ts` | ثبت سالمند جدید — فقط نقش `ADMIN`/`NURSE`، Zod validation |

## وابستگی‌ها
- [[entities/resident]], [[entities/shift]], [[entities/handoff-note]], [[entities/family-report]] — هر صفحه داده‌های کدام مدل را نمایش می‌دهد.
- [[concepts/auth]] — پیاده‌سازی login/session.
- `src/lib/prisma.ts` — singleton کلاینت Prisma.

## قراردادها / Edge cases
- همهٔ صفحات `dir="rtl"` و `lang="fa"` از `src/app/layout.tsx` به ارث می‌برند.
- `middleware.ts` مسیرهای `/dashboard`, `/residents`, `/shifts`, `/handoffs`, `/family-portal` را گارد می‌کند (ورود اجباری، redirect به `/login`). `/` و `/login` عمومی‌اند.
- تفکیک نقش (RBAC دقیق‌تر از «فقط لاگین») هنوز فقط در `/api/residents` پیاده شده — بقیهٔ صفحات/route ها باید طبق [[concepts/rbac]] تکمیل شوند.

## منابع کد
- `src/app/layout.tsx` — RootLayout مشترک + `Providers` (SessionProvider)
- `middleware.ts` — گارد auth
