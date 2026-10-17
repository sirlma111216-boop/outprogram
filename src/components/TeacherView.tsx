import { ALL_DOCS } from '../content/links'
import { ExtLink } from './ExtLink'

export function TeacherView() {
  return (
    <>
      <h2 className="section-title">강사용 — 강의안 배포와 연수 전 확인</h2>

      <div className="block">
        <h3>이 강의안 페이지를 배포하는 방법</h3>
        <ol className="procedure">
          <li>이 강의안 코드는 참가자 앱과 다른 저장소 <code>school-public-space-finder-workshop-guide</code>에 저장합니다.</li>
          <li>Cloudflare 대시보드에서 Workers &amp; Pages → Create application → Pages → Import an existing Git repository로 이 저장소를 연결합니다.</li>
          <li>빌드 명령 <code>npm run build</code>, 출력 폴더 <code>dist</code>, 환경변수는 넣지 않습니다.</li>
          <li>배포가 끝나면 발급된 공개 강의안 주소를 참가자에게 전달합니다.</li>
        </ol>
        <p className="muted">참가자 앱용 functions·Secret 설정은 강의안 안에서 복사해 갈 실습 내용일 뿐, 강의안 자체의 서버 기능으로 설치하지 않습니다. 강의안에는 키 입력 폼이나 공공 API 실시간 테스트가 없습니다.</p>
      </div>

      <div className="block">
        <h3>연수 전 강사 확인</h3>
        <ul>
          <li>별도의 참가자 앱 시험본을 미리 만들어 실제 키로 API·Cloudflare 연결을 확인합니다.</li>
          <li>sample 5건과 문서 확인만으로 실제 키의 페이지 처리·호스팅 통신 성공을 단정하지 않습니다.</li>
          <li>AI Studio·GitHub·Cloudflare·getdesign.md의 메뉴 이름과 이용 조건이 강의안 설명과 같은지 확인합니다.</li>
          <li>무료 요금제 한도와 서울시 API 사용 조건을 공식 문서에서 다시 확인합니다.</li>
          <li>2026-10-16에 확인한 명세를 기준으로 했습니다. 바뀐 항목은 공식 자료와 실제 응답을 대조해 기록합니다.</li>
        </ul>
      </div>

      <div className="block caution" role="note">
        <h3>API 장애가 났을 때</h3>
        <p>명시적 가상 모드로 화면 실습을 계속하고, 실제 연결 단계는 미완료로 남깁니다. “가상 자료로 대체했으니 API 연결 성공”이라고 설명하지 않습니다.</p>
      </div>

      <div className="block">
        <h3>공식 문서 모음</h3>
        {ALL_DOCS.map((g) => (
          <div key={g.group} className="doc-group">
            <h4>{g.group}</h4>
            <ul>
              {g.links.map((l) => (
                <li key={l.url}>
                  <ExtLink href={l.url}>{l.label}</ExtLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="doc-group">
          <h4>디자인</h4>
          <ul>
            <li><ExtLink href="https://getdesign.md/">getdesign.md — DESIGN.md 모음</ExtLink></li>
          </ul>
        </div>
      </div>
    </>
  )
}
