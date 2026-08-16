# فازبندی محصول

> منبع کامل: [[../MVP_SCOPE|docs/MVP_SCOPE.md]]. این صفحه فقط خلاصهٔ وضعیت است — هر بار فازی عوض شد این‌جا و `log.md` آپدیت شود.

## فاز ۰ — تکمیل‌شده
مدل دادهٔ کامل (`prisma/schema.prisma`) + اسکلت صفحات UI ([[entities/web-routes]]) بدون اتصال دیتابیس، بدون auth واقعی، بدون API route.

## فاز ۱ — **در حال انجام (شروع‌شده)**
- ✅ auth واقعی (NextAuth Credentials + گارد `middleware.ts`) → [[concepts/auth]]
- ✅ داشبورد ادمین با دادهٔ واقعی (کوئری Prisma، نه placeholder)
- ✅ Care Timeline واقعی (`/residents/[id]`، union ۵ مدل) → [[concepts/care-timeline]]
- ✅ ثبت سالمند جدید (`/residents/new` + `POST /api/residents`)
- ✅ هستهٔ منطقی AI Insight rule-based، تست‌شده (`src/lib/insights.ts`) — هنوز به جدول `AIInsight`/UI وصل نشده
- ⬜ ثبت مراقبت کامل (فرم علائم حیاتی، MAR، یادداشت روزانه، گزارش حادثه) → [[entities/clinical-records]]
- ⬜ مدیریت شیفت واقعی + تحویل شیفت با پیش‌نویس AI → [[entities/shift]], [[entities/handoff-note]]
- ⬜ پورتال خانواده پایه (گزارش دوره‌ای + اعلان حادثه) → [[entities/family-report]]

## فاز ۲
پنل پزشک (`DOCTOR`)، مدل‌های پیش‌بینی ریسک واقعی (ML روی داده طولی)، اتصال تجهیزات پزشکی (IoT vitals)، تحلیل کیفیت چندمرکزی، مدیریت کامل توانبخشی.

## فاز ۳
Care Copilot مکالمه‌ای (چت روی داده سالمند + پیشنهاد اقدام خودکار)، اتصال بیمه/گزارش‌دهی نظارتی خودکار.

## معیار موفقیت MVP
- هر شیفت حداقل یک `HandoffNote` تکمیل‌شده دارد.
- کاهش «دارو بدون رکورد مصرف» نسبت به فرم کاغذی.
- حداقل ۱ گزارش خانواده در هفته برای هر سالمند فعال.
- باز کردن Care Timeline زیر ۱۰ ثانیه.
