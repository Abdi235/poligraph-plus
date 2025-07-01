import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Added Navbar import

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PoliGraph Plus", // Updated title
  description: "Your real-time feed for sports and news.", // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`} // Added bg-gray-100
      >
        <Navbar /> {/* Added Navbar component */}
        <main className="container mx-auto p-4"> {/* Added main container */}
          {children}
        </main>
        <footer className="bg-gray-800 text-white text-center p-4 mt-8"> {/* Added basic footer */}
          <p>&copy; {new Date().getFullYear()} PoliGraph Plus. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
