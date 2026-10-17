import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 강의안은 정적 사이트다. 서버 함수·환경변수·공공 API 호출이 없다.
export default defineConfig({
  base: '/',
  plugins: [react()],
  // modulePreload 보조 코드(fetch)를 끄면 번들 안에 네트워크 요청 코드가 남지 않는다.
  build: { outDir: 'dist', modulePreload: { polyfill: false } },
})
