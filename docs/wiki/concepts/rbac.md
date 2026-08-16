# RBAC — نقش‌ها و دسترسی

> نقش‌ها از روز اول در مدل داده هستند؛ enforcement واقعی (middleware/route guard) هنوز در فاز ۰ پیاده نشده.

## نقش‌ها
| نقش | دسترسی |
|---|---|
| `ADMIN` | مدیر مرکز: کاربران، شیفت‌ها، تمام سالمندان، گزارش کیفیت |
| `NURSE` | ثبت دارو/علائم حیاتی، تأیید یادداشت caregiver، مدیریت handoff |
| `CAREGIVER` | ثبت مراقبت روزمره، مشاهدهٔ تایم‌لاین سالمندان تحت پوشش |
| `FAMILY_MEMBER` | مشاهدهٔ فقط‌خواندنیِ گزارش‌های تأییدشده + اعلان حادثهٔ سالمند مرتبط |
| `DOCTOR` *(فاز ۲)* | دسترسی کامل پروندهٔ بالینی + دستور دارویی |

## مرزهای isolation
- همهٔ نقش‌ها به یک `Facility` مقیدند (`User.facilityId`).
- `FAMILY_MEMBER` علاوه‌بر Facility به یک `Resident` خاص هم مقید می‌شود (از طریق [[entities/family-member]]، نه مستقیم روی User).

## وابستگی‌ها
- [[entities/user]] — فیلد `role`.
- [[entities/facility]] — مرز اصلی tenant isolation.
- [[entities/web-routes]] — جایی که guard باید اعمال شود (هنوز پیاده نشده).

## قراردادها / Edge cases
- audit trail کامل روی هر تغییر رکورد بالینی جزو اصول طراحی است (compliance حوزهٔ بالینی) — هنوز در schema پیاده نشده؛ اگر اضافه شد این صفحه باید آپدیت شود.

## منابع کد
- `prisma/schema.prisma:43-49` — enum `UserRole`
- `docs/ARCHITECTURE.md` بخش «۳. نقش‌ها (RBAC)»
