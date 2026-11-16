import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "@fontsource-variable/raleway";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "SketchVault — Virtual Whiteboard for your ideas",
  description:
    "A hand-drawn style virtual whiteboard with cloud sync. Sketch, diagram, save and share your ideas effortlessly.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white font-sans text-[#212529]">
        <ClerkProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <Toaster position="bottom-right" richColors />
        </ClerkProvider>
      </body>
    </html>
  );
}