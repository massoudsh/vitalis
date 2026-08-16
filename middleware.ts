import { withAuth } from "next-auth/middleware";

// طبق docs/wiki/concepts/rbac.md — گارد پایه: ورود اجباری برای مسیرهای
// عملیاتی. تفکیک دقیق‌تر نقش‌ها (مثلاً FAMILY_MEMBER فقط سالمند خودش) هنوز
// داخل هر صفحه انجام می‌شود، نه اینجا.
export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/residents/:path*",
    "/shifts/:path*",
    "/handoffs/:path*",
    "/family-portal/:path*",
  ],
};
