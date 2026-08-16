# FamilyMember

> رکورد رابطهٔ یک عضو خانواده با یک سالمند مشخص + تنظیم اعلان.

## مسئولیت‌ها
- نگهداری اطلاعات تماس و نسبت (`FamilyRelation`) با سالمند.
- کنترل `notifyOnIncident` — آیا این عضو خانواده در صورت حادثه مطلع شود یا نه.
- اتصال اختیاری به `User` (`userId`) برای دسترسی پورتال خانواده.

## وابستگی‌ها
- [[entities/resident]] — والد مستقیم (`residentId`).
- [[entities/user]] — در صورت داشتن حساب پورتال.
- صفحهٔ UI: `/family-portal/[residentId]` — [[entities/web-routes]].

## قراردادها / Edge cases
- `FamilyRelation`: `CHILD | SPOUSE | SIBLING | GRANDCHILD | GUARDIAN | OTHER`.
- دسترسی پورتال خانواده فقط‌خواندنی و محدود به همان `residentId` است (نقش `FAMILY_MEMBER`).

## منابع کد
- `prisma/schema.prisma:143-166`
