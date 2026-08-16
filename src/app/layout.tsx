import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

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
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
