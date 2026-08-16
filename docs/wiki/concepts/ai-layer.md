# AI Layer — الگوی Human-in-the-loop

> اصل طراحی #۳: خروجی AI همیشه مکمل است، نه رکورد اصلی، و همیشه به رکورد منبع ارجاع می‌دهد + نیاز به تأیید انسان دارد.

## کاربردهای فعلی (فاز ۱)
1. **خلاصهٔ Handoff** — از رکوردهای همان شیفت، پیش‌نویس (`HandoffNote.aiSummary`) می‌سازد؛ مراقب باید تأیید/ویرایش کند قبل از این‌که `content` نهایی شود. هنوز پیاده‌سازی نشده (صفحهٔ `/handoffs` هنوز اسکلت است). ببین [[entities/handoff-note]].
2. **گزارش خانواده** — از تایم‌لاین یک بازه، `FamilyReport` می‌سازد (`aiGenerated: true`)؛ پرستار/ادمین باید تأیید کند قبل از `sentAt`. هنوز پیاده‌سازی نشده. ببین [[entities/family-report]].
3. **هشدار ریسک (AIInsight)** — فاز اول **rule-based**. هستهٔ منطقی سه قاعده در `src/lib/insights.ts` پیاده و با vitest تست شده: دارو فراموش‌شده مکرر (`hasRepeatedMissedMedication`)، انحراف علائم حیاتی از baseline (`isVitalOutlier`)، تکرار یادداشت با شدت نگران‌کننده/فوری (`hasRepeatedConcerningNotes`). این توابع خالص‌اند و هنوز به جدول `AIInsight`/کوئری داشبورد وصل نشده‌اند — قدم بعدی. لایهٔ خلاصه‌سازی LLM هنوز کد نشده. ببین [[entities/ai-insight]].

## قاعدهٔ ثابت
هیچ خروجی AI مستقیم به کاربر نهایی/خانواده نمی‌رسد بدون این‌که یک `User` با نقش مناسب آن را تأیید کرده باشد (`InsightStatus`, `HandoffNote.acknowledgedAt`, `FamilyReport.approvedById`).

## وابستگی‌ها
- [[entities/ai-insight]] — مدل ردیابی منبع (`sourceRecordIds`).
- [[concepts/care-timeline]] — منبع خام همهٔ محاسبات.
- تنظیمات: `AI_API_KEY`, `AI_MODEL` در `.env.example` — ارائه‌دهنده انتخابی تیم، هنوز کد فراخوانی نوشته نشده.

## منابع کد
- `docs/ARCHITECTURE.md` بخش «هشدار ریسک (AI Insight)» و اصل طراحی #۳
- `.env.example:8-10`
- `src/lib/insights.ts` — توابع rule-based (خالص، بدون DB)
- `src/lib/insights.test.ts` — تست واحد (vitest)
