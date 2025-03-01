import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "NAYO - Système de Surveillance de l'Eau",
  description: "Système intelligent de gestion de l'eau en zone rurale basé sur l'IoT et l'IA",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navigation />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

