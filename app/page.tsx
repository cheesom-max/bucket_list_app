import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold">버킷리스트를 달성하세요</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Gemini AI의 도움으로 버킷리스트를 설정하고, 구체적인 계획을 세우고,
              목표를 달성해보세요.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg">시작하기</Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline">
                로그인
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>AI 추천</CardTitle>
              <CardDescription>Gemini AI가 당신에게 맞는 버킷리스트를 추천합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                나이, 관심사, 현재 상황을 분석하여 맞춤형 버킷리스트 아이템을 제안합니다.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>구체적인 계획</CardTitle>
              <CardDescription>각 항목에 대한 단계별 액션 플랜을 생성합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                목표 달성을 위한 구체적인 단계, 타임라인, 필요한 자원을 정리해드립니다.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>진행 상황 추적</CardTitle>
              <CardDescription>목표 달성 과정을 시각적으로 추적합니다</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                진행률, 마일스톤, 사진과 일기를 통해 달성 과정을 기록하고 관리합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
