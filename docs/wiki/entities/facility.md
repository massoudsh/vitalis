# Facility

> مرکز مراقبت (خانه سالمند/مراقبت روزانه/مراقبت در منزل/توانبخشی/بخش طولانی‌مدت بیمارستان) — واحد اصلی multi-tenancy.

## مسئولیت‌ها
- ریشهٔ تمام داده‌های یک مرکز: کاربران، سالمندان، شیفت‌ها، AIInsightها.
- نگهداری `timezone` (پیش‌فرض `Asia/Tehran`) برای محاسبات زمانی شیفت/گزارش.

## وابستگی‌ها
- [[entities/user]] — هر کاربر به یک Facility مقید است (`User.facilityId`).
- [[entities/resident]] — هر سالمند متعلق به یک Facility.
- [[concepts/rbac]] — مرز اصلی isolation داده بین مراکز.

## قراردادها / Edge cases
- فاز اول تک‌مرکزی فروخته می‌شود اما مدل داده باید بدون migration بزرگ به چند مرکز گسترش یابد (اصل طراحی #۲ در ARCHITECTURE.md).
- `FacilityType` یک enum بسته است؛ نوع جدید مرکز نیاز به migration دارد.

## منابع کد
- `prisma/schema.prisma:17-41` — enum `FacilityType` + model `Facility`
