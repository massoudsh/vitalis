"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      phone,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("شماره موبایل یا رمز عبور اشتباه است.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-8">
      <h1 className="text-2xl font-bold text-vitalis-primary">ورود به Vitalis</h1>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label className="block text-sm text-gray-600">شماره موبایل</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="09xxxxxxxxx"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600">رمز عبور</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-vitalis-primary px-4 py-2 text-white disabled:opacity-60"
        >
          {loading ? "در حال ورود..." : "ورود"}
        </button>
      </form>
    </main>
  );
}
