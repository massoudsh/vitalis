# Auth — NextAuth Credentials

> پیاده‌سازی احراز هویت فاز ۱ — طبق `docs/ARCHITECTURE.md` («NextAuth.js
> Credentials + آماده برای OTP موبایل»).

## چطور کار می‌کند
- `src/lib/auth.ts` — `authOptions` با `CredentialsProvider` (شماره موبایل +
  رمز عبور). `authorize()` کاربر را با `User.phone` (`@unique`) پیدا می‌کند،
  `passwordHash` را با `bcryptjs` مقایسه می‌کند، و فقط `UserStatus.ACTIVE`
  را می‌پذیرد.
- `session: { strategy: "jwt" }` — بدون adapter دیتابیس؛ `role` و
  `facilityId` در callback‌های `jwt`/`session` روی توکن/session سوار
  می‌شوند (نوع‌ها در `src/types/next-auth.d.ts` augment شده‌اند).
- `src/app/api/auth/[...nextauth]/route.ts` — route handler NextAuth.
- `src/app/providers.tsx` — `SessionProvider` که در `layout.tsx` کل اپ را
  wrap می‌کند (لازم برای `useSession`/`signIn`/`signOut` در client component‌ها).
- `src/app/login/page.tsx` — فرم ورود (client component، `signIn("credentials", ...)`).
- `middleware.ts` — `withAuth` با `pages.signIn: "/login"`؛ فقط چک می‌کند
  session معتبر هست یا نه (نه نقش خاص) روی `matcher` مسیرهای عملیاتی.

## استفاده در صفحات/API
هر Server Component/Route Handler که نیاز به کاربر دارد:
```ts
const session = await getServerSession(authOptions);
if (!session) redirect("/login"); // یا 401 در API route
```
سپس `session.user.facilityId` برای scope کردن کوئری Prisma و
`session.user.role` برای چک نقش استفاده می‌شود (نمونه: `src/app/api/residents/route.ts`).

## دادهٔ نمونه برای تست محلی
`prisma/seed.ts` یک ادمین (`09120000001`) و یک پرستار (`09120000002`) با
رمز `password123` می‌سازد.

## وابستگی‌ها
- [[entities/user]] — `phone`, `passwordHash`, `role`, `status`.
- [[concepts/rbac]] — لایهٔ چک نقش که روی این session ساخته می‌شود.
- [[entities/web-routes]] — مسیرهایی که middleware گارد می‌کند.

## قراردادها / Edge cases
- اگر `passwordHash` خالی باشد (کاربر هنوز رمز نگرفته) یا `status !== ACTIVE`، ورود رد می‌شود.
- OTP موبایل (فاز بعد) باید provider جدید کنار Credentials اضافه کند، نه جایگزین آن — طبق ساختار فعلی schema.

## منابع کد
- `src/lib/auth.ts`, `src/types/next-auth.d.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `middleware.ts`
- `prisma/seed.ts:16-40` — کاربران نمونه
