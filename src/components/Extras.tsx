import { useState, type ReactNode } from 'react'
import type { ExtraKey } from '../content/types'
import { useAppUrl } from '../appUrl'
import { normalizeAppUrl } from '../storage'
import { ExtLink } from './ExtLink'

function Box({ title, children, tone = 'info' }: { title: string; children: ReactNode; tone?: 'info' | 'warn' | 'plain' }) {
  return (
    <section className={`extra extra-${tone}`} aria-label={title}>
      <h4>{title}</h4>
      {children}
    </section>
  )
}

function Table({ head, rows, caption }: { head: string[]; rows: ReactNode[][]; caption?: string }) {
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label={caption ?? head.join(', ')}>
      <table>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>{head.map((h) => <th key={h} scope="col">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => (j === 0 ? <th key={j} scope="row">{c}</th> : <td key={j}>{c}</td>))}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Flow({ items, label }: { items: { t: string; s?: string; tone?: string }[]; label: string }) {
  return (
    <ol className="flow" aria-label={label}>
      {items.map((x, i) => (
        <li key={i} className={x.tone ? `tone-${x.tone}` : undefined}>
          <strong>{x.t}</strong>
          {x.s && <span>{x.s}</span>}
        </li>
      ))}
    </ol>
  )
}

function Tree({ lines }: { lines: [string, string?][] }) {
  return (
    <pre className="tree" aria-label="파일 구조">
      {lines.map(([a, b], i) => (
        <span key={i} className="tree-line">
          {a}
          {b && <em>  ← {b}</em>}
          {'\n'}
        </span>
      ))}
    </pre>
  )
}

function AppUrlBox() {
  const { appUrl, setAppUrl, storageOk } = useAppUrl()
  const [draft, setDraft] = useState(appUrl)
  const [msg, setMsg] = useState<{ kind: 'ok' | 'fail' | 'warn'; text: string } | null>(null)

  function save() {
    const r = normalizeAppUrl(draft)
    if (r.error) return setMsg({ kind: 'fail', text: r.error })
    const ok = setAppUrl(r.url ?? '')
    setDraft(r.url ?? '')
    if (!r.url) return setMsg({ kind: 'ok', text: '기록을 지웠습니다.' })
    setMsg({
      kind: r.warn ? 'warn' : 'ok',
      text: (ok ? '이 브라우저에 기록했습니다.' : '저장이 막힌 브라우저입니다. 이 화면을 닫기 전까지만 유지됩니다.') + (r.warn ? ' ' + r.warn : ''),
    })
  }

  return (
    <Box title="내 앱 공개 주소 기록">
      <p>Cloudflare가 발급한 공개 주소의 앞부분만 적습니다. 인증키는 절대 적지 않습니다. 이 기록은 이 기기·이 브라우저에만 남습니다.</p>
      {!storageOk && <p className="status-warn">이 브라우저는 저장이 막혀 있어 새로고침하면 기록이 사라집니다. 읽기·복사·이동은 그대로 됩니다.</p>}
      <div className="url-form no-print">
        <label htmlFor="app-url">공개 주소 (예: https://school-public-space-finder.pages.dev)</label>
        <div className="url-row">
          <input id="app-url" type="url" inputMode="url" autoComplete="off" spellCheck={false} value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="https://프로젝트명.pages.dev" />
          <button type="button" className="btn btn-primary" onClick={save}>기록</button>
        </div>
        <div role="status" aria-live="polite">{msg && <p className={`status-${msg.kind}`}>{msg.text}</p>}</div>
      </div>
      {appUrl ? (
        <ul className="url-links">
          <li>앱 화면: <ExtLink href={appUrl}>{appUrl}</ExtLink></li>
          <li>API 확인: <ExtLink href={`${appUrl}/api/services?start=1&size=5`}>{appUrl}/api/services?start=1&amp;size=5</ExtLink> <span className="muted">— 누를 때만 열립니다. 강의안은 API를 스스로 부르지 않습니다.</span></li>
        </ul>
      ) : (
        <p className="muted">아직 기록한 주소가 없습니다.</p>
      )}
    </Box>
  )
}

function UrlRecord() {
  const { appUrl } = useAppUrl()
  const guide = typeof window !== 'undefined' ? window.location.origin : ''
  return (
    <Box title="두 주소를 따로 기록하기">
      <Table
        head={['구분', '주소', '누가 쓰나']}
        rows={[
          ['내 앱 (참가자 앱)', appUrl ? <ExtLink href={appUrl}>{appUrl}</ExtLink> : <span className="muted">6단계 입력란에 기록하면 여기에 보입니다.</span>, '나와 동료 교사가 공공시설을 찾을 때'],
          ['이 강의안', <code>{guide}</code>, '연수 참가자가 따라 할 때'],
        ]}
      />
      <p>두 주소는 서로 다른 GitHub 저장소와 다른 Cloudflare 프로젝트에서 나옵니다.</p>
    </Box>
  )
}

export function Extra({ k }: { k: ExtraKey }) {
  switch (k) {
    case 'twoProducts':
      return (
        <Box title="두 결과물을 혼동하지 않기">
          <div className="two-col">
            <div className="card-mini">
              <h5>① 이 강의안 (지금 보는 페이지)</h5>
              <ul>
                <li>읽고, 프롬프트를 복사하는 안내서</li>
                <li>공공 API를 부르지 않고 키도 받지 않음</li>
                <li>저장소: school-public-space-finder-workshop-guide</li>
              </ul>
            </div>
            <div className="card-mini accent">
              <h5>② 참가자 앱 ‘학교 밖 활동공간 탐색기’</h5>
              <ul>
                <li>내 AI Studio 프로젝트에서 내가 만드는 앱</li>
                <li>서버 함수가 서울시 자료를 대신 받아옴</li>
                <li>저장소: school-public-space-finder</li>
              </ul>
            </div>
          </div>
          <p>강의안은 로그인·키 발급·GitHub 저장·배포를 대신 해 주지 않습니다. 모든 작업은 참가자가 자기 계정에서 직접 합니다.</p>
        </Box>
      )
    case 'scenario':
      return (
        <Box title="완성 시나리오 — 동아리 발표 연습 공간 찾기">
          <p>“동아리 발표 연습이나 교직원 워크숍을 할 공공 공간과 프로그램을 찾고, 신청 전에 조건을 비교할 수 있을까?”</p>
          <Flow
            label="완성 흐름"
            items={[
              { t: '공공서비스 읽기', s: '서울시 예약 서비스 목록' },
              { t: '후보 찾기', s: '시설대관·체육시설·교육·문화행사, 지역·대상' },
              { t: '기간 확인', s: '접수 기간과 이용 기간을 따로' },
              { t: '비교', s: '지도와 최대 4개 비교표' },
              { t: '교사 판단·문서', s: '문의 체크리스트·검토표 출력' },
              { t: '공식 페이지로 이동', s: '예약은 거기서 직접', tone: 'teal' },
            ]}
          />
          <p className="muted">앱의 단위는 건물 하나가 아니라 ‘예약 서비스/프로그램 항목’입니다. 같은 장소에 여러 항목이 있을 수 있습니다. 빈 시설·빈 시간대·잔여석은 이 자료로 알 수 없습니다.</p>
        </Box>
      )
    case 'keyTimeline':
      return (
        <Box title="인증키가 지나가는 길" tone="warn">
          <Flow
            label="인증키 흐름"
            items={[
              { t: '1단계 발급', s: '서울 열린데이터광장' },
              { t: '보관', s: '내 인증키 관리 화면' },
              { t: '6단계 입력', s: 'Cloudflare Secret SEOUL_OPEN_API_KEY', tone: 'teal' },
              { t: '사용', s: '서버 함수만 읽음' },
            ]}
          />
          <p><strong>넣으면 안 되는 곳:</strong> AI 대화창, GitHub, VITE_ 로 시작하는 변수, 브라우저 저장소, 화면, 이 강의안, 메신저.</p>
        </Box>
      )
    case 'apiAnatomy':
      return (
        <Box title="요청 주소 뜯어보기">
          <p>API는 ‘다른 기관의 데이터를 약속된 주소로 요청하는 방법’입니다. 공식 요청 형식은 다음과 같습니다.</p>
          <div className="anatomy" aria-label="요청 주소 구성">
            <span className="seg"><b>http://openapi.seoul.go.kr:8088</b><i>서울시 서버와 포트</i></span>
            <span className="seg key"><b>/{'{KEY}'}</b><i>인증키 자리</i></span>
            <span className="seg"><b>/json</b><i>응답 형식</i></span>
            <span className="seg"><b>/tvYeyakCOllect</b><i>서비스명 (대소문자 그대로)</i></span>
            <span className="seg"><b>/{'{START}'}/{'{END}'}/</b><i>몇 번째부터 몇 번째까지</i></span>
          </div>
          <ul>
            <li>지역·대상 필터를 지원한다고 추측해 주소 뒤에 덧붙이지 않습니다. 필터는 받은 자료에 앱이 적용합니다.</li>
            <li>과거 예제의 ListPublicReservation 으로 바꾸지 않습니다.</li>
            <li>키가 주소 안에 들어가므로, 이 주소는 서버 함수만 만들고 로그·화면에 남기지 않습니다.</li>
            <li>원천 주소가 http(8088)이라 브라우저 → Cloudflare 구간은 암호화되지만 Cloudflare → 서울시 구간은 암호화되지 않습니다. 연수용 별도 키를 씁니다.</li>
          </ul>
        </Box>
      )
    case 'resultCodes':
      return (
        <Box title="응답 코드 읽기 (HTTP 상태와 RESULT.CODE를 함께 봅니다)">
          <Table
            head={['RESULT.CODE', '뜻', '앱이 보여 줄 것']}
            rows={[
              ['INFO-000', '정상', '자료 목록'],
              ['INFO-200', '자료 없음 (정상 응답)', '“해당 범위에 자료 없음”'],
              ['INFO-100', '인증 오류', '“인증키를 확인하세요”'],
              ['ERROR-310', '서비스명 오류', '“서비스명을 확인하세요”'],
            ]}
          />
          <p className="muted">실패 응답은 tvYeyakCOllect 안이 아니라 최상위 RESULT로만 올 수도 있습니다. sample 키는 처음 1~5건 구조 확인용입니다.</p>
        </Box>
      )
    case 'fieldTable':
      return (
        <Box title="필드 읽기표 — 원문은 원문대로">
          <Table
            head={['필드', '뜻', '주의']}
            rows={[
              ['SERVICE + SVCID', '서비스구분코드 + 서비스ID', '둘을 합쳐 항목 식별자로 사용'],
              ['SVCNM / PLACENM', '이름 / 장소', '같아도 다른 상품일 수 있음'],
              ['MAXCLASSNM / MINCLASSNM', '대분류 / 소분류', '원자료 값으로 필터 구성'],
              ['SVCSTATNM', '원자료 서비스상태', '앱 계산 상태와 따로 표시'],
              ['RCPTBGNDT / RCPTENDDT', '접수 기간', '이용 기간과 다른 필드'],
              ['SVCOPNBGNDT / SVCOPNENDDT', '이용 기간', '희망 날짜와 겹침만 판단'],
              ['PAYATNM', '요금 관련 구분 원문', '금액 숫자 아님, 빈 값은 미제공'],
              ['USETGTINFO', '대상 원문', '해석은 교사 판단'],
              ['X / Y', '장소 좌표', '값을 보고 좌표계 확인 후 사용'],
              ['AREANM / TELNO', '지역 / 문의', ''],
              ['V_MIN / V_MAX', '이용시간 원문', '빈 시간대 아님'],
              ['REVSTDDAY / REVSTDDAYNM', '취소 관련 원문', ''],
              ['SVCURL / IMGURL / DTLCONT', '공식 링크 / 이미지 / 상세내용', '상세 HTML은 일반 텍스트로 정리'],
              ['DIV / GUBUN', '예약구분 / 서비스구분', '구분값 보존'],
            ]}
          />
        </Box>
      )
    case 'samples':
      return (
        <Box title="가상 사례 6개 — 하나씩 열어 확인하기">
          <Table
            head={['사례', '설정', '확인할 점']}
            rows={[
              ['R1 공간 대관', '접수: 기준일 −1일 ~ +5일 / 이용: +10 ~ +20일, 원자료 ‘접수중’, 무료, 위치 있음', '접수기간 내이지만 희망 날짜가 기준일 당일이면 이용 기간 밖'],
              ['R2 유료 교육', '접수 시작 +3일, 대상 원문 ‘성인’', '‘접수 전’ 표시, 학교 업무 활용은 교사 판단 필요로 남음'],
              ['R3 상태 불일치', '접수기간이 기준일 포함, 원자료 ‘접수마감’', '계산 ‘접수기간 내’와 원자료 ‘접수마감’이 나란히, 불일치 안내'],
              ['R4 미제공', '기간·요금·대상·좌표 모두 없음', '0원·오늘 마감·위치 0,0이 아니라 ‘미제공’, 지도에서만 빠짐'],
              ['R5 같은 장소 다른 상품', 'R1과 장소·제목 같음, 서비스ID·이용기간 다름', 'R1과 합쳐지지 않고 두 항목으로 남음'],
              ['R6 당일 마감', '접수 종료 기준일 17:00', '기준시각 16:59 → 접수기간 내, 17:01 → 기간 종료'],
            ]}
          />
          <p className="muted">모든 이름은 ‘연수용 가상’으로 시작합니다. 링크·사진은 ‘링크 없음’·‘이미지 없음’으로 표시되어야 합니다.</p>
        </Box>
      )
    case 'flow':
      return (
        <Box title="자료가 흐르는 길 — 같은 사이트 안에서">
          <Flow
            label="자료 흐름"
            items={[
              { t: '화면', s: '브라우저' },
              { t: '/api/services', s: '같은 사이트 주소' },
              { t: 'functions/api/services.ts', s: '키를 보관한 중계 창구', tone: 'teal' },
              { t: '서울시 API', s: 'openapi.seoul.go.kr:8088' },
              { t: '정리한 JSON', s: '필요한 필드만' },
              { t: '화면', s: '목록·지도·비교' },
            ]}
          />
          <p>서버 함수는 ‘키를 보관하고 대신 자료를 받아오는 중계 창구’입니다. 브라우저는 서울시 주소도, 키도 모릅니다.</p>
          <p className="muted">AI Studio의 내장 배포와 이 연수의 Cloudflare 배포는 다른 경로입니다. AI Studio의 Node 서버가 Cloudflare에서 그대로 실행되지 않으므로, React + Vite 화면과 Pages Functions를 만들어 GitHub를 거쳐 배포합니다.</p>
        </Box>
      )
    case 'fileTree':
      return (
        <Box title="프롬프트 03 이후 기대하는 파일 위치">
          <Tree
            lines={[
              ['school-public-space-finder/'],
              ['├─ functions/', 'src·dist 밖, 최상위'],
              ['│  └─ api/services.ts', 'onRequestGet'],
              ['├─ public/'],
              ['│  └─ _routes.json', '/api/* 만 함수로'],
              ['├─ src/', '화면 + 정규화·필터·날짜 함수'],
              ['├─ index.html'],
              ['├─ package.json'],
              ['├─ wrangler.toml', 'Pages용 네 줄'],
              ['├─ .gitignore'],
              ['└─ README.md'],
            ]}
          />
        </Box>
      )
    case 'repoTree':
      return (
        <Box title="GitHub 저장소 루트에서 확인할 것">
          <Tree
            lines={[
              ['functions/', '꼭 있어야 함'],
              ['public/_routes.json'],
              ['src/'],
              ['index.html'],
              ['package.json', '루트에 있어야 Root directory 기본값'],
              ['package-lock.json', '잠금 파일'],
              ['wrangler.toml'],
              ['.gitignore', '숨김 파일'],
            ]}
          />
          <p className="status-warn">있으면 안 되는 것: 실제 인증키, .dev.vars, .env, 학생 이름·학번, node_modules, dist</p>
        </Box>
      )
    case 'zipFallback':
      return (
        <Box title="GitHub 연동이 안 될 때 — ZIP으로 올리기">
          <ol className="numbered">
            <li>AI Studio에서 프로젝트를 ZIP으로 다운로드합니다.</li>
            <li>내 컴퓨터에서 ZIP의 압축을 풉니다.</li>
            <li>GitHub에서 New repository로 school-public-space-finder 저장소를 만듭니다.</li>
            <li>저장소 화면에서 Add file → Upload files를 누릅니다.</li>
            <li>압축을 푼 폴더 안의 내용물(폴더와 파일)을 끌어다 놓습니다. ZIP 파일 하나만 올리지 않습니다.</li>
            <li>functions 폴더와 .gitignore 같은 숨김 파일이 빠지지 않았는지 확인합니다.</li>
            <li>Commit changes를 눌러 커밋합니다.</li>
          </ol>
          <p className="muted">ZIP으로 올렸다면 이후 수정도 같은 방법으로 덮어 올려야 Cloudflare가 새로 배포합니다.</p>
        </Box>
      )
    case 'buildSettings':
      return (
        <Box title="Cloudflare Pages 빌드 설정">
          <Table
            head={['항목', '값', '설명']}
            rows={[
              ['Project name', 'school-public-space-finder', '공개 주소 앞부분이 됨 (이미 쓰이면 뒤에 글자가 붙음)'],
              ['Production branch', 'main (실제 기본 브랜치)', 'GitHub 저장소의 기본 브랜치'],
              ['Framework preset', 'React (Vite) 또는 None', '아래 두 값만 맞으면 됨'],
              ['Build command', <code>npm run build</code>, '빌드: 공개할 웹 파일로 묶는 과정'],
              ['Build output directory', <code>dist</code>, '묶인 결과 폴더'],
              ['Root directory', '기본값 (비워 둠)', 'package.json이 루트에 있을 때'],
              ['Environment variables', '빌드 변수 없음', '키는 배포 후 Secret으로 따로 등록'],
            ]}
          />
        </Box>
      )
    case 'appUrl':
      return <AppUrlBox />
    case 'diagnoseOrder':
      return (
        <Box title="API 확인이 실패할 때 확인 순서">
          <Table
            head={['보이는 결과', '먼저 볼 곳', '그다음']}
            rows={[
              ['503 CONFIG_REQUIRED', 'Secret 이름 SEOUL_OPEN_API_KEY', '환경(Production/Preview) → 재배포'],
              ['인증 오류 (INFO-100)', '서울시 키 상태·사용 조건', 'Secret 값 앞뒤 공백 → 재등록·재배포'],
              ['502 UPSTREAM_ERROR', '원천 주소·서비스명 tvYeyakCOllect', '8088 포트 → compatibility_date·allow_custom_ports → 제공기관 상태'],
              ['JSON 대신 HTML', 'functions 위치·배포 로그', '_routes.json → SPA fallback'],
            ]}
          />
          <p className="status-warn">실패를 우회하려고 브라우저에서 원천 API를 직접 부르거나 키를 공개하지 않습니다. API 장애로 실패했다면 가상 모드로 화면 실습을 계속하고 이 단계는 아직 끝나지 않은 것으로 남깁니다.</p>
        </Box>
      )
    case 'instructorLocal':
      return (
        <details className="extra extra-plain instructor">
          <summary>강사용 선택 — 로컬에서 함수까지 실행해 보기</summary>
          <p>로컬 Node 환경이 준비된 강사만 합니다. 기본 참가자 과정은 터미널 설치를 요구하지 않습니다.</p>
          <pre className="cmd">npm install{'\n'}npm run build{'\n'}npx wrangler pages dev dist</pre>
          <p>로컬 실행용 키는 프로젝트 루트의 .dev.vars 파일에 SEOUL_OPEN_API_KEY= 형식으로 둡니다. .dev.vars는 로컬 전용이며 GitHub에 올리지 않습니다(.gitignore에 포함).</p>
        </details>
      )
    case 'counts':
      return (
        <Box title="네 가지 숫자를 구분하기">
          <Table
            head={['숫자', '뜻', '예시']}
            rows={[
              ['전체 건수 (total)', '서울시 API가 알려 준 데이터셋 전체 행 수', '예: 3,200'],
              ['읽은 원본 행수 (received 합계)', '지금까지 실제로 받아 온 행 수', '예: 1,000 (아직 일부)'],
              ['중복 제외 항목수', 'SERVICE+SVCID 기준으로 겹친 행을 뺀 수', '예: 998'],
              ['필터 결과수', '현재 조건에 맞는 항목 수 — 읽은 자료 안에서만', '예: 12'],
            ]}
          />
          <ul>
            <li>추가 읽기는 사용자가 누를 때만, 한 번에 한 페이지씩 진행합니다. 기본 안전 상한은 총 20,000행·최대 40회 요청입니다.</li>
            <li>덜 읽은 상태의 0건은 ‘서울 전체에 없음’이 아닙니다.</li>
            <li>전체를 읽어도 이 데이터셋의 범위일 뿐 모든 시설·행사를 포괄하지 않습니다. 읽는 동안 원자료가 바뀔 수도 있습니다.</li>
          </ul>
        </Box>
      )
    case 'periods':
      return (
        <Box title="접수 기간과 이용 기간은 다른 질문입니다">
          <div className="periods" aria-label="기간 도식">
            <div className="prow"><span className="plabel">접수 기간</span><span className="pbar rcpt" style={{ left: '4%', width: '30%' }}>RCPTBGNDT ~ RCPTENDDT</span></div>
            <div className="prow"><span className="plabel">이용 기간</span><span className="pbar use" style={{ left: '44%', width: '48%' }}>SVCOPNBGNDT ~ SVCOPNENDDT</span></div>
            <div className="prow"><span className="plabel">희망 날짜</span><span className="pmark" style={{ left: '66%' }}>▼</span></div>
          </div>
          <Table
            head={['질문', '판단 근거', '앱이 말해도 되는 것']}
            rows={[
              ['지금 신청할 수 있나?', '접수 기간 + 실제 현재 시각(서울)', '접수 전 / 접수기간 내 / 기간 종료 / 일시 미확인'],
              ['그날 쓸 수 있나?', '이용 기간과 희망 날짜의 겹침', '“이용 기간에 포함됨” — 그날 예약 가능하다는 뜻은 아님'],
              ['정말 열려 있나?', '원자료 SVCSTATNM', '원문 그대로 표시, 계산과 다르면 불일치 안내'],
            ]}
          />
          <p className="muted">마감일만 있고 시각이 없으면 당일은 ‘마감시각 확인 필요’로 둡니다. 날짜가 없으면 접수 중으로 만들지 않습니다.</p>
        </Box>
      )
    case 'mapRules':
      return (
        <Box title="지도 규칙">
          <ul>
            <li>타일: OpenStreetMap 표준 타일, 출처 링크 유지. 대량 미리받기·오프라인 저장 금지.</li>
            <li>좌표: 위도·경도 범위를 확인하고 경도·위도로 확인된 경우 Leaflet에 [Y, X]로 넘깁니다. 서울 밖이라고 지우지 않습니다.</li>
            <li>좌표가 없으면 지도에서만 빼고 목록·비교에는 남깁니다.</li>
            <li>학교 위치는 지도 클릭으로 정합니다. 거리는 직선거리이며 이동시간이 아닙니다.</li>
            <li>지도 없이도 키보드로 같은 항목을 고를 수 있는 목록을 둡니다.</li>
          </ul>
        </Box>
      )
    case 'memoRules':
      return (
        <Box title="원자료와 교사 메모를 나누기">
          <div className="two-col">
            <div className="card-mini">
              <h5>원자료 (서울시 API)</h5>
              <ul>
                <li>서비스명·분류·장소·지역</li>
                <li>대상 원문·요금 구분 원문</li>
                <li>접수 기간·이용 기간·시간 원문</li>
                <li>원자료 상태·문의처·공식 링크</li>
              </ul>
            </div>
            <div className="card-mini accent">
              <h5>교사 메모 (내가 입력)</h5>
              <ul>
                <li>사용 목적·희망 날짜/시간·예상 인원</li>
                <li>수용인원·단체 이용·장비·접근성 확인</li>
                <li>실제 견적·취소 조건·문의 기록</li>
                <li>검토 상태: 후보 / 문의 필요 / 문의 기록 있음 / 선정 후보</li>
              </ul>
            </div>
          </div>
          <p className="muted">후보와 메모는 이 브라우저에만 저장됩니다. 다른 기기와 동기화되지 않고 공동 편집도 아닙니다.</p>
        </Box>
      )
    case 'shareRules':
      return (
        <Box title="‘앱 주소 공유’와 ‘내 후보 공유’는 다릅니다">
          <Table
            head={['공유하는 것', '방법', '상대가 보는 것']}
            rows={[
              ['앱 공개 주소', '주소를 알려 줌', '빈 앱 — 내 후보·메모는 보이지 않음'],
              ['내 후보와 메모', '인쇄물·PDF 또는 내보낸 JSON 파일을 직접 전달', '내가 정리한 검토표'],
            ]}
          />
          <p className="muted">자동 전송·이메일 발송 기능은 넣지 않습니다.</p>
        </Box>
      )
    case 'finalChecks':
      return (
        <Box title="경계 사례 점검표">
          <Table
            head={['경우', '어디서', '맞는 결과']}
            rows={[
              ['접수 중 / 이용기간 밖', '가상 R1 + 희망 날짜 기준일', '접수기간 내, 희망 날짜는 이용 기간 밖'],
              ['접수 전 / 이용기간 내', '가상 R2', '접수 전'],
              ['기간상 접수중 / 원자료 마감', '가상 R3', '불일치 안내 + 원문 확인'],
              ['마감 당일 정확한 시각 있음', '가상 R6, 16:59 / 17:01', '접수기간 내 → 기간 종료'],
              ['마감 당일 시각 없음', '실제 자료(날짜만 있는 항목)', '마감시각 확인 필요'],
              ['잘못된 날짜 순서', '시작 > 종료인 자료', '일시 확인 필요'],
              ['같은 장소 여러 서비스', '가상 R1·R5', '두 항목, 마커 안 목록'],
              ['미확인 좌표', '가상 R4', '지도 제외, 목록·비교 유지'],
              ['요금 원문', '실제 자료', '명확한 무료/유료만 분류, 나머지 미확인'],
              ['페이지 실패·취소', '실제 모드 + Offline', '마지막 성공 위치 보존, 실패 페이지부터 재시도'],
              ['키 노출', '공개 주소의 JS, GitHub', 'openapi.seoul.go.kr·키 값 없음'],
            ]}
          />
        </Box>
      )
    case 'cacheExplain':
      return (
        <Box title="캐시가 두 가지입니다">
          <Table
            head={['종류', '무엇을', '바뀌는 때']}
            rows={[
              ['정적 파일 캐시', '화면 코드(HTML·JS·CSS)', '새 배포 후 새로고침 — 안 보이면 Ctrl+Shift+R'],
              ['API 자료 캐시', '서버 함수가 받은 서울시 응답', '약 10분 뒤 또는 다른 범위 조회 — 배포와 무관'],
            ]}
          />
          <p className="muted">화면에 보이는 조회 시각은 서버가 실제로 자료를 받아 온 시각입니다. 원자료 갱신 시각이 아닙니다.</p>
        </Box>
      )
    case 'urlRecord':
      return <UrlRecord />
    case 'designPick':
      return (
        <Box title="getdesign.md 와 DESIGN.md 알아보기">
          <p>
            <ExtLink href="https://getdesign.md/">getdesign.md</ExtLink>는 여러 웹사이트의 디자인 규칙을 <strong>DESIGN.md</strong>라는 글 파일로 정리해 둔 모음입니다. 이 파일을 AI에게 주면 색·글꼴·간격·버튼 모양을 그 규칙대로 앱 전체에 한 번에 맞춥니다.
          </p>
          <Flow
            label="디자인 바꾸기 흐름"
            items={[
              { t: '고르기', s: 'Browse website catalog' },
              { t: '미리보기', s: 'Live Preview · Light/Dark' },
              { t: '내려받기', s: 'Download DESIGN.md' },
              { t: '복사', s: '메모장으로 열어 전체 복사' },
              { t: '붙여 넣기', s: 'AI Studio에 프롬프트 + 내용', tone: 'teal' },
              { t: '확인', s: '미리보기에서 기능·배지 유지 확인' },
            ]}
          />
          <Table
            head={['고를 때 볼 점', '이유']}
            rows={[
              ['본문 글자가 크고 배경과 대비가 뚜렷한가', '조건과 날짜를 꼼꼼히 읽는 업무 앱'],
              ['표·목록·버튼이 차분한가', '비교표와 검토표가 많음'],
              ['밝은 화면(Light)에서도 보기 좋은가', '인쇄 출력이 밝은 바탕'],
            ]}
          />
          <p className="muted">왜 지금 하나요? 기능을 다 만든 뒤에 바꿔야 이후 기능 수정이 디자인을 다시 흐트러뜨리지 않고, 완성 점검(13단계)에서 디자인까지 함께 확인한 뒤 GitHub에 저장할 수 있기 때문입니다.</p>
        </Box>
      )
  }
}
