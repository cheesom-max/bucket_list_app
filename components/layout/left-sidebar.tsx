'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Target,
  Sparkles,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LeftSidebarProps {
  collapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
}

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'My List',
    href: '/dashboard/bucket-items',
    icon: Target,
  },
  {
    label: 'AI Guide',
    href: '/dashboard/guide',
    icon: Sparkles,
  },
  {
    label: 'Statistics',
    href: '/dashboard/statistics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function LeftSidebar({ collapsed = false, onCollapsedChange }: LeftSidebarProps) {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <aside
      data-testid="left-sidebar"
      className={cn(
        'flex flex-col h-full border-r bg-white dark:bg-[#1a202c] transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo/Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {!collapsed && (
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            Bucket List
          </Link>
        )}
        {onCollapsedChange && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onCollapsedChange(!collapsed)}
            className={cn('h-8 w-8', collapsed && 'mx-auto')}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                'hover:bg-muted',
                active && 'bg-sidebar-accent text-sidebar-accent-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-3 border-t">
        <div
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg',
            collapsed && 'justify-center px-2'
          )}
        >
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-medium text-primary">
              {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {session?.user?.name || 'Test User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session?.user?.email || ''}
              </p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'default'}
          onClick={() => signOut()}
          className={cn('w-full mt-2', collapsed && 'px-2')}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Logout</span>}
        </Button>
      </div>
    </aside>
  )
}
