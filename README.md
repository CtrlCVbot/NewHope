# 새소망 방문요양센터

새소망 방문요양센터의 Next.js App Router 홈페이지입니다. V1·V2와 새소망 V3 시안을 로컬에서 비교할 수 있습니다.

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

## V3 2차 로컬 프로토타입

- `/v3` — 새소망 문구, 전용 자산, 센터 소식, FAQ, 카카오 오픈채팅 상담 안내, 오시는 길을 연결한 로컬 검토 경로입니다. 별도의 상담 양식을 전송하거나 저장하는 기능은 이 경로의 현재 동작에 포함하지 않습니다.
- `/compare` — 기본 V1/V2 나란히 비교를 유지하며, `V3만` 선택으로 2차 프로토타입을 바로 확인할 수 있습니다.
- 기존 `/`, `/v2`, `/v3-design`, `/compare` 경로는 각 검토 목적에 따라 유지합니다.

### V3 자산과 로컬 리소스

- `/v3`은 사진 5개와 프로젝트 고유 SVG 도해 9개를 사용합니다. 사진의 출처·권한 근거·SHA-256·crop·실제 차원은 `public/v3/saesomang/assets-manifest.json`에서 확인합니다.
- 브랜드는 사용자가 승인한 ‘집 안의 새싹’ 심볼과 MaruBuri 글자형 조합입니다. 헤더·메뉴·대형·푸터의 5변형과 심볼 3종을 `public/v3/saesomang/brand/`에 보관합니다.
- 새소망 전용 폰트는 `/v3/saesomang/fonts/`의 로컬 subset을 preload하고 `styles/v3/saesomang-fonts.css`에서 사용합니다. 외부 폰트 요청에 의존하지 않습니다.
- Next Image는 쿼리가 없는 로컬 경로와, 새소망 사진 WebP의 정확한 `?v=wu18-20261015` 쿼리를 허용합니다. 현재 새소망 사진은 캐시 구분을 위해 이 쿼리를 사용합니다. 같은 파일명으로 사진을 다시 교체할 때는 `next.config.ts`의 `images.localPatterns`와 콘텐츠 경로의 버전을 함께 갱신합니다.

자산 생성기는 다음 명령으로 재현할 수 있습니다. 이 명령은 `scripts/build-v3-saesomang-assets.mjs`의 현재 입력과 출력 계약을 사용합니다.

```bash
node scripts/build-v3-saesomang-assets.mjs --evidence ../docs/enhancement/2026-10-15/evidence/wu18/pipeline
node --test --test-concurrency=1 tests/v3-assets.test.mjs
```

사진 생성기 실행에는 위 명령의 입력 원본과 기존 의존성이 필요합니다. 브랜드 생성기는 `python scripts/build-v3-saesomang-brand.py`이며 Python의 FontTools·Brotli와 저장소의 원본 폰트를 사용합니다. 브랜드를 다시 생성한 뒤 사진 생성기를 실행하면 OG 공유 이미지와 manifest도 함께 갱신됩니다. 문구 변경 시에는 `scripts/build-v3-saesomang-fonts.py`의 입력을 확인하고 새소망 폰트 서브셋을 다시 생성·검증합니다.

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

### WU-16~22 통합 확인 기록

2026-10-15 로컬 프로덕션 빌드에서 전체 테스트 37개와 브라우저 검사 101개를 통과했습니다. 390/768/1024/1280/1440px 화면, 상담 링크, 이미지·폰트, 키보드 조작, 모션 감소 설정과 기존 `/v3-design` 화면 보존을 확인했습니다.

Lighthouse 13.5.0의 프로필별 3회 중앙값은 다음과 같습니다. LCP는 주요 콘텐츠가 표시되기까지의 시간이며, 로컬 모바일은 데스크톱 브라우저의 모바일 화면 모의측정입니다.

| 조건 | LCP | 성능 점수 | 접근성 점수 |
| --- | --- | --- | --- |
| 로컬 데스크톱 | 0.502초 | 100 | 100 |
| 로컬 모바일 | 0.452초 | 100 | 100 |
| 느린 모바일 모의측정 | 3.385초 | 90 | 100 |

모든 측정의 화면 배치 이동 지표(CLS)는 0입니다. 느린 모바일은 목표 2.5초를 초과하며, 기존에 허용된 원본 모션을 유지했습니다. 이전 기록 3.9035초보다 낮지만 측정 시점의 기기 부하가 달라 개선 원인을 단정하지 않습니다. 공개 서버나 실제 휴대전화에서 측정한 결과는 아닙니다.

실행용 의존성 검사는 취약점 0건입니다. 변경하지 않은 개발 도구 의존성에는 `high` 8건·`low` 1건의 기존 경고가 남아 별도 유지보수 대상으로 기록했습니다.

## Vercel Git 배포 참고

Vercel에서 이 저장소를 Import하면 Next.js를 자동 감지합니다. 별도의 `vercel.json`이나 Output Directory 설정은 필요하지 않습니다.

- Root Directory: 저장소의 `site` 폴더를 선택한 경우 그 경로, 저장소 루트가 곧 `site`인 경우 기본값
- Build Command: 기본값 `next build`
- Output Directory: 설정하지 않음

배포 전에는 Vercel 프로젝트의 Root Directory가 `package.json`이 있는 폴더를 가리키는지만 확인하세요. Git push는 저장소 이력을 원격에 반영하는 작업이고, 배포는 Vercel 등의 환경에서 빌드 결과를 공개하는 별도 작업입니다. 이 README의 설명은 배포 실행을 의미하지 않습니다.

## Canonical URL 환경 변수

선택적으로 `NEXT_PUBLIC_SITE_URL`에 커스텀 canonical base URL(예: `https://example.com`)을 지정할 수 있습니다. 지정하지 않으면 Vercel에서는 `VERCEL_PROJECT_PRODUCTION_URL`을 사용하고, 로컬 기본값은 `http://localhost:3000`입니다.
