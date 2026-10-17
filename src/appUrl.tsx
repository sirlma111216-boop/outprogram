import { createContext, useContext } from 'react'

export type AppUrlState = {
  appUrl: string
  setAppUrl: (v: string) => boolean
  storageOk: boolean
}

export const AppUrlContext = createContext<AppUrlState>({ appUrl: '', setAppUrl: () => false, storageOk: true })
export const useAppUrl = () => useContext(AppUrlContext)
