# Vitalis

پلتفرم هوشمند مدیریت عملیات مراقبت سالمندان (Clinical Eldercare Operations
Platform).

## اسناد
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — معماری فنی، استک، RBAC، فازبندی
- [`docs/MVP_SCOPE.md`](docs/MVP_SCOPE.md) — دامنهٔ دقیق نسخهٔ اول
- [`prisma/schema.prisma`](prisma/schema.prisma) — مدل کامل داده
- [`docs/wiki/index.md`](docs/wiki/index.md) — ویکی دانش پروژه (خلاصهٔ entity‌ها/concept‌ها، همگام با کد) — نسخهٔ آنلاین: [GitHub Wiki](https://github.com/massoudsh/vitalis/wiki)

## اجرای توسعه (روی سرور با دسترسی build، نه داخل کانتینر توسعه)
```bash
cp .env.example .env   # مقادیر DATABASE_URL و NEXTAUTH_SECRET را پر کنید
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed    # دادهٔ نمونه: مرکز + کاربر ادمین/پرستار + ۲ سالمند
npm run dev
```

ورود نمونه پس از seed: شماره موبایل `09120000001` (ادمین) یا `09120000002`
(پرستار)، رمز عبور `password123`.

## تست و کیفیت
```bash
npm run lint
npm run typecheck
npm test          # vitest — منطق rule-based در src/lib/insights.ts
npm run build
```
همین دستورات در CI (`.github/workflows/ci.yml`) روی هر push/PR به `main` اجرا می‌شوند.

## ساختار پوشه‌ها
```
prisma/schema.prisma       # مدل داده
prisma/seed.ts              # دادهٔ نمونهٔ محلی (idempotent)
src/app/                   # صفحات Next.js (App Router)
  login/                    # صفحهٔ ورود (NextAuth Credentials)
  dashboard/                # داشبورد ادمین — کوئری واقعی Prisma
  residents/                # لیست + افزودن سالمند (کوئری/فرم واقعی)
  residents/[id]/           # Care Timeline واقعی (union ۵ مدل رکورد)
  shifts/                   # مدیریت شیفت (هنوز اسکلت)
  handoffs/                 # تحویل شیفت (هنوز اسکلت)
  family-portal/[residentId]/ # پورتال خانواده (هنوز اسکلت)
  api/auth/[...nextauth]/    # NextAuth route handler
  api/residents/             # POST برای ثبت سالمند
src/lib/prisma.ts           # کلاینت Prisma
src/lib/auth.ts             # پیکربندی NextAuth (Credentials)
src/lib/insights.ts         # منطق rule-based AI Insight (تست‌شده با vitest)
middleware.ts                # گارد auth روی مسیرهای عملیاتی
docs/                        # مستندات معماری و MVP
```

## وضعیت فاز ۱
پیاده‌شده: auth واقعی (NextAuth Credentials + RBAC پایه در middleware)، اتصال
Prisma واقعی در داشبورد/سالمندان/Care Timeline، ثبت سالمند جدید، منطق
rule-based AI Insight (تست‌شده). باقی‌مانده: فرم ثبت علائم حیاتی/MAR/یادداشت/حادثه،
مدیریت شیفت واقعی، خلاصهٔ AI برای handoff، پورتال خانواده، و اتصال منطق
Insight به جدول `AIInsight` و UI.
