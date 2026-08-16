# Overview — Vitalis

**Vitalis** پلتفرم هوشمند مدیریت عملیات مراقبت سالمندان (Clinical Eldercare Operations Platform) است. هدف: جایگزینی فرم کاغذی/اکسل/پیام‌رسان برای ثبت مراقبت روزانه با یک محل واحد که به‌طور خودکار یک **Care Timeline** قابل‌اعتماد برای هر سالمند می‌سازد، به‌علاوهٔ یک لایهٔ نازک AI (خلاصه‌سازی شیفت/گزارش خانواده + هشدار ریسک rule-based).

## وضعیت فعلی
**فاز ۱ (MVP) — شروع‌شده.** auth واقعی (NextAuth Credentials + گارد
middleware روی مسیرهای عملیاتی)، اتصال Prisma واقعی در `/dashboard`،
`/residents`، `/residents/[id]` (Care Timeline)، فرم/API ثبت سالمند جدید،
و منطق rule-based AI Insight (`src/lib/insights.ts`، تست‌شده با vitest).
باقی‌مانده: فرم‌های ثبت علائم حیاتی/MAR/یادداشت/حادثه، مدیریت شیفت واقعی،
خلاصهٔ AI برای handoff، پورتال خانواده، و اتصال منطق Insight به جدول
`AIInsight`/UI. ببین [[concepts/phasing]].

## استک
Next.js 14 (App Router) + TypeScript، PostgreSQL + Prisma، NextAuth.js
(Credentials، wire شده)، Tailwind CSS با تم RTL فارسی، Zod، vitest برای
تست واحد. جزئیات کامل: [[../ARCHITECTURE|ARCHITECTURE.md]].

## اصول طراحی
- **Care Timeline به‌عنوان هستهٔ محصول** — نه جدول جدا، بلکه union چند مدل (`VitalSign`, `MedicationAdministration`, `CareNote`, `IncidentReport`, `HandoffNote`) روی `residentId` + `createdAt`. ببین [[concepts/care-timeline]].
- **Multi-tenant از روز اول** — هر `Facility` داده‌های مجزا دارد.
- **AI مکمل، نه رکورد اصلی** — هر خروجی AI به رکوردهای منبع ارجاع می‌دهد و باید انسان تأیید کند. ببین [[concepts/ai-layer]].
- **RBAC از ابتدا** — نقش‌ها: ADMIN, NURSE, CAREGIVER, FAMILY_MEMBER (+ DOCTOR در فاز ۲). ببین [[concepts/rbac]].

## نقشهٔ صفحات (App Router)
`/` (لندینگ + وضعیت ورود) → `/login` → `/dashboard`, `/residents` (+ `/residents/new`) → `/residents/[id]` (Care Timeline واقعی), `/shifts`, `/handoffs`, `/family-portal/[residentId]`. همهٔ مسیرها به‌جز `/` و `/login` توسط `middleware.ts` گارد می‌شوند. جزئیات: [[entities/web-routes]] و [[concepts/auth]].

## فازبندی
فاز ۰ (تکمیل‌شده: مدل داده + اسکلت) → **فاز ۱ (در حال انجام: auth، Care Timeline واقعی، داشبورد واقعی، AI Insight rule-based — باقی: ثبت مراقبت کامل، شیفت، handoff، پورتال خانواده)** → فاز ۲ (پنل پزشک، ML واقعی، IoT) → فاز ۳ (Care Copilot مکالمه‌ای). جزئیات: [[concepts/phasing]].

برای فهرست کامل صفحات → [[index]].
