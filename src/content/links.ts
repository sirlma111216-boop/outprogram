import type { Link } from './types'

export const L = {
  data: { label: '서울시 공공서비스예약(종합) 정보 OA-20497', url: 'https://data.seoul.go.kr/dataList/OA-20497/S/1/datasetView.do' },
  seoulGuide: { label: '서울 열린데이터광장 Open API 이용 안내', url: 'https://data.seoul.go.kr/together/guide/useGuide.do' },
  seoulHome: { label: '서울 열린데이터광장', url: 'https://data.seoul.go.kr/' },
  aiStudio: { label: 'Google AI Studio', url: 'https://aistudio.google.com/' },
  aiStudioDoc: { label: 'AI Studio Build 모드 안내', url: 'https://ai.google.dev/gemini-api/docs/aistudio-build-mode' },
  github: { label: 'GitHub', url: 'https://github.com/' },
  githubNew: { label: 'GitHub 새 저장소 만들기', url: 'https://github.com/new' },
  cfDash: { label: 'Cloudflare 대시보드', url: 'https://dash.cloudflare.com/' },
  cfReact: { label: 'Cloudflare Pages React 배포 안내', url: 'https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/' },
  cfFunctions: { label: 'Cloudflare Pages Functions', url: 'https://developers.cloudflare.com/pages/functions/' },
  cfSecrets: { label: 'Pages Functions Secrets', url: 'https://developers.cloudflare.com/pages/functions/bindings/#secrets' },
  cfCompat: { label: '호환성 플래그 설정', url: 'https://developers.cloudflare.com/workers/configuration/compatibility-flags/' },
  osmTiles: { label: 'OpenStreetMap 타일 사용 조건', url: 'https://operations.osmfoundation.org/policies/tiles/' },
  osmCopyright: { label: 'OpenStreetMap 저작권', url: 'https://www.openstreetmap.org/copyright' },
} satisfies Record<string, Link>

export const ALL_DOCS: { group: string; links: Link[] }[] = [
  { group: '데이터', links: [L.data, L.seoulGuide] },
  { group: '제작', links: [L.aiStudioDoc] },
  { group: '배포', links: [L.cfReact, L.cfFunctions, L.cfSecrets, L.cfCompat] },
  { group: '지도', links: [L.osmTiles, L.osmCopyright] },
]
