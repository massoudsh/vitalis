# User

> کاربر سیستم با یک نقش ثابت (RBAC)، مقید به یک Facility.

## مسئولیت‌ها
- احراز هویت (فاز بعد: NextAuth Credentials + آماده برای OTP موبایل — `phone` فیلد `@unique` است، نه فقط email).
- نویسندهٔ اکثر رکوردهای بالینی (`recordedBy`, `administeredBy`, `author`, `reportedBy`, `approvedBy`, `reviewedBy` روی مدل‌های مختلف).

## وابستگی‌ها
- [[entities/facility]] — مقید به `facilityId`.
- [[concepts/rbac]] — نقش (`UserRole`) رفتار/دسترسی UI و API را تعیین می‌کند.
- [[entities/family-member]] — `FamilyMember.userId` اختیاری برای دسترسی پورتال خانواده.

## قراردادها / Edge cases
- `UserRole`: `ADMIN | NURSE | CAREGIVER | DOCTOR | FAMILY_MEMBER` — نقش `DOCTOR` برای فاز ۲ رزرو شده.
- `UserStatus`: `ACTIVE | SUSPENDED | INVITED`.
- `FAMILY_MEMBER` علاوه‌بر Facility باید به `Resident` خاص هم مقید شود (از طریق `FamilyMember`، نه مستقیم روی `User`).
- `passwordHash` اختیاری — چون auth واقعی هنوز wire نشده (فاز ۰).

## منابع کد
- `prisma/schema.prisma:43-83` — enum `UserRole`/`UserStatus` + model `User`
