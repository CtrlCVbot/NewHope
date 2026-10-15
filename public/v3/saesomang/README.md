# 새소망 2차 전용 자산

- 생성일: 재현 가능한 script 출력(시간값 미기록)
- 현재 `/v3` 화면은 hero, Intro, Feature, 서비스 카드 3장의 사진 6개를 각각 한 번 렌더링합니다. 현재 활성 사진은 승인된 기존 자산과 가상 생성 장면이며, 실제 직원 또는 센터 사진이라고 주장하지 않습니다.
- 서비스 카드 `service-daily-living.webp` (NH24-I01), `service-bath-preparation.webp` (NH24-I03), `service-companionship.webp` (NH24-I02)는 사용자 요청으로 2026-10-15 built-in image_gen에서 만든 가상 예시 장면입니다. 각 결과는 원본 1536×1024 전체 비율을 1200×800으로 축소해 사용합니다. 예전 `card-1.webp`~`card-3.webp`는 호환용 보관 파일이며 현재 화면에서 요청하지 않습니다.
- `intro-family-consultation.webp` (NH24-I04)와 `feature-living-conversation.webp` (NH24-F01)는 사용자 요청으로 2026-10-15 built-in image_gen에서 만든 가상 장면입니다. F01의 원본·프롬프트·native 1536×1024 증거는 `docs/enhancement/2026-10-15/evidence/wu24/image-generation.json`에 있습니다.
- 프로젝트 고유 SVG 도해 9개는 자산 catalog와 이전 구성 재현을 위해 보관합니다. 현재 `/v3` 화면에서는 요청하거나 렌더링하지 않습니다.
- 블로그 원본 2개와 WU24 원본 2개, WU25 원본 3개는 `assets/v3/saesomang/source/`에 보관합니다. 블로그 원본은 보관용이며 현재 활성 사진에 사용하지 않습니다. 기존 승인 사진 3개의 확인일은 2026-10-13입니다.
- 사진 출력은 원본 crop보다 크게 만들지 않습니다. 서비스 카드 3장과 `mission`은 원본 전체 비율을 보존합니다.
- 원본 SHA-256, 권한 근거, crop, 실제 차원, 바이트는 `assets-manifest.json`에 있습니다.
- 자산 catalog 전송 예산 2.5MB에는 WebP 7개, 보관 SVG 9개, OG가 포함됩니다. 현재 화면 요청은 활성 WebP 6개와 필요한 브랜드 자산으로 한정됩니다. 제작 원본 PNG는 별도입니다.
