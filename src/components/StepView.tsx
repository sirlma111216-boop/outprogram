import type { Step } from '../content/types'
import { CopyCard } from './CopyCard'
import { Extra } from './Extras'
import { ExtLink } from './ExtLink'

export function StepView({ step }: { step: Step }) {
  return (
    <>
      <p className="step-meta">
        <span className="pill">{step.num}단계</span>
        <span className="pill pill-time">약 {step.minutes}분</span>
      </p>
      <h2 className="section-title">{step.title}</h2>

      <div className="block goal">
        <h3>목표</h3>
        <p>{step.goal}</p>
      </div>

      <div className="block">
        <h3>작업할 사이트</h3>
        <ul className="sites">
          {step.sites.map((s, i) => (
            <li key={i}>
              {s.url ? <ExtLink href={s.url}>{s.label}</ExtLink> : <strong>{s.label}</strong>}
              {s.note && <span className="muted"> — {s.note}</span>}
              {s.menu && (
                <ol className="menu-path" aria-label={`${s.label} 메뉴 경로`}>
                  {s.menu.map((m, j) => (
                    <li key={j}>{m}</li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ul>
        {step.sites.some((s) => s.menu) && <p className="muted small">메뉴 경로는 화면 설명 도식입니다. 실제 화면의 이름·위치는 바뀔 수 있으니 같은 목적의 메뉴를 찾으세요.</p>}
        {step.docs && (
          <p className="docs">
            공식 문서:{' '}
            {step.docs.map((d, i) => (
              <span key={d.url}>
                {i > 0 && ' · '}
                <ExtLink href={d.url}>{d.label}</ExtLink>
              </span>
            ))}
          </p>
        )}
      </div>

      {step.extrasBefore?.map((k) => <Extra key={k} k={k} />)}

      <div className="block">
        <h3>절차</h3>
        <ol className="procedure">
          {step.procedure.map((p, i) =>
            typeof p === 'string' ? (
              <li key={i}>{p}</li>
            ) : (
              <li key={i}>
                {p.text}
                <ol>
                  {p.sub.map((x, j) => (
                    <li key={j}>{x}</li>
                  ))}
                </ol>
              </li>
            ),
          )}
        </ol>
      </div>

      {step.copies?.map((c) => <CopyCard key={c.id} item={c} />)}
      {step.extrasAfter?.map((k) => <Extra key={k} k={k} />)}

      {step.caution && (
        <div className="block caution" role="note">
          <h3>주의</h3>
          <ul>
            {step.caution.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid-2">
        <div className="block">
          <h3>예상 결과</h3>
          <ul>
            {step.expected.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
        <div className="block">
          <h3>직접 시험하기</h3>
          <ul>
            {step.tryIt.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="block">
        <h3>막혔을 때</h3>
        {step.stuck.map((s, i) => (
          <details key={i} className="stuck">
            <summary>{s.q}</summary>
            <p>{s.a}</p>
          </details>
        ))}
        <p className="muted small">여기에 없는 문제는 ‘오류 도움말’의 공통 복구 프롬프트를 사용하세요.</p>
      </div>

      <div className="block success">
        <h3>이 단계를 마치면</h3>
        <p>{step.success}</p>
      </div>
    </>
  )
}
