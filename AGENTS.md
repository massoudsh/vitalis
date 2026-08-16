# Vitalis — راهنمای عامل‌های هوش مصنوعی

## ویکی دانش پروژه (فعال)
مسیر: `docs/wiki/`. این یک قانون اکید است، نه پیشنهاد.

### این چیست
یک «ویکی دانش» زنده و append-friendly کنار کد، که به‌جای re-scan کردن کل کدبیس در هر مکالمه،
خلاصهٔ entity‌ها (مدل‌های Prisma، صفحات کلیدی UI) و concept‌ها (flowها، الگوها، تصمیم‌های معماری) را نگه می‌دارد.

### ساختار پوشه
```
docs/wiki/
  schema.md      # قوانین کامل ساختار/لینک‌گذاری
  overview.md    # یک‌نگاه کلی پروژه (≤۴۰۰ کلمه)
  index.md       # کاتالوگ همهٔ صفحات
  log.md         # تاریخچهٔ append-only
  entities/      # هر entity مهم یک صفحه
  concepts/      # patternها، flowها، تصمیم‌های معماری
```

### شروع هر مکالمه/سشن
۱. اول `docs/wiki/overview.md` و `docs/wiki/index.md` را بخوان (≤۸۰۰ توکن). هرگز کل کدبیس را re-scan نکن.
۲. فقط صفحات مرتبط با تسک فعلی را drill-down کن (`entities/*.md`, `concepts/*.md`).

### وقتی کد را تغییر دادی — قانون اکید
هر بار که یک فایل پروژه را Write/Edit می‌کنی (خارج از `docs/wiki/` خودش):
۱. تشخیص بده این تغییر روی کدام entity/concept اثر می‌گذارد.
۲. صفحهٔ مربوطه را به‌روز کن (فیلد جدید/حذف‌شده، امضای تابع، route جدید، dependency جدید، edge case).
۳. اگر entity/concept کاملاً جدید و به‌اندازهٔ کافی مهم است (≥۳ جای دیگر به آن لینک می‌دهند)، صفحهٔ جدید بساز و در `index.md` لینک بده.
۴. یک خط در `log.md` اضافه کن: `## [YYYY-MM-DD] update | <خلاصهٔ تغییر>`.

تغییرات trivial (typo، فرمت، rename بدون تغییر امضا) نیاز به آپدیت ویکی ندارند.
اگر چند فایل در یک مکالمه تغییر کردند، آپدیت‌های ویکی را **یک‌بار در پایان مکالمه** انجام بده، نه بعد از هر فایل.

### هماهنگی با ویکی GitHub
این ریپو یک [ویکی GitHub](https://github.com/massoudsh/vitalis/wiki) هم دارد (`vitalis.wiki` — کلون جدا با `git clone https://github.com/massoudsh/vitalis.wiki.git`). `docs/wiki/` منبع اصلی و دقیق‌تر است؛ هر تغییر معنایی مهم باید در پایان مکالمه در صفحات معادل ویکی GitHub هم منعکس شود (به‌خصوص `Home`, `Architecture`, `Data-Model`, `MVP-Scope`, `Roadmap`) و push شود.

### قواعد لینک (Obsidian-style)
- `[[entities/user]]` بدون پسوند `.md`.
- نام فایل: lowercase + hyphen (`care-timeline.md` نه `Care Timeline.md`).

### جزئیات کامل
قوانین کامل (چه‌وقت صفحهٔ جدید بساز، ساختار صفحه، Lint دوره‌ای) در `docs/wiki/schema.md`.

---

## بیلد سنگین
بیلد سنگین (`npm run build`, `prisma migrate deploy`, ...) داخل کانتینر توسعه ممنوع — فقط روی سرور با دسترسی SSH.
