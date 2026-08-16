# Overview — Vitalis

**Vitalis** پلتفرم هوشمند مدیریت عملیات مراقبت سالمندان (Clinical Eldercare Operations Platform) است. هدف: جایگزینی فرم کاغذی/اکسل/پیام‌رسان برای ثبت مراقبت روزانه با یک محل واحد که به‌طور خودکار یک **Care Timeline** قابل‌اعتماد برای هر سالمند می‌سازد، به‌علاوهٔ یک لایهٔ نازک AI (خلاصه‌سازی شیفت/گزارش خانواده + هشدار ریسک rule-based).

## وضعیت فعلی
**فاز ۰ — مدل داده + اسکلت پروژه.** فقط صفحات UI استاتیک (بدون اتصال دیتابیس/فرم/auth واقعی) پیاده شده‌اند؛ Prisma schema کامل است ولی هیچ migration اجرا نشده و هیچ API route نوشته نشده. `next-auth` به‌عنوان dependency هست ولی هنوز wire نشده.

## استک
Next.js 14 (App Router) + TypeScript، PostgreSQL + Prisma، NextAuth.js (برنامه‌ریزی‌شده)، Tailwind CSS با تم RTL فارسی، Zod. جزئیات کامل: [[../ARCHITECTURE|ARCHITECTURE.md]].

## اصول طراحی
- **Care Timeline به‌عنوان هستهٔ محصول** — نه جدول جدا، بلکه union چند مدل (`VitalSign`, `MedicationAdministration`, `CareNote`, `IncidentReport`, `HandoffNote`) روی `residentId` + `createdAt`. ببین [[concepts/care-timeline]].
- **Multi-tenant از روز اول** — هر `Facility` داده‌های مجزا دارد.
- **AI مکمل، نه رکورد اصلی** — هر خروجی AI به رکوردهای منبع ارجاع می‌دهد و باید انسان تأیید کند. ببین [[concepts/ai-layer]].
- **RBAC از ابتدا** — نقش‌ها: ADMIN, NURSE, CAREGIVER, FAMILY_MEMBER (+ DOCTOR در فاز ۲). ببین [[concepts/rbac]].

## نقشهٔ صفحات (App Router)
`/` (لندینگ ماژول‌ها) → `/dashboard`, `/residents` → `/residents/[id]` (Care Timeline), `/shifts`, `/handoffs`, `/family-portal/[residentId]`. جزئیات: [[entities/web-routes]].

## فازبندی
فاز ۰ (فعلی: مدل داده + اسکلت) → فاز ۱ (MVP: ثبت مراقبت کامل، شیفت، handoff، پورتال خانواده پایه، هشدار rule-based) → فاز ۲ (پنل پزشک، ML واقعی، IoT) → فاز ۳ (Care Copilot مکالمه‌ای). جزئیات: [[concepts/phasing]].

برای فهرست کامل صفحات → [[index]].
