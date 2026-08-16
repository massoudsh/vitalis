# HandoffNote

> یادداشت تحویل شیفت — کلی مرکز یا مخصوص یک سالمند، با پیش‌نویس خلاصهٔ AI.

## مسئولیت‌ها
- انتقال اطلاعات بین دو شیفت پیاپی (`fromStaff` → `toStaff`، اختیاری).
- نگهداری `aiSummary` (پیش‌نویس تولیدشده توسط AI) جدا از `content` نهایی که مراقب تأیید/ویرایش می‌کند.
- اولویت‌بندی (`priority: RiskLevel`) و ردیابی «دیده‌شد» (`acknowledgedAt`).

## وابستگی‌ها
- [[entities/shift]] — `shiftId` الزامی.
- [[entities/resident]] — `residentId` اختیاری (null = یادداشت کلی مرکز).
- [[concepts/ai-layer]] — الگوی «AI پیش‌نویس می‌دهد، انسان تأیید می‌کند» دقیقاً همین‌جا پیاده می‌شود.

## قراردادها / Edge cases
- جریان: مراقب رکوردهای شیفت را ثبت می‌کند → دکمهٔ «پیش‌نویس خلاصه با AI» → `aiSummary` پر می‌شود → مراقب ویرایش/تأیید → `content` نهایی می‌شود.
- `aiSummary` هرگز مستقیم به‌عنوان `content` نهایی ذخیره نمی‌شود بدون دخالت انسان.

## منابع کد
- `prisma/schema.prisma:208-227`
- `src/app/handoffs/page.tsx` — لیست Handoffها (اسکلت)
- `docs/ARCHITECTURE.md` بخش «تحویل شیفت (Handoff)»
