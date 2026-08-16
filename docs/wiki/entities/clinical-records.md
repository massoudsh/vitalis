# Clinical Records (VitalSign, Medication, MedicationAdministration, CareNote, IncidentReport)

> پنج مدل رکورد بالینی که با هم Care Timeline یک سالمند را می‌سازند. برای مفهوم ترکیب‌شان ببین [[concepts/care-timeline]].

## مسئولیت‌ها
- **VitalSign** — علائم حیاتی لحظه‌ای (فشار خون، ضربان، دما، SpO2، تنفس، قند خون، وزن).
- **Medication** — لیست داروی فعال هر سالمند (نام، دوز، مسیر مصرف، دستور).
- **MedicationAdministration** — ثبت هر نوبت مصرف دارو نسبت به یک `Medication` (وضعیت: داده‌شد/فراموش‌شد/امتناع/تأخیر).
- **CareNote** — یادداشت مراقبتی روزمره با دسته‌بندی (تغذیه/خواب/رفتار/درد/بهداشت/خلق‌وخو/تحرک) و شدت.
- **IncidentReport** — گزارش حادثه (سقوط، زخم بستر، آسیب، خطای دارویی، رویداد رفتاری) + زمان اطلاع‌رسانی خانواده.

## وابستگی‌ها
- [[entities/resident]] — والد مستقیم همهٔ پنج مدل (`residentId`).
- [[entities/shift]] — `shiftId` اختیاری روی همهٔ پنج مدل.
- [[entities/user]] — نویسنده/ثبت‌کننده (`recordedBy`, `administeredBy`, `author`, `reportedBy`).
- [[concepts/ai-layer]] — منبع خام برای هشدار ریسک rule-based و خلاصه‌سازی.

## قراردادها / Edge cases
- `MedicationAdminStatus`: `GIVEN | MISSED | REFUSED | DELAYED` — «داروی معوق/فراموش‌شده» در داشبورد از این فیلد می‌آید.
- `Severity` (روی CareNote و IncidentReport): `NORMAL | WATCH | CONCERN | URGENT` — تکرار `CONCERN`/`URGENT` یکی از تریگرهای هشدار ریسک است.
- ایندکس‌های ترکیبی `[residentId, recordedAt/createdAt/scheduledTime]` روی همهٔ پنج مدل — برای ساخت سریع Care Timeline بدون جدول جدا.

## منابع کد
- `prisma/schema.prisma:233-373` — همهٔ پنج مدل + enumهای `MedicationRoute`, `MedicationAdminStatus`, `CareNoteCategory`, `Severity`, `IncidentType`
