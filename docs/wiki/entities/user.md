# User

> کاربر سیستم با یک نقش ثابت (RBAC)، مقید به یک Facility.

## مسئولیت‌ها
- احراز هویت — از فاز ۱ واقعاً wire شده: NextAuth Credentials با `phone` (`@unique`) + `passwordHash`، آمادهٔ افزودن provider OTP موبایل کنار آن. ببین [[concepts/auth]].
- نویسندهٔ اکثر رکوردهای بالینی (`recordedBy`, `administeredBy`, `author`, `reportedBy`, `approvedBy`, `reviewedBy` روی مدل‌های مختلف).

## وابستگی‌ها
- [[entities/facility]] — مقید به `facilityId`.
- [[concepts/rbac]] — نقش (`UserRole`) رفتار/دسترسی UI و API را تعیین می‌کند.
- [[concepts/auth]] — پیاده‌سازی login/session که این مدل را می‌خواند.
- [[entities/family-member]] — `FamilyMember.userId` اختیاری برای دسترسی پورتال خانواده.

## قراردادها / Edge cases
- `UserRole`: `ADMIN | NURSE | CAREGIVER | DOCTOR | FAMILY_MEMBER` — نقش `DOCTOR` برای فاز ۲ رزرو شده.
- `UserStatus`: `ACTIVE | SUSPENDED | INVITED` — فقط `ACTIVE` اجازهٔ ورود دارد (چک در `authorize()`).
- `FAMILY_MEMBER` علاوه‌بر Facility باید به `Resident` خاص هم مقید شود (از طریق `FamilyMember`، نه مستقیم روی `User`).
- `passwordHash` اختیاری در schema، ولی برای ورود الزامی است؛ اگر خالی باشد `authorize()` رد می‌کند.

## منابع کد
- `prisma/schema.prisma:43-83` — enum `UserRole`/`UserStatus` + model `User`
- `src/lib/auth.ts` — منطق `authorize()`
- `prisma/seed.ts` — کاربران نمونه برای تست login
