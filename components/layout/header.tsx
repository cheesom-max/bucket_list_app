'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold">
          버킷리스트
        </Link>
        <nav className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">대시보드</Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                {session.user?.name || session.user?.email}
              </span>
              <Button variant="outline" onClick={() => signOut()}>
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>회원가입</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

