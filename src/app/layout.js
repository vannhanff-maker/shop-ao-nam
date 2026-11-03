import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext"; // Thêm dòng này để import Context
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Shop Áo Nam",
  description: "Thời trang nam hiện đại, tối giản.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/* Bọc AuthProvider quanh {children} để toàn bộ ứng dụng dùng được Context */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
