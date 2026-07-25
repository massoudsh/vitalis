# Vitalis

پلتفرم هوشمند مدیریت عملیات مراقبت سالمندان (Clinical Eldercare Operations
Platform).

## اسناد
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — معماری فنی، استک، RBAC، فازبندی
- [`docs/MVP_SCOPE.md`](docs/MVP_SCOPE.md) — دامنهٔ دقیق نسخهٔ اول
- [`prisma/schema.prisma`](prisma/schema.prisma) — مدل کامل داده

## اجرای توسعه (روی سرور با دسترسی build، نه داخل کانتینر توسعه)
```bash
cp .env.example .env   # مقادیر DATABASE_URL و NEXTAUTH_SECRET را پر کنید
npm install
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

## ساختار پوشه‌ها
```
prisma/schema.prisma       # مدل داده
src/app/                   # صفحات Next.js (App Router)
  dashboard/                # داشبورد ادمین
  residents/[id]/           # پروفایل و Care Timeline سالمند
  shifts/                   # مدیریت شیفت
  handoffs/                 # تحویل شیفت
  family-portal/[residentId]/ # پورتال خانواده
src/lib/prisma.ts           # کلاینت Prisma
docs/                        # مستندات معماری و MVP
```
