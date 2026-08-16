# RBAC — نقش‌ها و دسترسی

> نقش‌ها از روز اول در مدل داده هستند. enforcement پایه از فاز ۱ شروع شده:
> `middleware.ts` ورود اجباری روی مسیرهای عملیاتی را تحمیل می‌کند، و
> `POST /api/residents` فقط نقش `ADMIN`/`NURSE` را می‌پذیرد. تفکیک دقیق‌تر
> نقش به نقش (مثلاً CAREGIVER فقط سالمندان تحت پوشش) هنوز در هر route/page
> باید اضافه شود.

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
- [[concepts/auth]] — پیاده‌سازی session/JWT که `role`/`facilityId` را حمل می‌کند.
- [[entities/web-routes]] — مسیرهایی که middleware گارد می‌کند.

## قراردادها / Edge cases
- audit trail کامل روی هر تغییر رکورد بالینی جزو اصول طراحی است (compliance حوزهٔ بالینی) — هنوز در schema پیاده نشده؛ اگر اضافه شد این صفحه باید آپدیت شود.
- `middleware.ts` فقط «ورود اجباری» را چک می‌کند، نه نقش خاص؛ چک نقش داخل هر page/route انجام می‌شود (مثال: `src/app/api/residents/route.ts`).

## منابع کد
- `prisma/schema.prisma:43-49` — enum `UserRole`
- `docs/ARCHITECTURE.md` بخش «۳. نقش‌ها (RBAC)»
- `middleware.ts` — گارد auth پایه
- `src/app/api/residents/route.ts` — نمونهٔ چک نقش در API route
