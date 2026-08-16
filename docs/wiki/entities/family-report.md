# FamilyReport

> گزارش دوره‌ای/درخواستی برای خانواده، تولیدشده از تایم‌لاین و تأییدشده پیش از ارسال.

## مسئولیت‌ها
- خلاصهٔ ساده‌فهم (غالباً `aiGenerated: true`) از یک بازهٔ زمانی (`periodStart`/`periodEnd`) برای خانواده.
- گردش تأیید: پرستار/ادمین (`approvedBy`) قبل از `sentAt` باید تأیید کند.

## وابستگی‌ها
- [[entities/resident]] — `residentId`.
- [[entities/user]] — `approvedById` اختیاری.
- [[concepts/ai-layer]] — منبع تولید محتوا.
- صفحهٔ UI: `/family-portal/[residentId]` نمایش می‌دهد.

## قراردادها / Edge cases
- `ReportChannel`: `APP | SMS | EMAIL` — پیش‌فرض `APP`؛ SMS/EMAIL واقعی فاز بعد است.
- بدون `approvedById` نباید `sentAt` ست شود (قرارداد منطقی، نه constraint دیتابیس).

## منابع کد
- `prisma/schema.prisma:385-401`
