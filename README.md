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

## V3 1차 검토

- `/v3-design` — 1차 중립 prototype 검토 경로입니다. 11개 화면 블록과 placeholder 이미지 슬롯의 구조·동작을 확인합니다.
- 현재 문구와 이미지는 실제 서비스·사진·브랜드 확정 전의 중립 placeholder이며, 운영 정보로 해석하거나 게시용으로 사용하지 않습니다.
- 1차 기준은 구조와 상호작용을 고정합니다. 실제 문구, 사진, 브랜드 결정과 `/v3` 공개 경로는 2차 작업에서 분리해 반영합니다.

## V3 2차 프로토타입

- `/v3` — 승인된 새소망 문구·전용 자산·센터 소식·FAQ·상담 양식·오시는 길을 연결한 2차 검토 경로입니다.
- `/compare` — 기본 V1/V2 나란히 비교를 유지하며, `V3만` 선택으로 2차 프로토타입을 바로 확인할 수 있습니다.

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

`npm test`는 표준 Next.js build를 먼저 생성한 뒤 V1/V2와 V3 검토 경로의 실제 HTML·구조·접근성 계약을 검증합니다.

## Vercel Git 배포

Vercel에서 이 저장소를 Import하면 Next.js를 자동 감지합니다. 별도의 `vercel.json`이나 Output Directory 설정은 필요하지 않습니다.

- Root Directory: 저장소의 `site` 폴더를 선택한 경우 그 경로, 저장소 루트가 곧 `site`인 경우 기본값
- Build Command: 기본값 `next build`
- Output Directory: 설정하지 않음

배포 전에는 Vercel 프로젝트의 Root Directory가 `package.json`이 있는 폴더를 가리키는지만 확인하세요.

## Canonical URL 환경 변수

선택적으로 `NEXT_PUBLIC_SITE_URL`에 커스텀 canonical base URL(예: `https://example.com`)을 지정할 수 있습니다. 지정하지 않으면 Vercel에서는 `VERCEL_PROJECT_PRODUCTION_URL`을 사용하고, 로컬 기본값은 `http://localhost:3000`입니다.
