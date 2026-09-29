import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const font = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "Study AI - Study Smarter. Learn Faster.",
  description: "AI study companion for roadmaps, flashcards, quizzes, notes and doubts. Created by Ravi.",
};
export const viewport = { width: "device-width", initialScale: 1, themeColor: "#05060f" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={font.variable}>
      <body className="font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
