import type { HelpItem } from './types'

const KEEP = '확인된 증거와 추측을 구분하고 필요한 부분만 수정해 줘. React + Vite + Cloudflare Pages Functions 구조를 유지하고 비밀 키를 요청하거나 공개 코드에 넣지 마. 수정 후 내가 확인할 행동과 예상 결과를 알려 줘.'

export const HELP: HelpItem[] = [
  {
    id: 'html',
    title: 'API 주소에 JSON 대신 앱 화면(HTML)이 나옴',
    when: '공개 주소/api/services?start=1&size=5 를 열었는데 앱 화면이나 HTML 코드가 보일 때',
    checks: [
      'GitHub 저장소 루트에 functions/api/services.ts가 있는지 확인합니다. src/functions 나 dist/functions 이면 안 됩니다.',
      'Cloudflare 배포 로그에 Functions가 발견·배포되었다는 내용이 있는지 확인합니다.',
      'public/_routes.json이 있고 /api/* 를 포함하는지 확인합니다.',
      '모든 경로를 index.html로 돌려보내는 SPA fallback 설정(_redirects 등)이 /api 경로를 가로채지 않는지 확인합니다.',
    ],
    prompt: `공개 주소의 /api/services?start=1&size=5 를 열면 JSON 대신 앱 화면 HTML이 나와. functions/api/services.ts가 프로젝트 루트에 있고 onRequestGet을 내보내는지, public/_routes.json이 {"version":1,"include":["/api/*"],"exclude":[]}로 dist에 복사되는지, SPA fallback 설정이 /api 경로를 가로채지 않는지 확인해 줘. ${KEEP}
아래는 Cloudflare 배포 로그의 Functions 관련 부분이야:`,
    after: '마지막 줄 아래에 배포 로그 중 Functions 관련 줄을 붙여 넣습니다.',
  },
  {
    id: 'config',
    title: 'CONFIG_REQUIRED',
    when: 'API 응답이 503 CONFIG_REQUIRED 일 때',
    checks: [
      'Secret 이름이 SEOUL_OPEN_API_KEY와 대소문자까지 똑같은지 확인합니다.',
      '지금 여는 주소가 Production(프로젝트명.pages.dev)인지 Preview(무작위글자.프로젝트명.pages.dev)인지 확인하고, 그 환경에 Secret을 등록했는지 봅니다.',
      'Secret 등록 후 재배포했는지 확인합니다. 등록만 하고 재배포하지 않으면 반영되지 않습니다.',
    ],
    prompt: `공개 주소에서 /api/services 가 503 CONFIG_REQUIRED를 반환해. Cloudflare Secret SEOUL_OPEN_API_KEY는 등록했다고 생각해. 함수가 context.env.SEOUL_OPEN_API_KEY를 정확한 이름으로 읽는지, 빈 문자열 처리가 맞는지 코드만 확인해 줘. 키 값을 나에게 묻지 마. ${KEEP}`,
    after: '코드에 문제가 없다고 하면 Cloudflare 설정(이름·환경·재배포)을 다시 확인합니다.',
  },
  {
    id: 'info100',
    title: 'INFO-100 (인증 오류)',
    when: 'API 응답이 인증 오류로 분류될 때',
    checks: [
      '서울 열린데이터광장에서 발급받은 Open API 키인지 확인합니다. 공공데이터포털 키가 아닙니다.',
      '키 관리 화면에서 키 상태와 사용 조건을 확인합니다.',
      'Secret 값을 붙일 때 앞뒤 공백이 들어가지 않았는지 확인하고 필요하면 다시 등록한 뒤 재배포합니다.',
    ],
    prompt: `공개 주소의 /api/services 가 인증 오류(INFO-100)를 반환해. 함수가 키 앞뒤 공백을 제거하는지, 키를 URL 경로의 올바른 위치에 넣는지 코드만 확인해 줘. 키 값이나 키가 들어간 URL을 로그·응답에 출력하지 마. ${KEEP}`,
    after: '오류를 보고할 때 키 값은 절대 붙이지 않습니다.',
  },
  {
    id: 'error310',
    title: 'ERROR-310 (서비스명 오류)',
    when: '서비스를 찾을 수 없다는 오류가 날 때',
    checks: [
      '서비스명이 tvYeyakCOllect 로 대소문자까지 정확한지 확인합니다. C와 O가 대문자입니다.',
      'ListPublicReservation 같은 옛 서비스명이 섞이지 않았는지 확인합니다.',
      '데이터 페이지 Open API 탭의 현재 서비스명과 대조합니다.',
    ],
    prompt: `/api/services 가 ERROR-310(서비스명 오류)을 반환해. 함수 코드의 서비스명이 공식 명세의 tvYeyakCOllect와 대소문자까지 정확히 같은지, 요청 경로가 http://openapi.seoul.go.kr:8088/{KEY}/json/tvYeyakCOllect/{START}/{END}/ 형식인지 확인해 줘. ListPublicReservation으로 바꾸지 마. ${KEEP}`,
    after: '공식 페이지의 서비스명이 바뀌었다면 바뀐 이름을 프롬프트에 직접 적어 요청합니다.',
  },
  {
    id: 'five',
    title: '첫 5건만 나옴',
    when: '자료가 5건만 나오거나 6건 이상 요청하면 실패할 때',
    checks: [
      'sample 키로 호출하고 있지 않은지 확인합니다. sample은 구조 확인용으로 처음 5건만 됩니다.',
      'Secret에 정식 발급 키를 넣었는지, 요청 인덱스(start, size)가 의도대로인지 확인합니다.',
    ],
    prompt: `/api/services 가 처음 5건만 반환해. 함수가 sample 키로 자동 우회하는 코드가 있는지, start와 size로 END=start+size-1을 맞게 계산하는지 확인해 줘. sample 우회 코드가 있으면 제거해 줘. ${KEEP}`,
    after: '정식 키가 아직 발급되지 않았다면 가상 모드로 계속하고, 실제 연결은 미완료로 남깁니다.',
  },
  {
    id: 'notfirst',
    title: '첫 페이지에 원하는 항목이 없음',
    when: '분명 있을 것 같은 시설이 검색되지 않을 때',
    checks: [
      '자료가 최신순으로 정렬돼 있다고 가정하지 않습니다.',
      '화면의 총건수와 읽은 원본 행수를 비교합니다. 일부만 읽었다면 ‘추가 자료 읽기’를 누릅니다.',
      '전체를 읽어도 이 데이터셋에 없는 시설·행사는 나오지 않습니다.',
    ],
    prompt: `실제 자료 모드에서 원하는 항목이 검색되지 않아. 화면에 총건수·읽은 원본 행수·중복 제거 항목수·필터 결과수가 구분돼 있는지, 일부만 읽은 상태에서 0건을 ‘서울 전체에 없음’으로 표시하지 않는지 확인해 줘. ${KEEP}`,
    after: '읽은 범위를 늘린 뒤에도 없으면 공식 서비스 페이지에서 직접 찾아봅니다.',
  },
  {
    id: 'mixed',
    title: 'HTTPS 페이지에서 원천 HTTP 요청 오류',
    when: '콘솔에 Mixed Content 또는 차단된 http 요청 오류가 보일 때',
    checks: [
      '브라우저 코드가 openapi.seoul.go.kr 을 직접 부르고 있지 않은지 확인합니다.',
      '화면은 같은 사이트의 /api/services 만 불러야 합니다.',
      'http를 https로 바꾸는 우회는 하지 않습니다. 공식 HTTPS 지원이 확인되지 않았습니다.',
    ],
    prompt: `브라우저 콘솔에 openapi.seoul.go.kr 로 가는 http 요청이 차단됐다는 오류가 보여. 프런트엔드(src)에서 원천 API를 직접 fetch하는 코드를 찾아 제거하고 같은 사이트 /api/services 만 부르게 고쳐 줘. http를 https로 단순 치환하지 마. ${KEEP}
아래는 브라우저 콘솔의 오류 문장이야:`,
    after: '콘솔 오류 문장 안의 인증키 부분은 먼저 ●●●● 로 가립니다.',
  },
  {
    id: 'cfonly',
    title: '로컬은 되는데 Cloudflare에서 실패',
    when: '강사용 로컬 실행이나 다른 환경에서는 되는데 배포 주소에서만 502 UPSTREAM_ERROR 등이 날 때',
    checks: [
      'wrangler.toml의 compatibility_date가 2026-10-16이고 compatibility_flags에 allow_custom_ports가 있는지 확인합니다.',
      '원천 호스트 openapi.seoul.go.kr 과 포트 8088이 코드에 그대로 있는지 확인합니다.',
      'Cloudflare 함수 로그(Real-time Logs 등)에서 비밀 값이 빠진 오류 메시지를 확인합니다.',
      '서울 열린데이터광장 공지에서 제공기관 장애 여부를 확인합니다.',
    ],
    prompt: `배포 주소에서만 /api/services 가 502 UPSTREAM_ERROR를 반환해. wrangler.toml의 compatibility_date와 allow_custom_ports, 함수의 원천 호스트·8088 포트·12초 제한·오류 분류 코드를 확인해 줘. 실제 배포에서 성공하기 전까지 ‘해결됨’이라고 쓰지 마. ${KEEP}
아래는 Cloudflare 함수 로그의 오류 메시지야(키는 가렸어):`,
    after: '실제 공개 주소에서 JSON이 나오기 전까지는 해결된 것으로 보지 않습니다.',
  },
  {
    id: 'map',
    title: '지도 흰 화면',
    when: '지도 탭이 하얗거나 회색 조각만 보일 때',
    checks: [
      'Leaflet CSS를 불러왔는지 확인합니다.',
      '지도 컨테이너에 높이가 지정됐는지 확인합니다.',
      '탭을 바꿔 지도를 보여 준 뒤 크기를 다시 계산(invalidateSize)하는지 확인합니다.',
    ],
    prompt: `지도 탭이 흰 화면이거나 일부만 회색으로 그려져. Leaflet CSS import, 지도 컨테이너 높이, 지도 탭이 보인 직후 invalidateSize 호출, 화면을 떠날 때 지도 정리를 확인해 줘. OSM 타일 주소와 출처 표시는 유지해 줘. ${KEEP}`,
    after: '고친 뒤 목록 탭 → 지도 탭을 여러 번 오가며 확인합니다.',
  },
  {
    id: 'marker',
    title: '엉뚱한 곳에 마커 표시',
    when: '마커가 바다·아프리카·다른 나라에 찍힐 때',
    checks: [
      '좌표 순서를 확인합니다. Leaflet은 [위도, 경도] 순서이고, 경도·위도로 확인된 경우 [Y, X]입니다.',
      '문자열을 숫자로 바꾸는지, 빈 값을 0으로 바꾸지 않는지 확인합니다.',
      '값이 경도·위도 범위가 아니라면 투영좌표일 수 있습니다. 임의로 변환하지 않고 지도 미확인으로 둡니다.',
      '좌표를 자동으로 바꿔 끼우는 코드는 넣지 않습니다.',
    ],
    prompt: `지도 마커가 엉뚱한 위치에 찍혀. X/Y 정규화 함수에서 숫자 변환, 빈 값 처리, 위도·경도 범위 검사, Leaflet에 [Y,X] 순서로 넘기는지 확인해 줘. 투영좌표처럼 보이면 변환하지 말고 지도 미확인으로 둬. 좌표를 자동으로 바꿔 끼우지 마. ${KEEP}
아래는 문제가 된 항목의 X, Y 값과 원문에 적힌 장소야:`,
    after: '문제 항목의 X, Y 값과 장소명을 붙여 넣으면 원인 판단이 쉬워집니다.',
  },
  {
    id: 'printimg',
    title: '인쇄에 사진 없음',
    when: '출력물에 시설 사진이 나오지 않을 때',
    checks: [
      '정상일 수 있습니다. 출력물은 링크·텍스트 중심으로 유지합니다.',
      '외부 사진 표시 성공에 문서 전체가 의존하지 않게 합니다.',
    ],
    prompt: `인쇄 화면에서 사진이 나오지 않아. 사진이 없어도 검토표가 링크·텍스트만으로 완성되는지, 사진 실패 시 대체 문구와 원문 링크가 나오는지 확인해 줘. 이미지 프록시는 만들지 마. ${KEEP}`,
    after: '사진이 꼭 필요하면 원문 링크에서 직접 확인합니다.',
  },
  {
    id: 'confused',
    title: '안내 페이지는 열리는데 앱이 안 만들어짐',
    when: '이 강의안 페이지는 보이는데 내 앱이 어디에도 없을 때',
    checks: [
      '이 강의안은 읽고 복사하는 안내서입니다. 앱을 대신 만들거나 배포하지 않습니다.',
      '앱은 내 AI Studio 프로젝트에 프롬프트를 붙여 넣어 만들고, 내 GitHub·Cloudflare 계정에서 공개합니다.',
      '2단계로 돌아가 AI Studio Build 새 앱에 프롬프트 01부터 입력합니다.',
    ],
    prompt: `지금까지 입력한 프롬프트로 만들어진 앱의 현재 파일 구조와 화면 구성을 요약해 줘. 빠진 부분이 있으면 무엇을 다시 입력해야 하는지 알려 주고, 아직 코드는 수정하지 마.`,
    after: 'AI Studio에서 어떤 단계까지 진행됐는지 확인한 뒤 해당 단계의 프롬프트부터 이어 갑니다.',
  },
]
