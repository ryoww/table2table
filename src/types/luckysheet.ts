/**
 * types/luckysheet.ts — lightweight Luckysheet models used throughout the app.
 */
type JQueryStatic = typeof import('jquery')
export interface LuckysheetMergeConfig {
  r: number
  c: number
  rs?: number
  cs?: number
}

export interface LuckysheetCell {
  m?: string
  v?: string | number | null
  bg?: string
  mc?: LuckysheetMergeConfig
}

export type LuckysheetRow = Array<LuckysheetCell | undefined>

export interface LuckysheetSheet {
  name: string
  index?: string
  row: number
  column: number
  order?: number
  data?: LuckysheetRow[]
  config?: Record<string, unknown>
  cellRightBottom?: Record<string, unknown>
}

export type TableEnvironment = 'tabular' | 'tabularx'

export interface LuckysheetAPI {
  create: (options: Record<string, unknown>) => void
  destroy?: () => void
  refresh?: () => void
  getAllSheets?: () => LuckysheetSheet[]
  getRange?: () => Array<{
    row: [number, number]
    column: [number, number]
    row_focus?: number
    column_focus?: number
  }>
}

declare global {
  interface Window {
    luckysheet?: LuckysheetAPI
    jQuery?: JQueryStatic
    $?: JQueryStatic
  }
}

export {} // ensures this file is treated as a module
