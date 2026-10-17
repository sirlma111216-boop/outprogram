import type { ReactNode } from 'react'

/** 외부 링크는 새 탭 + noopener noreferrer. http/https 만 허용한다. */
export function ExtLink({ href, children }: { href: string; children?: ReactNode }) {
  const safe = /^https?:\/\//i.test(href) ? href : undefined
  if (!safe) return <span>{children ?? href}</span>
  return (
    <a href={safe} target="_blank" rel="noopener noreferrer" className="ext">
      {children ?? href}
      <span className="sr-only"> (새 탭에서 열림)</span>
      <span className="print-url"> ({safe})</span>
    </a>
  )
}
