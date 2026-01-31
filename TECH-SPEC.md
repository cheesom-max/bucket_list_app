# TECH-SPEC.md - Bucket List App UI Redesign

## Overview

이 문서는 버킷리스트 앱의 UI 리디자인을 위한 기술 명세서입니다. 3개의 새로운 HTML 디자인(Main Dashboard, Gemini Chat, Action Plan)을 기반으로 기존 Next.js 16 앱의 컴포넌트 구조를 재설계합니다. 기존 API 및 데이터 모델을 유지하면서 shadcn/ui + Tailwind CSS 4 기반의 모던한 UI로 전환합니다.

---

## 1. Project Scope

**핵심 목표**: 기존 버킷리스트 앱의 UI를 3-Panel 레이아웃 기반의 모던한 디자인으로 리디자인하여 사용자 경험을 개선한다.

**MVP 범위**:
- 좌측 사이드바 네비게이션 구현
- Main Dashboard 리디자인 (AI Hero + Goals Grid + Right Sidebar)
- Gemini Chat 인터페이스 리디자인 (Chat + Discovery Panel)
- Action Plan 상세 페이지 리디자인 (Timeline + Media Journal)

**MVP 제외 (Phase 2)**:
- Statistics 페이지 (통계 대시보드)
- Settings 페이지 (설정)
- 이미지/마이크 입력 (Gemini Chat)
- Collaborators 기능 (공유/협업)
- 다크모드 토글 UI

---

## 2. Tech Stack Decision

| Layer | Technology | 선정 이유 |
|-------|------------|----------|
| Frontend | Next.js 16 + React 19 | 기존 스택 유지, App Router 활용 |
| Styling | Tailwind CSS 4 | 기존 스택 유지, 유틸리티 기반 빠른 개발 |
| UI Components | shadcn/ui | 기존 사용 중, Radix 기반 접근성 보장 |
| Icons | Lucide React | 기존 사용 중, 일관된 아이콘 시스템 |
| State | Zustand + React Query | 기존 스택 유지, 클라이언트/서버 상태 분리 |
| Animation | tw-animate-css | 기존 설치됨, 간단한 애니메이션 처리 |

---

## 3. Architecture Diagram

```
+------------------------------------------------------------------+
|                        Root Layout                                |
|  +------------------------------------------------------------+  |
|  |                    Providers (Auth, Query)                  |  |
|  +------------------------------------------------------------+  |
+------------------------------------------------------------------+
                              |
        +---------------------+---------------------+
        |                                           |
+-------v-------+                         +---------v---------+
|  (auth) Group |                         | (dashboard) Group |
|   - signin    |                         |                   |
|   - signup    |                         +-------------------+
+---------------+                                   |
                                    +---------------+---------------+
                                    |                               |
                            +-------v-------+               +-------v-------+
                            | DashboardLayout|               |  Other Pages  |
                            | (3-Panel Base) |               |               |
                            +---------------+               +---------------+
                                    |
            +-----------------------+-----------------------+
            |                       |                       |
    +-------v-------+       +-------v-------+       +-------v-------+
    |   LeftSidebar |       |  MainContent  |       | RightSidebar  |
    |  (Navigation) |       |   (Dynamic)   |       |  (Contextual) |
    +---------------+       +---------------+       +---------------+
```

### Page-Component Mapping

```
/dashboard
  +-- LeftSidebar (fixed)
  +-- MainContent: DashboardMain
  |     +-- HeaderSection (Greeting + New Goal)
  |     +-- AIHeroSection (Gemini Recommendation)
  |     +-- ActiveGoalsGrid (Goal Cards)
  +-- RightSidebar: DashboardRightSidebar
        +-- UpcomingMilestones
        +-- RecentActivity
        +-- QuoteCard

/dashboard/guide (AI Chat)
  +-- LeftSidebar (fixed)
  +-- MainContent: GeminiChatMain
  |     +-- ChatHeader
  |     +-- ChatMessageList
  |     +-- ChatInput
  +-- RightSidebar: DiscoveryPanel
        +-- SuggestedExperiences
        +-- QuickActions

/dashboard/bucket-items/[id] (Action Plan)
  +-- TopNavBar (replaces sidebar on this page)
  +-- Breadcrumbs
  +-- GoalHeader (Title, Target Date, Progress)
  +-- ActionTimeline (Steps)
  +-- RightSidebar: ActionRightSidebar
  |     +-- GeminiTipCard
  |     +-- ResourcesCard
  |     +-- CollaboratorsCard (Phase 2)
  +-- MediaJournalGallery
```

---

## 4. Project Structure Tree

```
bucket_list_app/
├── app/
│   ├── (auth)/
│   │   └── auth/
│   │       ├── signin/page.tsx          # 기존 유지
│   │       └── signup/page.tsx          # 기존 유지
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── layout.tsx               # [수정] 3-Panel 레이아웃
│   │       ├── page.tsx                 # [수정] Main Dashboard
│   │       ├── guide/
│   │       │   └── page.tsx             # [수정] Gemini Chat
│   │       └── bucket-items/
│   │           ├── new/page.tsx         # 기존 유지 (모달로 전환 고려)
│   │           └── [id]/
│   │               └── page.tsx         # [수정] Action Plan Detail
│   ├── api/                             # 기존 API 모두 유지
│   ├── globals.css                      # [수정] 새 디자인 변수 추가
│   ├── layout.tsx                       # 기존 유지
│   ├── page.tsx                         # 기존 유지 (랜딩)
│   └── providers.tsx                    # 기존 유지
├── components/
│   ├── layout/                          # [신규] 레이아웃 컴포넌트
│   │   ├── left-sidebar.tsx             # 좌측 네비게이션 사이드바
│   │   ├── right-sidebar.tsx            # 우측 컨텍스트 사이드바 (래퍼)
│   │   ├── top-nav-bar.tsx              # 상단 네비게이션 (상세 페이지용)
│   │   ├── breadcrumbs.tsx              # 브레드크럼 네비게이션
│   │   └── header.tsx                   # [삭제 또는 수정] 기존 헤더
│   ├── dashboard/                       # [신규] 대시보드 전용 컴포넌트
│   │   ├── header-section.tsx           # 인사말 + New Goal 버튼
│   │   ├── ai-hero-section.tsx          # Gemini 추천 히어로 카드
│   │   ├── active-goals-grid.tsx        # 진행 중 목표 그리드
│   │   ├── goal-card.tsx                # 개별 목표 카드 (진행률 포함)
│   │   ├── upcoming-milestones.tsx      # 다가오는 마일스톤 위젯
│   │   ├── recent-activity.tsx          # 최근 활동 위젯
│   │   └── quote-card.tsx               # 명언/동기부여 카드
│   ├── gemini/                          # [수정] Gemini 관련 컴포넌트
│   │   ├── chat-interface.tsx           # [신규] 채팅 메인 인터페이스
│   │   ├── chat-message.tsx             # [신규] 개별 메시지 컴포넌트
│   │   ├── chat-input.tsx               # [신규] 입력창 (제안 버튼 포함)
│   │   ├── discovery-panel.tsx          # [신규] 우측 발견 패널
│   │   ├── experience-card.tsx          # [신규] 추천 경험 카드
│   │   ├── suggestions-dialog.tsx       # 기존 유지 (리팩토링)
│   │   └── interactive-guide.tsx        # [삭제] chat-interface로 대체
│   ├── action-plan/                     # [신규] 액션 플랜 컴포넌트
│   │   ├── goal-header.tsx              # 목표 헤더 (제목, 날짜, 진행률)
│   │   ├── action-timeline.tsx          # 타임라인 기반 단계 표시
│   │   ├── timeline-step.tsx            # 개별 타임라인 단계
│   │   ├── gemini-tip-card.tsx          # Gemini 팁 카드
│   │   ├── resources-card.tsx           # 리소스 카드
│   │   └── media-journal.tsx            # 미디어 저널 갤러리
│   ├── bucket-item/                     # 기존 유지 및 수정
│   │   ├── bucket-item-form.tsx         # 기존 유지
│   │   ├── media-upload.tsx             # 기존 유지
│   │   └── quick-plan-dialog.tsx        # 기존 유지
│   └── ui/                              # 기존 shadcn/ui 컴포넌트
│       ├── avatar.tsx                   # [신규] 사용자/AI 아바타
│       ├── scroll-area.tsx              # [신규] 스크롤 영역
│       ├── separator.tsx                # [신규] 구분선
│       ├── tooltip.tsx                  # [신규] 툴팁
│       ├── skeleton.tsx                 # [신규] 로딩 스켈레톤
│       └── ... (기존 컴포넌트 유지)
├── lib/
│   ├── stores/                          # [신규] Zustand 스토어
│   │   ├── sidebar-store.ts             # 사이드바 상태 (접힘/펼침)
│   │   └── chat-store.ts                # 채팅 메시지 상태
│   └── ... (기존 유지)
├── types/
│   ├── chat.ts                          # [신규] 채팅 관련 타입
│   └── index.ts                         # [신규] 공통 타입 export
└── ... (설정 파일들 유지)
```

### 폴더/파일 역할 설명

| 경로 | 역할 |
|-----|------|
| `components/layout/` | 앱 전체 레이아웃 구성 컴포넌트 (사이드바, 네비게이션) |
| `components/dashboard/` | 메인 대시보드 페이지 전용 UI 컴포넌트 |
| `components/gemini/` | Gemini AI 채팅 및 추천 관련 컴포넌트 |
| `components/action-plan/` | 목표 상세/액션 플랜 페이지 전용 컴포넌트 |
| `lib/stores/` | 클라이언트 상태 관리 (Zustand) |
| `types/` | TypeScript 타입 정의 |

---

## 5. File Specifications

### 5.1 Layout Components

#### `components/layout/left-sidebar.tsx`
- **역할**: 앱 전체 좌측 네비게이션 사이드바
- **책임**:
  - 네비게이션 메뉴 렌더링 (Dashboard, My List, AI Guide, Statistics, Settings)
  - 현재 활성 경로 하이라이트
  - 접힘/펼침 상태 관리
- **Props**: `collapsed?: boolean`, `onCollapsedChange?: (collapsed: boolean) => void`
- **주요 요소**:
  - Logo/Brand 섹션
  - Navigation Items (아이콘 + 텍스트)
  - User Profile 섹션 (하단)
- **의존성**: `lucide-react`, `next/navigation`, `sidebar-store`

#### `components/layout/right-sidebar.tsx`
- **역할**: 우측 컨텍스트 사이드바 래퍼
- **책임**:
  - children을 받아 일관된 스타일로 렌더링
  - 반응형 처리 (모바일에서 숨김 또는 드로어)
- **Props**: `children: React.ReactNode`, `className?: string`

#### `components/layout/top-nav-bar.tsx`
- **역할**: 상세 페이지용 상단 네비게이션 바
- **책임**:
  - 뒤로가기 버튼
  - 페이지 제목
  - 액션 버튼들 (수정, 삭제 등)
- **Props**: `title: string`, `backHref: string`, `actions?: React.ReactNode`

#### `components/layout/breadcrumbs.tsx`
- **역할**: 브레드크럼 네비게이션
- **책임**: 현재 위치 경로 표시
- **Props**: `items: Array<{ label: string, href?: string }>`

---

### 5.2 Dashboard Components

#### `components/dashboard/header-section.tsx`
- **역할**: 대시보드 상단 인사말 및 액션 영역
- **책임**:
  - 시간대별 인사말 표시 (아침/오후/저녁)
  - 사용자 이름 표시
  - "New Goal" 버튼 (모달 트리거)
- **Props**: `userName: string`
- **의존성**: `useSession`

#### `components/dashboard/ai-hero-section.tsx`
- **역할**: Gemini AI 추천 히어로 섹션
- **책임**:
  - AI 추천 카드 표시
  - "Explore with AI" CTA 버튼
  - 추천 내용 또는 프롬프트 표시
- **Props**: `suggestion?: { title: string, description: string }`, `onExplore: () => void`
- **스타일**: 그라데이션 배경, 아이콘 장식

#### `components/dashboard/active-goals-grid.tsx`
- **역할**: 진행 중인 목표 그리드 컨테이너
- **책임**:
  - GoalCard 컴포넌트 리스트 렌더링
  - 빈 상태 처리
  - 반응형 그리드 레이아웃 (2-3 컬럼)
- **Props**: `goals: BucketItem[]`, `isLoading: boolean`

#### `components/dashboard/goal-card.tsx`
- **역할**: 개별 목표 카드
- **책임**:
  - 목표 제목, 카테고리 표시
  - 진행률 바 표시
  - 타겟 날짜 표시
  - 클릭 시 상세 페이지 이동
- **Props**: `goal: BucketItem`, `progress: number`
- **스타일**: 호버 효과, 카테고리별 색상 악센트

#### `components/dashboard/upcoming-milestones.tsx`
- **역할**: 다가오는 마일스톤 위젯
- **책임**:
  - 가까운 타겟 날짜의 목표 표시
  - 날짜별 정렬
- **Props**: `milestones: Array<{ id: string, title: string, targetDate: Date }>`

#### `components/dashboard/recent-activity.tsx`
- **역할**: 최근 활동 피드
- **책임**:
  - 최근 진행 상황 업데이트 표시
  - 시간순 정렬
- **Props**: `activities: Array<{ type: string, message: string, createdAt: Date }>`

#### `components/dashboard/quote-card.tsx`
- **역할**: 동기부여 명언 카드
- **책임**: 랜덤 또는 Gemini 생성 명언 표시
- **Props**: `quote: string`, `author?: string`

---

### 5.3 Gemini Chat Components

#### `components/gemini/chat-interface.tsx`
- **역할**: Gemini 채팅 메인 인터페이스
- **책임**:
  - ChatMessageList, ChatInput 조합
  - 스크롤 관리 (새 메시지 시 자동 스크롤)
  - 로딩 상태 표시
- **Props**: 없음 (내부 상태 관리)
- **의존성**: `chat-store`, `useQuery`, `useMutation`

#### `components/gemini/chat-message.tsx`
- **역할**: 개별 채팅 메시지
- **책임**:
  - 사용자/AI 메시지 구분 렌더링
  - 아바타 표시
  - 메시지 타임스탬프
- **Props**: `message: ChatMessage`, `isUser: boolean`
- **스타일**: 사용자(우측), AI(좌측) 정렬

#### `components/gemini/chat-input.tsx`
- **역할**: 채팅 입력창
- **책임**:
  - 텍스트 입력
  - 제안 버튼들 표시 (예: "여행 추천", "취미 추천")
  - 전송 버튼
- **Props**: `onSend: (message: string) => void`, `suggestions?: string[]`, `isLoading: boolean`
- **스타일**: 하단 고정, 제안 버튼 가로 스크롤

#### `components/gemini/discovery-panel.tsx`
- **역할**: 우측 발견/추천 패널
- **책임**:
  - 추천 경험 카드 리스트
  - 카테고리 필터 (선택적)
- **Props**: `experiences: Experience[]`, `onSelect: (experience: Experience) => void`

#### `components/gemini/experience-card.tsx`
- **역할**: 추천 경험 카드
- **책임**:
  - 이미지/아이콘 표시
  - 제목, 설명 표시
  - "Add to List" 버튼
- **Props**: `experience: Experience`, `onAdd: () => void`

---

### 5.4 Action Plan Components

#### `components/action-plan/goal-header.tsx`
- **역할**: 목표 상세 페이지 헤더
- **책임**:
  - 목표 제목 (대형 타이포그래피)
  - 타겟 날짜 표시
  - 전체 진행률 바 (큰 사이즈)
  - 상태 배지
- **Props**: `goal: BucketItem`, `progress: number`

#### `components/action-plan/action-timeline.tsx`
- **역할**: 타임라인 기반 액션 플랜
- **책임**:
  - TimelineStep 컴포넌트 리스트
  - 완료/진행중/예정 상태별 스타일링
  - 타임라인 연결선 표시
- **Props**: `steps: PlanStep[]`, `onStepComplete: (stepId: string) => void`

#### `components/action-plan/timeline-step.tsx`
- **역할**: 개별 타임라인 단계
- **책임**:
  - 체크박스 (완료 토글)
  - 단계 제목, 설명
  - 예상 기간 표시
  - 완료/진행중/예정 상태 표시
- **Props**: `step: PlanStep`, `status: 'completed' | 'in_progress' | 'pending'`, `onComplete: () => void`
- **스타일**: 완료(녹색 체크), 진행중(파란색 점), 예정(회색)

#### `components/action-plan/gemini-tip-card.tsx`
- **역할**: Gemini AI 팁 카드
- **책임**:
  - AI 생성 팁/조언 표시
  - "Get New Tip" 버튼
- **Props**: `tip: string`, `onRefresh: () => void`

#### `components/action-plan/resources-card.tsx`
- **역할**: 리소스/자료 카드
- **책임**:
  - 필요 자원 리스트 (비용, 시간, 재료 등)
  - 외부 링크 (선택적)
- **Props**: `resources: Resource[]`

#### `components/action-plan/media-journal.tsx`
- **역할**: 미디어 저널 갤러리
- **책임**:
  - 업로드된 이미지/비디오 그리드 표시
  - 업로드 버튼
  - 라이트박스 뷰
- **Props**: `media: BucketMedia[]`, `onUpload: (file: File) => void`

---

### 5.5 Store Definitions

#### `lib/stores/sidebar-store.ts`
- **역할**: 사이드바 UI 상태 관리
- **상태**:
  - `isCollapsed: boolean` - 접힘 상태
  - `isMobileOpen: boolean` - 모바일 드로어 상태
- **액션**:
  - `toggle()` - 접힘 토글
  - `setMobileOpen(open: boolean)` - 모바일 드로어 제어

#### `lib/stores/chat-store.ts`
- **역할**: 채팅 메시지 상태 관리
- **상태**:
  - `messages: ChatMessage[]` - 메시지 리스트
  - `isTyping: boolean` - AI 타이핑 상태
- **액션**:
  - `addMessage(message: ChatMessage)` - 메시지 추가
  - `clearMessages()` - 대화 초기화
  - `setTyping(isTyping: boolean)` - 타이핑 상태 설정

---

### 5.6 Type Definitions

#### `types/chat.ts`
```typescript
interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
  suggestions?: string[]  // AI 응답 시 제안 항목
}

interface Experience {
  id: string
  title: string
  description: string
  category: string
  imageUrl?: string
  difficulty?: 'easy' | 'medium' | 'hard'
}
```

#### `types/index.ts`
```typescript
interface PlanStep {
  id: string
  title: string
  description?: string
  order: number
  estimatedDuration?: string
  isCompleted: boolean
}

interface Resource {
  type: 'cost' | 'time' | 'material' | 'link'
  label: string
  value: string
  url?: string
}
```

---

## 6. Data Flow

### 6.1 Dashboard Page Data Flow

```
[Page Load]
    |
    v
[useSession] --> 인증 확인
    |
    v
[useQuery: bucket-items] --> GET /api/bucket-items
    |
    v
[Transform Data]
    |-- Active Goals --> ActiveGoalsGrid
    |-- Upcoming --> UpcomingMilestones
    |-- Recent Progress --> RecentActivity
    v
[Render Dashboard Layout]
```

### 6.2 Gemini Chat Data Flow

```
[User Input]
    |
    v
[ChatInput] --> onSend(message)
    |
    v
[chat-store] --> addMessage(userMessage)
    |
    v
[useMutation] --> POST /api/gemini/guide
    |
    v
[Response] --> AI Message + Suggestions
    |
    v
[chat-store] --> addMessage(aiMessage)
    |
    v
[DiscoveryPanel] --> 추천 경험 업데이트
```

### 6.3 Action Plan Data Flow

```
[Page Load with ID]
    |
    v
[useQuery: bucket-item/:id] --> GET /api/bucket-items/:id
    |
    v
[item.plans] --> ActionTimeline
[item.progress] --> GoalHeader (진행률)
[item.media] --> MediaJournal
    |
    v
[Step Complete Action]
    |
    v
[useMutation] --> POST /api/bucket-items/:id/progress
    |
    v
[Invalidate Query] --> 데이터 리프레시
```

---

## 7. API Contracts

### 기존 API 유지 (변경 없음)

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/api/bucket-items` | GET | 버킷 아이템 목록 조회 |
| `/api/bucket-items` | POST | 새 버킷 아이템 생성 |
| `/api/bucket-items/[id]` | GET | 단일 아이템 상세 조회 |
| `/api/bucket-items/[id]` | PATCH | 아이템 수정 |
| `/api/bucket-items/[id]` | DELETE | 아이템 삭제 |
| `/api/bucket-items/[id]/progress` | POST | 진행 상황 기록 |
| `/api/bucket-items/[id]/media` | POST | 미디어 업로드 |
| `/api/gemini/suggestions` | POST | AI 버킷리스트 추천 |
| `/api/gemini/plan` | POST | AI 달성 계획 생성 |
| `/api/gemini/guide` | POST | AI 가이드 대화 |

### 신규 API (선택적)

| Endpoint | Method | 설명 |
|----------|--------|------|
| `/api/activities` | GET | 최근 활동 피드 조회 (Phase 2) |
| `/api/quotes` | GET | 동기부여 명언 조회 (Phase 2) |

---

## 8. Dependencies

### 신규 shadcn/ui 컴포넌트 설치 필요

```bash
npx shadcn@latest add avatar
npx shadcn@latest add scroll-area
npx shadcn@latest add separator
npx shadcn@latest add tooltip
npx shadcn@latest add skeleton
```

### 기존 의존성 (변경 없음)

- `@radix-ui/react-*` - shadcn/ui 기반
- `lucide-react` - 아이콘
- `zustand` - 상태 관리
- `@tanstack/react-query` - 서버 상태
- `tailwind-merge`, `clsx`, `class-variance-authority` - 스타일 유틸리티

---

## 9. MVP Scope Boundary

### 포함 (MVP)

| 기능 | 상세 |
|------|------|
| 3-Panel 레이아웃 | 좌측 사이드바 + 메인 + 우측 사이드바 |
| Main Dashboard | 인사말, AI 히어로, 목표 그리드, 마일스톤, 활동 피드 |
| Gemini Chat | 채팅 UI, 메시지 표시, 기본 입력, 추천 패널 |
| Action Plan | 타임라인 뷰, 단계 체크, 진행률, 미디어 갤러리 |
| 반응형 레이아웃 | 데스크톱/태블릿 지원 |

### 제외 (Phase 2+)

| 기능 | 이유 |
|------|------|
| Statistics 페이지 | MVP 범위 초과, 추가 API 필요 |
| Settings 페이지 | MVP 범위 초과 |
| 이미지/마이크 입력 | 복잡도 높음, Gemini API 추가 설정 필요 |
| Collaborators | 공유 기능은 MVP 이후 |
| 다크모드 토글 | CSS 변수는 준비됨, 토글 UI만 Phase 2 |
| 모바일 완전 최적화 | 기본 반응형만 MVP, 모바일 전용 UX는 Phase 2 |

---

## 10. Migration Strategy

### Step 1: 레이아웃 컴포넌트 구축
1. `left-sidebar.tsx` 생성
2. `right-sidebar.tsx` 생성
3. `dashboard/layout.tsx` 수정 (3-Panel 구조)

### Step 2: Dashboard 리디자인
1. Dashboard 전용 컴포넌트 생성 (`components/dashboard/`)
2. `dashboard/page.tsx` 수정

### Step 3: Gemini Chat 리디자인
1. Chat 관련 컴포넌트 생성 (`components/gemini/`)
2. `chat-store.ts` 생성
3. `guide/page.tsx` 수정

### Step 4: Action Plan 리디자인
1. Action Plan 컴포넌트 생성 (`components/action-plan/`)
2. `bucket-items/[id]/page.tsx` 수정

### Step 5: 정리 및 테스트
1. 기존 `interactive-guide.tsx` 삭제
2. 기존 `header.tsx` 수정 또는 삭제
3. 전체 플로우 테스트

---

## 11. Design Tokens Reference

### 색상 (globals.css에 이미 정의됨)

| Token | 용도 |
|-------|------|
| `--primary` | 주요 액션 버튼 |
| `--secondary` | 보조 요소 |
| `--muted` | 비활성/배경 |
| `--accent` | 강조 |
| `--destructive` | 삭제/경고 |
| `--sidebar` | 사이드바 배경 |
| `--chart-1~5` | 진행률/그래프 색상 |

### Tailwind 커스텀 클래스 권장

```css
/* 추가 권장 (globals.css) */
.gradient-hero {
  @apply bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400;
}

.card-hover {
  @apply transition-all hover:shadow-lg hover:-translate-y-0.5;
}

.sidebar-item {
  @apply flex items-center gap-3 px-3 py-2 rounded-lg transition-colors;
}

.sidebar-item-active {
  @apply bg-sidebar-accent text-sidebar-accent-foreground;
}
```

---

## 12. Quality Checklist

- [x] 실제 구현 코드 미포함
- [x] 모든 파일/폴더 역할 정의됨
- [x] MVP 범위 명확히 한정됨
- [x] 기술 스택 선정 근거 제시됨
- [x] 기존 API/데이터 모델 활용 명시됨
- [x] 개발자가 즉시 구현 시작 가능한 수준의 명세 제공됨

---

*Generated by Architect Agent*
*Last Updated: 2026-02-01*
