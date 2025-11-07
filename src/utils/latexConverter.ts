/**
 * utils/latexConverter.ts — Luckysheet sheet data → LaTeX (tabular/tabularx) transformer.
 */
import type { LuckysheetCell, LuckysheetRow, LuckysheetSheet, TableEnvironment } from '@/types/luckysheet'
import type { SheetSelectionBounds } from './luckysheetClient'

const LATEX_ESCAPE_MAP: Record<string, string> = {
  '&': '\\&',
  '%': '\\%',
  '$': '\\$',
  '#': '\\#',
  '_': '\\_',
  '{': '\\{',
  '}': '\\}',
  '~': '\\textasciitilde{}',
  '^': '\\textasciicircum{}',
  '\\': '\\textbackslash{}',
}

const escapeLatex = (value: string): string =>
  value
    .replace(/[\u00A5\uFFE5]/g, '\\')
    .replace(/\\/g, '\\\\')
    .replace(/([&%$#_{}~^])/g, (match) => LATEX_ESCAPE_MAP[match])
    .replace(/\r?\n/g, ' \\ ')

const buildColumnTemplate = (columnCount: number, alignment: string): string => {
  const token = alignment.trim() || 'c'
  const columns = Array.from({ length: columnCount }, () => token).join('|')
  return `|${columns}|`
}

const coerceValue = (cell?: LuckysheetCell): string => {
  const raw = cell?.m ?? cell?.v
  if (raw === null || raw === undefined || raw === '') {
    return '~'
  }

  return escapeLatex(String(raw))
}

interface RenderContext {
  rowIndex: number
  colIndex: number
  skipSameRow: Set<string>
  skipRowSpan: Set<string>
}

const registerMergedCells = (ctx: RenderContext, rowSpan: number, colSpan: number): void => {
  for (let rowOffset = 0; rowOffset < rowSpan; rowOffset += 1) {
    for (let colOffset = 0; colOffset < colSpan; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue
      }
      const key = `${ctx.rowIndex + rowOffset}:${ctx.colIndex + colOffset}`
      if (rowOffset === 0) {
        ctx.skipSameRow.add(key)
      } else {
        ctx.skipRowSpan.add(key)
      }
    }
  }
}

const renderCell = (
  ctx: RenderContext,
  cell: LuckysheetCell | undefined,
  activeMultiRows: number[],
  effectiveColStart: number,
): string => {
  const merge = cell?.mc
  const baseValue = coerceValue(cell)
  const rowSpan = merge?.rs ?? 1
  const colSpan = merge?.cs ?? 1

  if (merge) {
    registerMergedCells(ctx, rowSpan, colSpan)
  }

  let content = baseValue

  if (colSpan > 1) {
    content = `\\multicolumn{${colSpan}}{|c|}{${content}}`
  }

  if (rowSpan > 1) {
    content = `\\multirow{${rowSpan}}{*}{${content}}`
    const startIndex = Math.max(0, ctx.colIndex - effectiveColStart)
    for (let offset = 0; offset < colSpan; offset += 1) {
      const col = startIndex + offset
      activeMultiRows[col] = Math.max(activeMultiRows[col], rowSpan - 1)
    }
  }

  return content
}

export interface LatexOptions {
  environment: TableEnvironment
  columnAlignment: string
  selection?: SheetSelectionBounds | null
}

const buildEmptyRow = (columnCount: number): string => `\\multicolumn{${columnCount}}{|c|}{~}`

const hasCellContent = (cell?: LuckysheetCell): boolean => {
  if (!cell) {
    return false
  }
  const value = cell.m ?? cell.v
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value === 'string' && value.trim() === '') {
    return false
  }
  return true
}

const detectUsedBounds = (rows: (LuckysheetRow | undefined)[]): SheetSelectionBounds | null => {
  let minRow = Number.POSITIVE_INFINITY
  let maxRow = Number.NEGATIVE_INFINITY
  let minCol = Number.POSITIVE_INFINITY
  let maxCol = Number.NEGATIVE_INFINITY

  rows.forEach((row, rowIndex) => {
    if (!row) {
      return
    }

    row.forEach((cell: LuckysheetCell | undefined, colIndex: number) => {
      if (hasCellContent(cell)) {
        minRow = Math.min(minRow, rowIndex)
        maxRow = Math.max(maxRow, rowIndex)
        minCol = Math.min(minCol, colIndex)
        maxCol = Math.max(maxCol, colIndex)
      }
    })
  })

  if (!Number.isFinite(minRow) || !Number.isFinite(minCol)) {
    return null
  }

  return {
    startRow: minRow,
    endRow: maxRow,
    startCol: minCol,
    endCol: maxCol,
  }
}

export const convertSheetsToLatex = (
  sheets: LuckysheetSheet[],
  options: Partial<LatexOptions> = {},
): string => {
  const sheet = sheets?.[0]
  const environment: TableEnvironment = options.environment ?? 'tabular'
  const rows = sheet?.data ?? []
  const totalRows = Math.max(sheet?.row ?? rows.length, rows.length)
  const totalColumns = Math.max(
    sheet?.column ?? 0,
    ...(rows.map((row) => row?.length ?? 0) ?? []),
  )
  const detectedBounds = detectUsedBounds(rows)
  const selection = options.selection ?? detectedBounds

  const rowStart = selection ? Math.min(selection.startRow, totalRows - 1) : 0
  const rowEnd = selection ? Math.min(selection.endRow, totalRows - 1) : totalRows - 1
  const colStart = selection ? Math.min(selection.startCol, totalColumns - 1) : 0
  const colEnd = selection ? Math.min(selection.endCol, totalColumns - 1) : totalColumns - 1

  const effectiveRowStart = Math.max(0, rowStart)
  const effectiveRowEnd = Math.max(effectiveRowStart, rowEnd)
  const effectiveColStart = Math.max(0, colStart)
  const effectiveColEnd = Math.max(effectiveColStart, colEnd)

  const columnCount = Math.max(1, effectiveColEnd - effectiveColStart + 1)
  const columnAlignment = options.columnAlignment ?? 'c'
  const columnTemplate = buildColumnTemplate(columnCount, columnAlignment)
  const beginLine =
    environment === 'tabularx'
      ? `\\begin{tabularx}{\\linewidth}{${columnTemplate}}`
      : `\\begin{tabular}{${columnTemplate}}`

  if (!sheet || rows.length === 0 || totalRows === 0) {
    return [
      beginLine,
      '\\hline',
      `${buildEmptyRow(columnCount)} \\\\`,
      '\\hline',
      `\\end{${environment}}`,
    ].join('\n')
  }

  const lines: string[] = [beginLine, '\\hline']
  const skipSameRow = new Set<string>()
  const skipRowSpan = new Set<string>()
  const activeMultiRows = new Array(columnCount).fill(0)
  for (let rowIndex = effectiveRowStart; rowIndex <= effectiveRowEnd; rowIndex += 1) {
    const row = rows[rowIndex] ?? []
    const cells: string[] = []

    for (let colIndex = effectiveColStart; colIndex <= effectiveColEnd; colIndex += 1) {
      const key = `${rowIndex}:${colIndex}`
      if (skipRowSpan.has(key)) {
        cells.push(' ')
        continue
      }
      if (skipSameRow.has(key)) {
        continue
      }
      const cell = row[colIndex]
      const ctx: RenderContext = { rowIndex, colIndex, skipSameRow, skipRowSpan }
      cells.push(renderCell(ctx, cell, activeMultiRows, effectiveColStart))
    }

    const line = cells.length ? cells.join(' & ') : buildEmptyRow(columnCount)
    lines.push(`${line} \\\\`)
    const hasActive = activeMultiRows.some((count) => count > 0)
    if (hasActive) {
      const clineSegments: Array<{ start: number; end: number }> = []
      let segmentStart: number | null = null
      for (let i = 0; i < columnCount; i += 1) {
        if (activeMultiRows[i] === 0) {
          if (segmentStart === null) {
            segmentStart = i + 1
          }
        } else if (segmentStart !== null) {
          clineSegments.push({ start: segmentStart, end: i })
          segmentStart = null
        }
      }
      if (segmentStart !== null) {
        clineSegments.push({ start: segmentStart, end: columnCount })
      }

      const clineLine = clineSegments
        .map(({ start, end }) => `\\cline{${start}-${end}}`)
        .join(' ')

      lines.push(clineLine || '')
    } else {
      lines.push('\\hline')
    }
    for (let i = 0; i < columnCount; i += 1) {
      if (activeMultiRows[i] > 0) {
        activeMultiRows[i] -= 1
      }
    }
  }

  lines.push(`\\end{${environment}}`)

  return lines.join('\n')
}
