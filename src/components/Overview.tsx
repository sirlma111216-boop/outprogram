import { STEPS, TOTAL_STEP_MINUTES } from '../content/steps'
import { AppPreview } from './AppPreview'
import { ExtLink } from './ExtLink'
import { L } from '../content/links'

const sum = (from: number, to: number) => STEPS.filter((s) => s.num >= from && s.num <= to).reduce((a, s) => a + s.minutes, 0)

export function Overview({ go }: { go: (id: string) => void }) {
  const part1 = sum(0, 6)
  const part2 = sum(7, 14)
  return (
    <>
      <h2 className="section-title">연수 소개</h2>
      <p className="lead">
        이 강의안을 보며 한 단계씩 따라 하면, 교사가 학교 밖 공공시설·프로그램을 찾아 접수·이용 조건을 비교하는 웹앱 ‘학교 밖 활동공간 탐색기’를 직접 만들어 인터넷에 공개할 수 있습니다.
      </p>

      <div className="facts">
        <div>
          <h3>대상</h3>
          <p>코딩 경험이 없어도 되는 초·중·고 교사, 교직원 연수 담당자</p>
        </div>
        <div>
          <h3>준비물</h3>
          <ul>
            <li>노트북과 최신 크롬·엣지 브라우저</li>
            <li>Google 계정 (AI Studio)</li>
            <li>GitHub 계정</li>
            <li>Cloudflare 계정</li>
            <li>서울 열린데이터광장 계정</li>
          </ul>
        </div>
        <div>
          <h3>소요시간</h3>
          <p>
            단계 합계 <strong>{TOTAL_STEP_MINUTES}분</strong>, 쉬는 시간·질의를 더해 약 240~270분
          </p>
          <p className="muted small">계정 만들기와 기관 정책 확인은 사전 과제입니다.</p>
        </div>
      </div>

      <h3 className="h-sub">기본판 완성 모습</h3>
      <AppPreview />

      <h3 className="h-sub">연수 목표</h3>
      <ul className="goals">
        <li><strong>공공자료 해석</strong> — 서울시 예약 서비스 자료의 필드를 원문대로 읽습니다.</li>
        <li><strong>데이터의 한계 확인</strong> — 잔여석·빈 시간대·수용인원은 이 자료로 알 수 없음을 구분합니다.</li>
        <li><strong>업무 흐름 설계</strong> — 조회 → 비교 → 교사 판단 → 문서 출력.</li>
        <li><strong>AI 코드 검토</strong> — AI가 만든 결과를 경계 사례로 직접 시험합니다.</li>
        <li><strong>공개 배포</strong> — GitHub와 Cloudflare Pages로 내 주소를 받습니다.</li>
      </ul>

      <h3 className="h-sub">먼저 알아 둘 말 네 개</h3>
      <dl className="terms">
        <div><dt>API</dt><dd>다른 기관의 데이터를 약속된 주소로 요청하는 방법</dd></div>
        <div><dt>서버 함수</dt><dd>키를 보관하고 대신 자료를 받아오는 중계 창구</dd></div>
        <div><dt>GitHub</dt><dd>코드 원본 저장소</dd></div>
        <div><dt>빌드</dt><dd>공개할 웹 파일로 묶는 과정</dd></div>
      </dl>

      <h3 className="h-sub">제작 도구와 경로</h3>
      <ol className="flow" aria-label="제작 경로">
        <li><strong>Google AI Studio Build</strong><span>프롬프트로 앱 제작</span></li>
        <li><strong>GitHub</strong><span>원본 저장</span></li>
        <li className="tone-teal"><strong>Cloudflare Pages</strong><span>빌드·공개 주소</span></li>
        <li><strong>Pages Functions</strong><span>서울시 API 중계</span></li>
      </ol>
      <p className="muted">
        참가자 앱은 React + Vite + TypeScript, Leaflet 지도, 서버 중계 함수로 만듭니다. 기본 과정에는 Gemini, 유료 지도 API, DB, 회원가입, 학교 계정 연동을 넣지 않습니다. AI Studio의 내장 배포와 이 연수의 Cloudflare 배포는 서로 다른 경로입니다.
      </p>

      <h3 className="h-sub">운영안</h3>
      <div className="table-wrap" tabIndex={0} role="region" aria-label="운영안">
        <table>
          <thead>
            <tr><th scope="col">방식</th><th scope="col">구성</th><th scope="col">시간</th></tr>
          </thead>
          <tbody>
            <tr><th scope="row">한 번에</th><td>0~14단계 연속, 중간 쉬는 시간 2회</td><td>약 {TOTAL_STEP_MINUTES + 20}분</td></tr>
            <tr><th scope="row">두 차시 (초보자 권장)</th><td>1차시: 0~6단계 (계정·데이터·화면·가상 자료·서버 함수·GitHub·배포)<br />2차시: 7~14단계 (실제 자료·검색·지도·비교·출력·디자인·점검·재배포)</td><td>{part1}분 + {part2}분</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className="h-sub">사전 과제</h3>
      <ul>
        <li>AI Studio·GitHub·Cloudflare·<ExtLink href={L.seoulHome.url}>서울 열린데이터광장</ExtLink> 계정을 만들고 로그인해 봅니다.</li>
        <li>소속 기관의 외부 클라우드·코드 저장소 사용 정책을 확인합니다.</li>
        <li>가능하면 미리 서울시 Open API 인증키를 신청해 둡니다. 발급에 시간이 걸릴 수 있습니다.</li>
      </ul>

      <div className="block caution" role="note">
        <h3>비용과 한도</h3>
        <p>각 서비스의 무료 요금제 현재 한도 안에서 운영합니다. API 승인 조건과 호스팅 비용 조건은 연수 전에 공식 문서에서 확인합니다. 무제한·영구 무료를 보장하지 않습니다. 유료 도메인 구입은 필요 없습니다.</p>
      </div>

      <div className="block">
        <h3>이 강의안의 원칙</h3>
        <ul>
          <li>이 페이지는 공공 API를 부르지 않고 인증키를 묻지 않습니다.</li>
          <li>로그인·키 발급·GitHub 저장·배포는 강의안이 대신하지 않습니다. 모두 참가자가 직접 합니다.</li>
          <li>브라우저에 저장하는 것은 6단계에서 적는 ‘내 앱 공개 주소’ 하나뿐입니다.</li>
          <li>특정 교과 성취기준에 억지로 연결하지 않습니다.</li>
        </ul>
      </div>

      <p className="no-print">
        <button type="button" className="btn btn-primary btn-lg" onClick={() => go('s0')}>
          0단계부터 시작하기 →
        </button>
      </p>
    </>
  )
}
