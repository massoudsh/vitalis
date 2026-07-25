import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vitalis — پلتفرم مدیریت عملیات مراقبت سالمندان",
  description:
    "ثبت مراقبت، مدیریت شیفت و Care Timeline قابل اعتماد برای مراکز مراقبت سالمندان.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
