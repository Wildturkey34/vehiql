import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Vehiql",
  description: "Find your dream car",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={`${inter.className} `}>
          <Header />
        <main className="min-h-screen">
       {children}
        </main>
        <Toaster richColors/>
        <footer className="bg-gray-100 py-6 border-t">
  <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
    <p>&copy; {new Date().getFullYear()} Vehiql. All rights reserved.</p>
    <p className="mt-1">Designed and developed by the Vehiql Team</p>
  </div>
</footer>

      </body>
    </html>
    </ClerkProvider>
  );
}
