"use client"

import { SessionProvider } from "next-auth/react"

export default function CourseRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}
