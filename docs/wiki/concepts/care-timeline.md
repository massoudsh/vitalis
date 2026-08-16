# Care Timeline

> مفهوم مرکزی محصول: خط زمانی واحد و قابل‌بازسازی برای هر سالمند.

## تعریف
تایم‌لاین هر سالمند **جدول جدا نیست** — از **union** پنج مدل رکورد بالینی ساخته می‌شود، مرتب‌شده بر اساس زمان:
`VitalSign + MedicationAdministration + CareNote + IncidentReport + HandoffNote`

همه به `residentId` مرتبطند و فیلد زمانی مشخص دارند (`recordedAt`/`createdAt`/`scheduledTime`). این باعث می‌شود UI/API بتواند تایم‌لاین را با یک کوئری ترکیبی (نه join پیچیده یا دوباره‌کاری داده) بازسازی کند.

## چرا این تصمیم گرفته شد
- جلوگیری از دوباره‌کاری داده (یک جدول تایم‌لاین جدا یعنی sync دستی با ۵ منبع).
- امکان فیلتر بر اساس نوع رکورد و بازهٔ زمانی بدون تغییر schema.
- منبع اصلی برای [[concepts/ai-layer|AI Insight]]، [[entities/handoff-note]] و [[entities/family-report]].

## پیاده‌سازی فعلی
`/residents/[id]` ([[entities/web-routes]]) این کوئری را واقعاً اجرا می‌کند:
۵ کوئری Prisma موازی (`Promise.all`) روی `residentId`، هر رکورد به یک شکل
یکسان (`{type, at, summary, by, severity?}`) map می‌شود، سپس در حافظه بر
اساس `at` (نزولی) مرتب و رندر می‌شود. فیلتر بر اساس نوع رکورد/بازهٔ زمانی
هنوز اضافه نشده (قدم بعدی فاز ۱).

## وابستگی‌ها
- [[entities/clinical-records]] — پنج مدل تشکیل‌دهنده.
- [[entities/handoff-note]] — عضو ششم تایم‌لاین.
- [[entities/resident]] — گره مرکزی.

## منابع کد
- `docs/ARCHITECTURE.md` بخش «Care Timeline (مفهوم مرکزی)»
- `src/app/residents/[id]/page.tsx` — پیاده‌سازی کوئری ترکیبی واقعی
