# Resident

> پروفایل سالمند — گرهٔ مرکزی که Care Timeline حول آن ساخته می‌شود.

## مسئولیت‌ها
- نگهداری اطلاعات پایه (تشخیص اصلی، آلرژی، مخاطب اضطراری، سطح ریسک دستی).
- والد تمام رکوردهای بالینی: `VitalSign`, `Medication`, `CareNote`, `IncidentReport`, `MedicationAdministration`, `HandoffNote`, `FamilyReport`, `AIInsight`, `FamilyMember`.

## وابستگی‌ها
- [[concepts/care-timeline]] — union رکوردهای این سالمند به‌ترتیب زمان.
- [[entities/family-member]] — اعضای خانواده مرتبط.
- صفحهٔ UI: `/residents/[id]` (نمای Care Timeline) — [[entities/web-routes]].

## قراردادها / Edge cases
- `RiskLevel`: `LOW | MEDIUM | HIGH | CRITICAL` — دستی تنظیم می‌شود؛ در فاز ۲ از مدل پیش‌بینی ML به‌روزرسانی خواهد شد.
- `ResidentStatus`: `ACTIVE | DISCHARGED | DECEASED` — آرشیو به‌جای حذف رکورد.
- ایندکس `[facilityId]` و `[riskLevel]` برای کوئری داشبورد (سالمندان پرریسک هر مرکز).

## منابع کد
- `prisma/schema.prisma:89-141` — enum `ResidentStatus`/`RiskLevel`/`Gender` + model `Resident`
- `src/app/residents/page.tsx` — لیست سالمندان (اسکلت، بدون کوئری دیتابیس)
- `src/app/residents/[id]/page.tsx` — نمای Care Timeline (اسکلت)
