'use client'

import { LeftSidebar } from '@/components/layout/left-sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Left Sidebar - Navigation */}
      <LeftSidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
