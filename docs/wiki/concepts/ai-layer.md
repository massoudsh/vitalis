# AI Layer — الگوی Human-in-the-loop

> اصل طراحی #۳: خروجی AI همیشه مکمل است، نه رکورد اصلی، و همیشه به رکورد منبع ارجاع می‌دهد + نیاز به تأیید انسان دارد.

## کاربردهای فعلی (فاز ۰/۱)
1. **خلاصهٔ Handoff** — از رکوردهای همان شیفت، پیش‌نویس (`HandoffNote.aiSummary`) می‌سازد؛ مراقب باید تأیید/ویرایش کند قبل از این‌که `content` نهایی شود. ببین [[entities/handoff-note]].
2. **گزارش خانواده** — از تایم‌لاین یک بازه، `FamilyReport` می‌سازد (`aiGenerated: true`)؛ پرستار/ادمین باید تأیید کند قبل از `sentAt`. ببین [[entities/family-report]].
3. **هشدار ریسک (AIInsight)** — فاز اول **rule-based** (آستانهٔ علائم حیاتی نسبت به baseline سالمند، دارو فراموش‌شده مکرر، تکرار یادداشت با شدت نگران‌کننده/فوری) + یک لایهٔ خلاصه‌سازی LLM برای «چرا این هشدار مهم است». مدل‌های پیش‌بینی ML واقعی فاز ۲ است. ببین [[entities/ai-insight]].

## قاعدهٔ ثابت
هیچ خروجی AI مستقیم به کاربر نهایی/خانواده نمی‌رسد بدون این‌که یک `User` با نقش مناسب آن را تأیید کرده باشد (`InsightStatus`, `HandoffNote.acknowledgedAt`, `FamilyReport.approvedById`).

## وابستگی‌ها
- [[entities/ai-insight]] — مدل ردیابی منبع (`sourceRecordIds`).
- [[concepts/care-timeline]] — منبع خام همهٔ محاسبات.
- تنظیمات: `AI_API_KEY`, `AI_MODEL` در `.env.example` — ارائه‌دهنده انتخابی تیم، هنوز کد فراخوانی نوشته نشده.

## منابع کد
- `docs/ARCHITECTURE.md` بخش «هشدار ریسک (AI Insight)» و اصل طراحی #۳
- `.env.example:8-10`
