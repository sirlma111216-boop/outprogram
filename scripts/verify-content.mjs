// 빌드 결과(dist)에 필수 내용이 모두 들어 있고, 남기면 안 되는 문구가 없는지 검사한다.
// 사용: npm run build && npm run verify
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = join(process.cwd(), 'dist', 'assets')
const js = readdirSync(dir).filter((f) => f.endsWith('.js')).map((f) => readFileSync(join(dir, f), 'utf8')).join('\n')

const must = [
  ...['01', '02', '03', '04', '05', '06', '07', '08', '09'].map((n) => `프롬프트 ${n}`),
  'tvYeyakCOllect',
  'https://data.seoul.go.kr/dataList/OA-20497/S/1/datasetView.do',
  'http://openapi.seoul.go.kr:8088/{KEY}/json/tvYeyakCOllect/{START}/{END}/',
  'compatibility_flags = ["allow_custom_ports"]',
  '{"version":1,"include":["/api/*"],"exclude":[]}',
  'SEOUL_OPEN_API_KEY',
  'https://getdesign.md/',
  'Download DESIGN.md',
  'R1:', 'R2:', 'R3:', 'R4:', 'R5:', 'R6:',
  '공통 복구 프롬프트',
  'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  'https://www.openstreetmap.org/copyright',
  'https://ai.google.dev/gemini-api/docs/aistudio-build-mode',
  'https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/',
  'https://developers.cloudflare.com/pages/functions/bindings/#secrets',
  'https://developers.cloudflare.com/workers/configuration/compatibility-flags/',
  'https://operations.osmfoundation.org/policies/tiles/',
  'https://data.seoul.go.kr/together/guide/useGuide.do',
]
const mustNot = ['추후 작성', 'TODO', 'TBD', 'lorem', '진행률', '완료 체크', '이어서 하기']

let fail = 0
for (const s of must) if (!js.includes(s)) { console.error('빠짐:', s); fail++ }
for (const s of mustNot) if (js.includes(s)) { console.error('남김:', s); fail++ }
// 0~14단계가 모두 있는지
for (let n = 0; n <= 14; n++) if (!js.includes(`num:${n},`)) { console.error('단계 없음:', n); fail++ }
// 강의안이 스스로 네트워크 요청을 하지 않는지
for (const s of ['fetch(', 'XMLHttpRequest', 'sendBeacon']) if (js.includes(s)) { console.error('네트워크 호출 의심:', s); fail++ }

if (fail) { console.error(`실패 ${fail}건`); process.exit(1) }
console.log(`통과: 필수 ${must.length}개 확인, 단계 0~14, 금지 문구·네트워크 호출 없음`)
