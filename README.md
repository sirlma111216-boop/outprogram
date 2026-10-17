# 학교 밖 공공시설·프로그램 찾기 만들기 — 연수 강의안

교사가 이 페이지를 보며 한 단계씩 따라 하면, 자기 AI Studio·GitHub·Cloudflare 계정에서 ‘학교 밖 활동공간 탐색기’ 앱을 만들어 공개할 수 있도록 안내하는 **정적 강의안 사이트**입니다.

- 이 저장소: `school-public-space-finder-workshop-guide` (강의안)
- 참가자가 만드는 앱의 저장소: `school-public-space-finder` (별도)

## 담긴 내용

- 연수 소개: 대상·준비물·소요시간, 설명용 완성 화면, 연수 목표, 용어, 운영안(한 번에 / 두 차시), 사전 과제
- 0~14단계: 목표 / 작업할 사이트(메뉴 경로 도식) / 절차 / 복사 프롬프트 / 예상 결과 / 직접 시험하기 / 막혔을 때 / 이전·다음
  - 12단계: getdesign.md에서 DESIGN.md를 골라 앱 디자인을 일괄 바꾸기 (기능 완성 후, 완성 점검·GitHub 저장 전)
- 프롬프트 01~09 전문, 디자인 적용 프롬프트, 수정 요청 예시, wrangler.toml·_routes.json 복사 카드
- 가상 사례 R1~R6, 오류 도움말 12종과 오류별 복구 프롬프트, 공통 복구 프롬프트
- 강사용: 강의안 배포, 연수 전 확인, API 장애 대처, 공식 문서 모음

## 동작 원칙

- 공공 API를 호출하지 않고 인증키를 받지 않습니다. 서버 함수·환경변수가 없습니다.
- 브라우저 저장(localStorage)은 6단계의 ‘내 앱 공개 주소’ 하나뿐입니다. 저장이 막혀도 읽기·복사·이동은 됩니다.
- 진행률·완료 체크·이어서 하기 기능은 두지 않습니다. 현재 단계는 주소의 `#s3` 같은 해시로만 표시됩니다.
- 전체 인쇄는 접힌 내용과 프롬프트 전문까지 펼쳐 모든 단계를 출력하고 메뉴·버튼은 숨깁니다.

## 실행·빌드

```bash
npm install
npm run dev        # 개발 서버
npm run build      # 타입 검사 + dist 생성
npm run verify     # dist에 필수 내용(프롬프트 01~09, 0~14단계, 공식 링크)이 있고 금지 문구·네트워크 호출이 없는지 검사
npm run preview    # dist 미리보기
```

## 배포 (Cloudflare Pages)

현재 배포: https://outprogram.pages.dev (Cloudflare Pages 프로젝트 `outprogram`, 원본 https://github.com/sirlma111216-boop/outprogram)

이 프로젝트는 GitHub 저장소와 연결되어 있습니다. main 브랜치에 푸시하면 Cloudflare가 자동으로 빌드해 같은 주소에 다시 배포합니다. 새 배포는 대시보드의 Deployments 목록에서 커밋 번호로 확인합니다.

처음 연결할 때 쓴 설정은 다음과 같습니다.

1. Cloudflare 대시보드 → Workers & Pages → Create application → Pages → Import an existing Git repository.
2. 저장소 `sirlma111216-boop/outprogram`, Production branch `main`.
3. Build command `npm run build`, Build output directory `dist`, 환경변수 없음.
4. 발급된 `https://outprogram.pages.dev` 주소를 참가자에게 전달합니다.

## 내용 고치기

- 단계 본문: `src/content/steps.ts`
- 프롬프트 전문: `src/content/prompts.ts`
- 오류 도움말: `src/content/help.ts`
- 도식·표: `src/components/Extras.tsx`

명세 기준일은 2026-10-16입니다. 외부 서비스의 메뉴 이름·이용 조건이 바뀌면 공식 자료와 대조해 위 파일을 고칩니다.
