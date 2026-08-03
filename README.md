# 새소망 방문요양센터

새소망 방문요양센터의 Next.js App Router 홈페이지입니다. 현재 홈페이지와 Calm Navigator V2 시안을 로컬에서 비교할 수 있습니다.

## 필요 환경

- Node.js `>=22.13.0`

## 로컬 실행

```bash
npm install
npm run dev
```

개발 서버를 연 뒤 다음 경로를 확인합니다.

- `/` — 현재 V1 홈페이지
- `/v2` — Calm Navigator V2 시안
- `/compare` — V1/V2, Desktop/Mobile 비교 화면

프로덕션 빌드와 로컬 실행은 다음과 같습니다.

```bash
npm run build
npm run start
```

## 검증

```bash
npm test
npm run lint
```

`npm test`는 표준 Next.js build를 먼저 생성한 뒤 `.next`의 정적 HTML로 세 경로와 접근성 계약을 검증합니다.

## Vercel Git 배포

Vercel에서 이 저장소를 Import하면 Next.js를 자동 감지합니다. 별도의 `vercel.json`이나 Output Directory 설정은 필요하지 않습니다.

- Root Directory: 저장소의 `site` 폴더를 선택한 경우 그 경로, 저장소 루트가 곧 `site`인 경우 기본값
- Build Command: 기본값 `next build`
- Output Directory: 설정하지 않음

배포 전에는 Vercel 프로젝트의 Root Directory가 `package.json`이 있는 폴더를 가리키는지만 확인하세요.

## Canonical URL 환경 변수

선택적으로 `NEXT_PUBLIC_SITE_URL`에 커스텀 canonical base URL(예: `https://example.com`)을 지정할 수 있습니다. 지정하지 않으면 Vercel에서는 `VERCEL_PROJECT_PRODUCTION_URL`을 사용하고, 로컬 기본값은 `http://localhost:3000`입니다.
