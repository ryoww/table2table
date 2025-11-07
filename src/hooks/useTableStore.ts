/**
 * hooks/useTableStore.ts — central Zustand store for LaTeX state and sheet actions.
 */
import { create } from 'zustand'

import { TABLE_CONFIG } from '@/config/config'
import type { TableEnvironment } from '@/types/luckysheet'

interface TableState {
  latex: string
  environment: TableEnvironment
  columnAlignment: string
  isGenerating: boolean
  rebuildVersion: number
  lastGeneratedAt?: number
  setLatex: (value: string) => void
  setEnvironment: (value: TableEnvironment) => void
  setColumnAlignment: (value: string) => void
  setIsGenerating: (flag: boolean) => void
  markGenerated: () => void
  bumpRebuild: () => void
}

const useTableStore = create<TableState>((set) => ({
  latex: '',
  environment: TABLE_CONFIG.latexEnvironment,
  columnAlignment: TABLE_CONFIG.columnAlignment,
  isGenerating: false,
  rebuildVersion: 0,
  lastGeneratedAt: undefined,
  setLatex: (value) => set({ latex: value }),
  setEnvironment: (value) => set({ environment: value }),
  setColumnAlignment: (value) => set({ columnAlignment: value }),
  setIsGenerating: (flag) => set({ isGenerating: flag }),
  markGenerated: () => set({ lastGeneratedAt: Date.now() }),
  bumpRebuild: () =>
    set((state) => ({
      rebuildVersion: state.rebuildVersion + 1,
      latex: '',
      lastGeneratedAt: undefined,
    })),
}))

export default useTableStore
