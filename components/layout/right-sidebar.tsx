import { cn } from '@/lib/utils'

interface RightSidebarProps {
  children: React.ReactNode
  className?: string
}

export function RightSidebar({ children, className }: RightSidebarProps) {
  return (
    <aside
      data-testid="right-sidebar"
      className={cn(
        'w-80 border-l bg-white dark:bg-[#1a202c] hidden xl:flex flex-col overflow-y-auto',
        className
      )}
    >
      {children}
    </aside>
  )
}
