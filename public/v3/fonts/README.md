# WU-0 폰트 출처와 라이선스 기록

## WU-10 V3 경량 폰트

`NewHopeSansSubset.woff2`와 `NewHopeSerifSubset.woff2`는 현재 V3 소스의 문자와 ASCII `U+0020–U+007E`만 포함한 경량 폰트(subset)입니다. 원본 글자의 모양·폭을 유지하며, 두 파일 합계는 136,224B입니다. 포함되지 않은 문자는 등록된 원본 `Pretendard WU0`과 `MaruBuri WU0`로 표시하고, 2차 데이터 확정 때 경량 파일을 다시 생성합니다. 원본 파일과 라이선스는 변경하지 않습니다.

재생성은 FontTools 4.60.1과 Brotli 1.2.0을 별도 로컬 폴더에 설치하고 그 폴더를 `PYTHONPATH`로 지정한 뒤 `python scripts/build-v3-font-subsets.py --manifest <evidence-output-path>`로 실행합니다. 전역 pip나 프로젝트 의존성은 변경하지 않습니다. 스크립트는 원본의 OFL 고지·저작권, 글자 폭·윤곽, 독립된 변형 폰트 이름, 두 번 생성한 결과의 동일성을 검증합니다.

이 폴더에는 `/v3-design/fonts` 비교 화면이 실제로 로컬 로딩하는 폰트와 라이선스 고지만 둡니다. 사용자 결정에 따라 기본 세리프는 MaruBuri이며, 일반 `/v3-design` 프레임은 MaruBuri와 Pretendard만 로딩합니다.

## Noto Serif KR

- 파일: `NotoSerifKR-Variable.ttf` (가변 폰트, 200–900)
- 공식 배포 URL: `https://github.com/google/fonts/raw/main/ofl/notoserifkr/NotoSerifKR%5Bwght%5D.ttf`
- 고정 출처: Google Fonts `main`의 `ofl/notoserifkr`; 재현 가능한 버전 고정은 후속 배포 전에 commit URL로 보완합니다.
- SHA-256: `11F8D5DE6F1B79195EFBA3828AAA2EC95C1178F5AE976FB23C8D53250A9938F3`
- 라이선스: `LICENSE-NotoSerifKR-OFL.txt`, 원문 `https://github.com/google/fonts/blob/main/ofl/notoserifkr/OFL.txt` (SIL Open Font License 1.1)

## MaruBuri

- 파일: `MaruBuri-Regular.otf` (weight 400)
- 공식 배포 페이지: `https://hangeul.naver.com/font`
- 공식 내려받기 URL: `https://hangeul.naver.com/hangeul_static/webfont/zips/maruburi.zip`
- SHA-256: `79451E27328BA230B6B39AB41AC039390FCE3DE41BE2A3F745D5EB8B24F35B90`
- 라이선스: `LICENSE-MaruBuri-NAVER.txt`에 NAVER 공식 저작권 안내와 라이선스 전문을 보존했습니다. NAVER는 MaruBuri에 나눔글꼴과 같은 SIL Open Font License 1.1 저작권 규정을 적용한다고 안내합니다. `https://help.naver.com/service/30016/contents/18088?osType=PC`

## Nanum Myeongjo

- 파일: `NanumMyeongjo-Regular.ttf` (weight 400)
- 공식 배포 URL: `https://github.com/google/fonts/raw/main/ofl/nanummyeongjo/NanumMyeongjo-Regular.ttf`
- 고정 출처: Google Fonts `main`의 `ofl/nanummyeongjo`; 재현 가능한 버전 고정은 후속 배포 전에 commit URL로 보완합니다.
- SHA-256: `7ED9E8653A8ED04285D51DC343FFEA6EB3D9C73AFC27383EA8929EE4FFD03205`
- 라이선스: `LICENSE-NanumMyeongjo-OFL.txt`, 원문 `https://github.com/google/fonts/blob/main/ofl/nanummyeongjo/OFL.txt` (SIL Open Font License 1.1)

## Pretendard

- 파일: `PretendardVariable.woff2` (가변 폰트, 45–920)
- 출처: `orioncactus/pretendard` `v1.3.9`, `https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2`
- SHA-256: `9599F12FD42FC0BCE1CD50B47A0C022E108D7AA64DD0D1BB0ED44F3282D900B4`
- 라이선스: `LICENSE-Pretendard.txt`, 원문 `https://raw.githubusercontent.com/orioncactus/pretendard/v1.3.9/LICENSE` (SIL Open Font License 1.1)

## GSAP 설치 근거

- 설치 버전: `gsap@3.15.0`, `@gsap/react@2.1.2`, `lenis@1.3.26`.
- 설치된 GSAP 및 `@gsap/react` 패키지에는 독립된 `LICENSE` 또는 `LICENSE.md` 파일이 없습니다. 각 `package.json`은 `https://gsap.com/standard-license`를 가리키며, GSAP README도 같은 공식 URL을 링크합니다.
- 2026-10-12 공식 약관 확인: 일반 상업 웹사이트 사용을 허용하며, Webflow의 시각적 애니메이션 제작 기능과 경쟁하는 도구에는 별도 제한이 있습니다. 이번 센터 홈페이지는 일반 웹사이트 사용 범위입니다. 원문: https://gsap.com/community/standard-license/
