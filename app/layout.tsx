import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { UploadThingProvider } from "@/components/providers/uploadthing-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Album System",
  description: "Create and manage your photo albums",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UploadThingProvider>{children}</UploadThingProvider>
      </body>
    </html>
  )
}
