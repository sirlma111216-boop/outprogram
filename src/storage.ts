/**
 * 강의안이 브라우저에 저장하는 값은 ‘내 앱 공개 주소’ 하나뿐이다.
 * 같은 기기·같은 브라우저에서만 복원된다. 저장이 막혀도 읽기·복사·이동은 그대로 된다.
 */
const KEY = 'spsf-guide:v1:appUrl'

export function loadAppUrl(): { value: string; ok: boolean } {
  try {
    return { value: window.localStorage.getItem(KEY) ?? '', ok: true }
  } catch {
    return { value: '', ok: false }
  }
}

export function saveAppUrl(v: string): boolean {
  try {
    if (v) window.localStorage.setItem(KEY, v)
    else window.localStorage.removeItem(KEY)
    return true
  } catch {
    return false
  }
}

/** 공개 주소 검사: https 이고 경로·검색어가 없는 주소만 받는다. 키처럼 보이는 긴 경로를 막는다. */
export function normalizeAppUrl(raw: string): { url: string | null; warn?: string; error?: string } {
  const s = raw.trim()
  if (!s) return { url: null }
  let u: URL
  try {
    u = new URL(s)
  } catch {
    return { url: null, error: 'https:// 로 시작하는 주소 전체를 넣어 주세요.' }
  }
  if (u.protocol !== 'https:') return { url: null, error: 'https:// 로 시작하는 공개 주소만 기록합니다.' }
  if (u.hostname === 'dash.cloudflare.com') return { url: null, error: '이 주소는 Cloudflare 대시보드입니다. 앱의 공개 주소(…pages.dev)를 넣어 주세요.' }
  if (u.hostname.includes('seoul.go.kr')) return { url: null, error: '서울시 원천 API 주소는 기록하지 않습니다. 내 앱의 공개 주소를 넣어 주세요.' }
  if (u.search || u.hash || (u.pathname !== '/' && u.pathname !== ''))
    return { url: null, error: '경로나 ? 뒤의 내용 없이 주소의 앞부분(https://프로젝트명.pages.dev)만 넣어 주세요.' }
  const url = u.origin
  const warn = u.hostname.endsWith('.pages.dev') ? undefined : 'pages.dev 주소가 아닙니다. 직접 연결한 도메인이라면 그대로 두어도 됩니다.'
  return { url, warn }
}
