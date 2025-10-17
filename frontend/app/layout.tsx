import type React from "react"
import type { Metadata } from "next"
import { Poppins, Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { PageTransition } from "@/components/page-transition"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
})

const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Bias Trainer for Kids",
  description: "Learn to identify and correct bias in AI-generated sentences",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} ${inter.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <PageTransition>{children}</PageTransition>
          <Toaster />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
