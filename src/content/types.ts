export type Link = { label: string; url: string }

/** 작업할 사이트. menu 는 실제 스크린샷 대신 보여 주는 메뉴 경로 도식이다. */
export type Site = { label: string; url?: string; menu?: string[]; note?: string }

export type CopyItem = {
  id: string
  title: string
  /** prompt: AI Studio 에 붙여 넣는 글 / config: 파일 내용 / text: 그 밖의 복사용 글 */
  kind: 'prompt' | 'config' | 'text'
  /** 파일 이름 등 카드 위에 보이는 짧은 안내 */
  intro?: string
  text: string
  /** 카드를 붙여 넣은 뒤 이어서 할 일 (카드 밖에 보인다) */
  after?: string
}

export type ExtraKey =
  | 'twoProducts'
  | 'scenario'
  | 'keyTimeline'
  | 'apiAnatomy'
  | 'resultCodes'
  | 'fieldTable'
  | 'samples'
  | 'flow'
  | 'fileTree'
  | 'repoTree'
  | 'zipFallback'
  | 'buildSettings'
  | 'appUrl'
  | 'diagnoseOrder'
  | 'instructorLocal'
  | 'counts'
  | 'periods'
  | 'mapRules'
  | 'memoRules'
  | 'shareRules'
  | 'finalChecks'
  | 'cacheExplain'
  | 'urlRecord'
  | 'designPick'

export type ProcItem = string | { text: string; sub: string[] }

export type Step = {
  num: number
  title: string
  minutes: number
  goal: string
  sites: Site[]
  docs?: Link[]
  procedure: ProcItem[]
  extrasBefore?: ExtraKey[]
  copies?: CopyItem[]
  extrasAfter?: ExtraKey[]
  expected: string[]
  tryIt: string[]
  stuck: { q: string; a: string }[]
  success: string
  caution?: string[]
}

export type HelpItem = {
  id: string
  title: string
  when: string
  checks: string[]
  prompt: string
  after: string
}
