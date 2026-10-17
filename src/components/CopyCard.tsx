import { useEffect, useId, useRef, useState } from 'react'
import type { CopyItem } from '../content/types'

type Status = { kind: 'idle' | 'ok' | 'fail'; msg: string }

async function writeClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* 아래 대안으로 */
  }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

const KIND_LABEL: Record<CopyItem['kind'], string> = { prompt: '복사 프롬프트', config: '설정 파일', text: '복사용 글' }

export function CopyCard({ item }: { item: CopyItem }) {
  const [wrap, setWrap] = useState(true)
  const [open, setOpen] = useState(item.text.length < 700)
  const [manual, setManual] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: 'idle', msg: '' })
  const manualRef = useRef<HTMLTextAreaElement>(null)
  const bodyId = useId()
  const lines = item.text.split('\n').length

  useEffect(() => {
    if (manual && manualRef.current) {
      manualRef.current.focus()
      manualRef.current.select()
    }
  }, [manual])

  async function copy() {
    const ok = await writeClipboard(item.text)
    if (ok) setStatus({ kind: 'ok', msg: `복사했습니다. (${item.text.length.toLocaleString()}자, ${lines}줄) 붙여 넣을 곳에서 Ctrl+V(맥은 ⌘+V)를 누르세요.` })
    else {
      setStatus({ kind: 'fail', msg: '자동 복사가 막혔습니다. 아래 상자에 전체가 선택되어 있으니 Ctrl+C(맥은 ⌘+C)로 복사하세요.' })
      setManual(true)
    }
  }

  return (
    <section className={`copy-card kind-${item.kind}`} aria-label={item.title}>
      <header className="copy-head">
        <div>
          <span className="copy-kind">{KIND_LABEL[item.kind]}</span>
          <h4 className="copy-title">{item.title}</h4>
          {item.intro && <p className="copy-intro">{item.intro}</p>}
        </div>
        <div className="copy-actions no-print">
          <button type="button" className="btn btn-primary" onClick={copy}>
            전문 복사
          </button>
          <button type="button" className="btn" aria-pressed={wrap} onClick={() => setWrap((w) => !w)}>
            줄바꿈 {wrap ? '켜짐' : '꺼짐'}
          </button>
          <button type="button" className="btn" aria-expanded={open} aria-controls={bodyId} onClick={() => setOpen((o) => !o)}>
            {open ? '접기' : '펼치기'}
          </button>
          <button type="button" className="btn btn-ghost" aria-expanded={manual} onClick={() => setManual((m) => !m)}>
            직접 선택해 복사
          </button>
        </div>
      </header>
      <div className="copy-status no-print" role="status" aria-live="polite">
        {status.kind !== 'idle' && <p className={`status-${status.kind}`}>{status.msg}</p>}
      </div>
      {manual && (
        <div className="manual no-print">
          <label htmlFor={`${bodyId}-m`}>전체 선택된 상태입니다. Ctrl+C(맥은 ⌘+C)로 복사하세요.</label>
          <textarea id={`${bodyId}-m`} ref={manualRef} readOnly value={item.text} rows={Math.min(14, lines + 2)} onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}
      <div id={bodyId} className={`copy-body ${open ? 'is-open' : 'is-closed'}`}>
        <pre className={wrap ? 'wrap' : 'nowrap'} tabIndex={0} aria-label={`${item.title} 전문`}>
          {item.text}
        </pre>
        {!open && (
          <button type="button" className="fade-more no-print" onClick={() => setOpen(true)} aria-controls={bodyId}>
            전체 {lines}줄 펼치기
          </button>
        )}
      </div>
      {item.after && <p className="copy-after">{item.after}</p>}
    </section>
  )
}
