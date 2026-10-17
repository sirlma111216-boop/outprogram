import { HELP } from '../content/help'
import { RECOVERY_COMMON } from '../content/prompts'
import { CopyCard } from './CopyCard'

export function HelpView() {
  return (
    <>
      <h2 className="section-title">오류 도움말</h2>
      <p className="lead">증상을 고르고 확인 순서대로 살펴본 뒤, 해당 복구 프롬프트를 AI Studio에 붙여 넣습니다.</p>
      <div className="block caution" role="note">
        <h3>오류를 붙여 넣기 전에</h3>
        <p>오류 로그나 주소에 openapi.seoul.go.kr 이 들어 있으면, 그 안의 인증키 부분을 먼저 ●●●● 로 가립니다. 인증키는 AI 대화창에 넣지 않습니다.</p>
      </div>

      <CopyCard item={RECOVERY_COMMON} />

      <nav className="help-index no-print" aria-label="오류 목록">
        <ul>
          {HELP.map((h) => (
            <li key={h.id}>
              <a href={`#help-${h.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`help-${h.id}`)?.scrollIntoView({ behavior: 'smooth' }); (document.getElementById(`help-${h.id}`) as HTMLDetailsElement | null)?.setAttribute('open', '') }}>
                {h.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {HELP.map((h) => (
        <details key={h.id} id={`help-${h.id}`} className="help-item">
          <summary>{h.title}</summary>
          <p className="muted">언제: {h.when}</p>
          <h4>확인 순서</h4>
          <ol>
            {h.checks.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
          <CopyCard item={{ id: `help-${h.id}`, kind: 'prompt', title: `복구 프롬프트 — ${h.title}`, text: h.prompt, after: h.after }} />
        </details>
      ))}
    </>
  )
}
