import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { STEPS, TOTAL_STEP_MINUTES } from './content/steps'
import { StepView } from './components/StepView'
import { Overview } from './components/Overview'
import { HelpView } from './components/HelpView'
import { TeacherView } from './components/TeacherView'
import { AppUrlContext } from './appUrl'
import { loadAppUrl, saveAppUrl } from './storage'

type Section = { id: string; label: string; short: string; group: 'intro' | 'step' | 'ref' }

const SECTIONS: Section[] = [
  { id: 'intro', label: '연수 소개', short: '소개', group: 'intro' },
  ...STEPS.map((s) => ({ id: `s${s.num}`, label: s.title, short: `${s.num}단계`, group: 'step' as const })),
  { id: 'help', label: '오류 도움말', short: '도움말', group: 'ref' },
  { id: 'teacher', label: '강사용 안내', short: '강사용', group: 'ref' },
]
const IDS = SECTIONS.map((s) => s.id)

function readHash(): string {
  const h = window.location.hash.replace(/^#/, '')
  return IDS.includes(h) ? h : 'intro'
}

export default function App() {
  const [current, setCurrent] = useState<string>(readHash)
  const [tocOpen, setTocOpen] = useState(false)
  const initial = useMemo(loadAppUrl, [])
  const [appUrl, setAppUrlState] = useState(initial.value)
  const [storageOk, setStorageOk] = useState(initial.ok)
  const headingRefs = useRef<Record<string, HTMLElement | null>>({})
  const firstRender = useRef(true)

  const setAppUrl = useCallback((v: string) => {
    setAppUrlState(v)
    const ok = saveAppUrl(v)
    if (!ok) setStorageOk(false)
    return ok
  }, [])

  const go = useCallback((id: string) => {
    if (!IDS.includes(id)) return
    if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`)
    setCurrent(id)
    setTocOpen(false)
  }, [])

  useEffect(() => {
    const onHash = () => setCurrent(readHash())
    window.addEventListener('popstate', onHash)
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('popstate', onHash)
      window.removeEventListener('hashchange', onHash)
    }
  }, [])

  // 단계를 옮기면 맨 위로, 제목에 포커스 (첫 화면은 제외)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    window.scrollTo({ top: 0 })
    const el = headingRefs.current[current]?.querySelector<HTMLElement>('.section-title')
    if (el) {
      el.setAttribute('tabindex', '-1')
      el.focus({ preventScroll: true })
    }
  }, [current])

  // 전체 인쇄: 접힌 내용까지 모두 펼친 뒤 인쇄하고 원래대로 되돌린다
  useEffect(() => {
    let opened: HTMLDetailsElement[] = []
    const before = () => {
      opened = Array.from(document.querySelectorAll<HTMLDetailsElement>('details:not([open])'))
      opened.forEach((d) => (d.open = true))
      document.body.classList.add('printing')
    }
    const after = () => {
      opened.forEach((d) => (d.open = false))
      opened = []
      document.body.classList.remove('printing')
    }
    window.addEventListener('beforeprint', before)
    window.addEventListener('afterprint', after)
    return () => {
      window.removeEventListener('beforeprint', before)
      window.removeEventListener('afterprint', after)
    }
  }, [])

  const idx = IDS.indexOf(current)
  const prev = idx > 0 ? SECTIONS[idx - 1] : null
  const next = idx < SECTIONS.length - 1 ? SECTIONS[idx + 1] : null

  function showPreview() {
    go('intro')
    window.setTimeout(() => document.querySelector('.preview')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 30)
  }

  const renderSection = (s: Section) => {
    if (s.id === 'intro') return <Overview go={go} />
    if (s.id === 'help') return <HelpView />
    if (s.id === 'teacher') return <TeacherView />
    const step = STEPS.find((x) => `s${x.num}` === s.id)!
    return <StepView step={step} />
  }

  return (
    <AppUrlContext.Provider value={{ appUrl, setAppUrl, storageOk }}>
      <a className="skip" href="#main" onClick={(e) => { e.preventDefault(); document.getElementById('main')?.focus() }}>
        본문으로 건너뛰기
      </a>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <p className="eyebrow">교사 연수 · 단계별 실습 강의안</p>
            <h1>학교 밖 공공시설·프로그램 찾기 만들기</h1>
          </div>
          <ul className="meta-chips" aria-label="연수 개요">
            <li><b>대상</b> 교사(코딩 경험 없어도 됨)</li>
            <li><b>준비물</b> 노트북 · 4개 서비스 계정</li>
            <li><b>소요시간</b> 단계 합계 {TOTAL_STEP_MINUTES}분 (두 차시 권장)</li>
          </ul>
          <div className="top-actions no-print">
            <button type="button" className="btn" onClick={showPreview}>완성 모습 보기</button>
            <button type="button" className="btn btn-primary" onClick={() => window.print()}>전체 인쇄</button>
          </div>
        </div>
        {!storageOk && (
          <p className="storage-warn no-print" role="status">
            이 브라우저는 저장이 막혀 있습니다. 내 앱 공개 주소 기록만 유지되지 않을 뿐, 읽기·복사·단계 이동은 그대로 됩니다.
          </p>
        )}
      </header>

      <div className="layout">
        <nav className="toc no-print" aria-label="단계 목차">
          <button type="button" className="btn toc-toggle" aria-expanded={tocOpen} aria-controls="toc-list" onClick={() => setTocOpen((o) => !o)}>
            목차 {tocOpen ? '닫기' : '열기'} <span className="muted">— 지금: {SECTIONS[idx].short} {SECTIONS[idx].group === 'step' ? SECTIONS[idx].label : ''}</span>
          </button>
          <ol id="toc-list" className={tocOpen ? 'open' : ''}>
            {SECTIONS.map((s) => (
              <li key={s.id} className={`toc-${s.group}`}>
                <a href={`#${s.id}`} aria-current={s.id === current ? 'step' : undefined} onClick={(e) => { e.preventDefault(); go(s.id) }}>
                  {s.group === 'step' && <span className="toc-num">{s.short}</span>}
                  <span className="toc-label">{s.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main id="main" tabIndex={-1}>
          {SECTIONS.map((s) => (
            <article
              key={s.id}
              id={`sec-${s.id}`}
              ref={(el) => { headingRefs.current[s.id] = el }}
              className={`section ${s.id === current ? 'is-current' : 'is-hidden'}`}
              aria-hidden={s.id === current ? undefined : true}
            >
              {renderSection(s)}
            </article>
          ))}

          <nav className="pager no-print" aria-label="이전·다음">
            {prev ? (
              <button type="button" className="btn pager-btn" onClick={() => go(prev.id)}>
                <small>← 이전</small>
                <span>{prev.group === 'step' ? `${prev.short} ${prev.label}` : prev.label}</span>
              </button>
            ) : <span />}
            {next ? (
              <button type="button" className="btn btn-primary pager-btn next" onClick={() => go(next.id)}>
                <small>다음 →</small>
                <span>{next.group === 'step' ? `${next.short} ${next.label}` : next.label}</span>
              </button>
            ) : <span />}
          </nav>
        </main>
      </div>

      <footer className="foot">
        <p>데이터 출처: 서울 열린데이터광장 ‘서울시 공공서비스예약(종합) 정보’(OA-20497). 2026-10-16 확인 명세 기준. 이 강의안은 공공 API를 호출하지 않으며 인증키를 받지 않습니다.</p>
      </footer>
    </AppUrlContext.Provider>
  )
}
