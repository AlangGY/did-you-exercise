# 운동해씀? (Did You Exercise?) - 프로젝트 스펙 문서

## 1. 프로젝트 개요

운동 인증 기반의 그룹 챌린지 앱. 사용자들이 운동 세션(그룹)을 만들고 참여하여, 사진 인증으로 주간 운동 목표를 달성하는 서비스.

**핵심 기능:** 그룹 생성/참여 → 운동 인증(사진) → 주간 목표 달성률 추적 → 미달성 시 벌금 계산

## 2. 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router, Turbopack) |
| 언어 | TypeScript 5, React 19 |
| 스타일링 | Tailwind CSS 4 |
| 상태관리 | TanStack React Query 5 |
| 폼/검증 | React Hook Form + Zod |
| 백엔드/DB | Supabase (PostgreSQL) |
| 인증 | Supabase Auth + Kakao OAuth |
| 이미지 저장 | Supabase Storage |
| UI 컴포넌트 | Radix UI, shadcn/ui |
| 소셜 공유 | Kakao Talk API |
| 테스트 | Vitest + jsdom |
| 배포 | Vercel |

## 3. 디렉토리 구조

```
src/
├── app/                           # Next.js App Router
│   ├── auth/                      # 인증 라우트
│   │   ├── login/page.tsx         # 카카오 로그인
│   │   └── signup/page.tsx        # 회원가입 (비활성)
│   └── (main)/                    # 인증 필요 라우트
│       ├── page.tsx               # 홈 (신규/참여 세션)
│       ├── profile/page.tsx       # 프로필/로그아웃
│       └── session/
│           ├── page.tsx           # 세션 목록
│           ├── [slug]/page.tsx    # 세션 상세
│           ├── [slug]/join/       # 세션 참여
│           └── [slug]/participants/ # 주간 참여자 현황
├── components/
│   ├── ui/                        # 기본 UI (button, card, dialog 등)
│   ├── layout/                    # 레이아웃 (MainLayout, AuthGuard, TabBar)
│   ├── widget/                    # 기능 컴포넌트 (ExerciseAuthModal, SessionCard 등)
│   └── screen/                    # 페이지별 스크린 컴포넌트
├── hooks/                         # 커스텀 훅
│   ├── useAuth.ts                 # 인증 상태
│   ├── useExerciseAuth.ts         # 운동 인증 제출
│   ├── useSupabaseClient.ts       # Supabase 클라이언트
│   └── session-detail/            # 세션 상세 관련 훅 모음
├── lib/                           # 유틸리티 (supabase-client, utils)
└── constants/                     # 상수 정의
```

## 4. 데이터베이스 스키마

### session
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | PK | 세션 식별자 |
| title | text | 세션 이름 |
| from | date | 시작일 |
| to | date | 종료일 |

### session_participant
| 컬럼 | 타입 | 설명 |
|------|------|------|
| session_id | FK → session | 세션 |
| user_id | FK → auth.users | 사용자 |
| user_name | text | 표시 이름 |
| times_per_week | integer | 주간 목표 횟수 |
| exercises | text[] | 운동 종류 목록 |
| penalty | integer | 미달성 벌금 (원) |
| notes | text | 메모 (선택) |

### exercise_auth
| 컬럼 | 타입 | 설명 |
|------|------|------|
| session_id | FK → session | 세션 |
| user_id | FK → auth.users | 사용자 |
| done_at | date | 운동 수행일 |
| image | text | 인증 이미지 URL (콤마 구분) |
| exercises | text[] | 수행한 운동 종류 |
| memo | text | 메모 (선택) |

### Storage: `exercise-auth-image` 버킷
- 경로: `user-{user_id}/{timestamp}-{index}`

## 5. 페이지 & 라우팅

| 경로 | 설명 | 인증 |
|------|------|------|
| `/auth/login` | 카카오 로그인 | 불필요 |
| `/` | 홈 - 신규 세션 + 참여 세션 목록 | 필요 |
| `/session` | 신규 세션 전체 목록 | 필요 |
| `/session/[slug]` | 세션 상세 (내 목표, 인증 캘린더, 참여자) | 필요 |
| `/session/[slug]/join` | 세션 참여 폼 | 필요 |
| `/session/[slug]/participants` | 주간 참여자 상세 현황 | 필요 |
| `/profile` | 프로필, 로그아웃 | 필요 |

## 6. 주요 기능 상세

### 6.1 인증 (Authentication)
- **Kakao OAuth 2.0** → Supabase Auth
- 요청 스코프: `profile_nickname`, `account_email`, `openid`
- `ClientAuthGuard` 컴포넌트로 보호 라우트 처리
- `useAuth()` 훅으로 인증 상태 구독

### 6.2 세션 관리
- 세션 목록 조회 (신규/참여 구분)
- 세션 참여 시 주간 목표 횟수, 운동 종류, 벌금 설정
- 세션 기간은 월~일 단위 주차로 분할

### 6.3 운동 인증
- 2단계 모달 플로우: 폼 입력 → 성공 확인
- 복수 사진 업로드 지원 (Supabase Storage)
- 운동 종류 선택 + 메모 입력
- **새벽 4시 이전 인증은 전날로 처리**

### 6.4 진행 현황 추적
- 캘린더 UI로 인증 날짜 표시
- 주간 목표 대비 달성률 프로그레스 바
- 참여자별 주간 요일 테이블 (성공/실패 표시)
- 미달성 시 벌금 자동 계산 (벌금 × 미달성 횟수)
- 주차 선택으로 과거 이력 조회

### 6.5 소셜 공유
- 카카오톡으로 운동 인증 공유
- 세션 결과 (주간 참여자 현황) 공유

## 7. 환경 변수

### Public (클라이언트)
| 변수명 | 설명 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 |
| `NEXT_PUBLIC_JAVASCRIPT_KEY` | 카카오 JavaScript SDK 키 |
| `NEXT_PUBLIC_BASE_URL` | 앱 기본 URL |

### Server
| 변수명 | 설명 |
|--------|------|
| `RESTAPI_KEY` | 카카오 REST API 키 |
| `CLIENT_SECRET` | 카카오 OAuth 클라이언트 시크릿 |
| `BASE_URL` | 서버 측 기본 URL |

## 8. 배포

- **플랫폼:** Vercel
- **프로덕션 URL:** `https://did-you-exercise.vercel.app`
- **이미지 CDN:** `figkvtvtxvzuyqokfxzz.supabase.co` (Next.js remotePatterns 설정)

## 9. 설계 특이사항

- **모바일 퍼스트:** max-width `md` 기준 레이아웃
- **React Query:** stale-while-revalidate 패턴으로 UX 최적화
- **Radix UI:** 접근성(a11y) 보장
- **overlay-kit:** 모달/오버레이 관리
- **date-fns:** 주차 계산 및 날짜 포맷팅
