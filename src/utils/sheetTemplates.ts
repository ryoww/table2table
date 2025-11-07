/**
 * utils/sheetTemplates.ts — provides the starter Luckysheet payload used on boot.
 */
import { TABLE_CONFIG } from '@/config/config'
import type { LuckysheetCell, LuckysheetRow, LuckysheetSheet } from '@/types/luckysheet'

const HEADER_BG = TABLE_CONFIG.headerBg

export const buildDefaultSheet = (): LuckysheetSheet => {
  const rows = TABLE_CONFIG.initialRows
  const cols = TABLE_CONFIG.initialColumns
  const grid: LuckysheetRow[] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => undefined as LuckysheetCell | undefined),
  )

  TEMPLATE_DATA.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (rIdx < rows && cIdx < cols) {
        grid[rIdx][cIdx] = cell
      }
    })
  })

  return {
    name: TABLE_CONFIG.defaultSheetName,
    data: grid,
    row: rows,
    column: cols,
  }
}

const TEMPLATE_DATA: LuckysheetRow[] = [
  [
    { v: '項目', m: '項目', bg: HEADER_BG },
    { v: '数値', m: '数値', bg: HEADER_BG },
    { v: '備考', m: '備考', bg: HEADER_BG },
  ],
  [
    { v: 'サンプルA', m: 'サンプルA' },
    { v: 42, m: '42' },
    { v: 'マージして遊んでください', m: 'マージして遊んでください' },
  ],
  [
    { v: 'サンプルB', m: 'サンプルB' },
    { v: 13, m: '13' },
    { v: 'セルを結合すると LaTeX に反映されます', m: 'セルを結合すると LaTeX に反映されます' },
  ],
]
