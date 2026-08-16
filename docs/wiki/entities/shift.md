# Shift

> شیفت کاری یک کارمند (صبح/عصر/شب) — چارچوب زمانی برای اکثر رکوردهای بالینی و برای Handoff.

## مسئولیت‌ها
- تعریف بازهٔ زمانی (`startTime`/`endTime`) و وضعیت (`ShiftStatus`) یک شیفت برای یک `staff`.
- گروه‌بندی اختیاری رکوردهای بالینی همان بازه (`VitalSign.shiftId` و غیره) برای تولید خلاصهٔ AI در Handoff.

## وابستگی‌ها
- [[entities/user]] — `staffId` (رابطهٔ `StaffShifts`).
- [[entities/facility]] — `facilityId`.
- [[entities/handoff-note]] — هر Handoff به یک Shift مشخص وصل است.
- [[concepts/care-timeline]] — رکوردهای بالینی می‌توانند اختیاراً به یک شیفت لینک شوند.

## قراردادها / Edge cases
- `ShiftType`: `MORNING | EVENING | NIGHT`.
- `ShiftStatus`: `SCHEDULED | IN_PROGRESS | COMPLETED | MISSED`.
- ایندکس `[facilityId, startTime]` برای تقویم هفتگی؛ `[staffId]` برای شیفت‌های یک کارمند.

## منابع کد
- `prisma/schema.prisma:172-206`
- `src/app/shifts/page.tsx` — تقویم هفتگی (اسکلت)
