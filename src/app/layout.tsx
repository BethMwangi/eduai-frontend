import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const noto = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ExamSuccess - Turn your exams into success stories",
  description: "AI-powered assessment platform for students",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={noto.className} suppressHydrationWarning={true}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}