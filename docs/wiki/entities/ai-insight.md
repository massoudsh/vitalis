# AIInsight

> خروجی لایهٔ AI (هشدار ریسک، روند، پیش‌نویس خلاصه) با ردیابی شفاف منبع و گردش تأیید انسانی.

## مسئولیت‌ها
- نگهداری هر بینش تولیدشده (rule-based یا LLM) با ارجاع به رکوردهای منبع (`sourceRecordIds: Json`).
- وضعیت‌دهی (`InsightStatus`) تا هیچ بینشی بدون بررسی انسان «اقدام‌شده» تلقی نشود.

## وابستگی‌ها
- [[entities/facility]] — `facilityId` الزامی.
- [[entities/resident]] — `residentId` اختیاری (بعضی بینش‌ها سطح مرکز هستند).
- [[concepts/ai-layer]] — الگوی کامل human-in-the-loop اینجا مستند است.

## قراردادها / Edge cases
- `InsightType`: `RISK_ALERT | TREND | SHIFT_SUMMARY | FAMILY_SUMMARY | RECOMMENDATION`.
- `InsightStatus`: `NEW | REVIEWED | DISMISSED | ACTIONED`.
- `sourceRecordIds` آرایه‌ای از `{model, id}` است — فرمت آزاد (JSONB)، نه foreign key واقعی؛ هنگام حذف رکورد منبع باید مراقب dangling reference بود (هنوز cascade/cleanup تعریف نشده).

## منابع کد
- `prisma/schema.prisma:407-442`
