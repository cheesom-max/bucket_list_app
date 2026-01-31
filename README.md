# 버킷리스트 앱

Gemini AI를 활용한 버킷리스트 관리 앱입니다.

## 주요 기능

- 🤖 **대화형 AI 가이드**: 자신이 무엇을 해야할지 모르는 사람들을 위한 단계별 가이드. 질문에 답변하면 맞춤형 버킷리스트 추천
- ✨ **AI 추천**: Gemini AI가 사용자의 관심사, 나이, 상황을 분석하여 맞춤형 버킷리스트 항목 추천
- 📋 **구체적인 계획**: 각 항목에 대한 단계별 액션 플랜 자동 생성 (단계, 타임라인, 필요 자원, 예상 장애물 및 해결책)
- 📊 **진행 상황 추적**: 목표 달성 과정을 시각적으로 추적
- 📸 **미디어 기록**: 사진과 영상으로 달성 과정 기록
- 🏷️ **태그 시스템**: 항목을 태그로 분류하여 관리
- 📈 **통계 대시보드**: 완료율, 카테고리별 분포 등 분석

## 기술 스택

- **프론트엔드**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui
- **백엔드**: Next.js API Routes, NextAuth.js
- **데이터베이스**: PostgreSQL, Prisma
- **AI**: Google Gemini API
- **상태 관리**: React Query, Zustand

## 시작하기

### 필수 요구사항

- Node.js 18+ 
- PostgreSQL 데이터베이스
- Google Gemini API 키

### 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 환경 변수 설정:
`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/bucket_list_db?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GEMINI_API_KEY="your-gemini-api-key-here"
```

3. 데이터베이스 마이그레이션:
```bash
npx prisma migrate dev
```

4. 개발 서버 실행:
```bash
npm run dev
```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000) 열기

## 프로젝트 구조

```
bucket_list_app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 인증 관련 페이지
│   ├── (dashboard)/       # 대시보드 페이지 (3-Panel 레이아웃)
│   ├── api/               # API Routes
│   └── layout.tsx
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트 (shadcn/ui)
│   ├── layout/           # 레이아웃 컴포넌트 (사이드바, 네비게이션)
│   ├── dashboard/        # 대시보드 전용 컴포넌트
│   ├── gemini/           # Gemini AI 채팅 및 추천 컴포넌트
│   ├── action-plan/      # 목표 상세/액션 플랜 컴포넌트
│   └── bucket-item/      # 버킷리스트 관련 컴포넌트
├── lib/                  # 유틸리티 및 설정
│   ├── gemini/           # Gemini API 클라이언트
│   ├── stores/           # Zustand 상태 관리
│   ├── db/               # 데이터베이스 설정
│   └── auth/             # 인증 설정
├── prisma/               # Prisma 스키마
└── types/                # TypeScript 타입 정의
```

## 주요 API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/[...nextauth]` - NextAuth 엔드포인트

### 버킷리스트 항목
- `GET /api/bucket-items` - 목록 조회
- `POST /api/bucket-items` - 새 항목 생성
- `GET /api/bucket-items/[id]` - 상세 조회
- `PATCH /api/bucket-items/[id]` - 수정
- `DELETE /api/bucket-items/[id]` - 삭제
- `POST /api/bucket-items/[id]/progress` - 진행 상황 기록
- `POST /api/bucket-items/[id]/media` - 미디어 업로드

### Gemini 통합
- `POST /api/gemini/suggestions` - 버킷리스트 추천
- `POST /api/gemini/plan` - 달성 계획 생성

## 데이터베이스 스키마

주요 테이블:
- `users` - 사용자 정보
- `bucket_items` - 버킷리스트 항목
- `bucket_plans` - Gemini가 생성한 달성 계획
- `bucket_progress` - 진행 상황 기록
- `bucket_media` - 첨부된 사진/영상
- `bucket_diary` - 일기/메모
- `tags` - 태그
- `bucket_item_tags` - 항목-태그 관계

## 개발 참고사항

### 미디어 업로드
현재는 기본적인 파일 업로드 구조만 구현되어 있습니다. 프로덕션 환경에서는 Cloudinary나 AWS S3와 같은 스토리지 서비스를 사용하도록 수정해야 합니다.

### 환경 변수
`.env.local` 파일은 Git에 커밋하지 마세요. `.env.example` 파일을 참고하여 필요한 환경 변수를 설정하세요.

## 라이선스

MIT
