/**
 * utils/__tests__/latexConverter.test.ts — guards the Luckysheet → LaTeX conversion logic.
 */
import { describe, expect, it } from 'vitest'

import { convertSheetsToLatex } from '@/utils/latexConverter'
import type { LuckysheetSheet } from '@/types/luckysheet'

const buildSheet = (data: LuckysheetSheet['data']): LuckysheetSheet => ({
  name: 'Test',
  row: data?.length ?? 0,
  column: data?.[0]?.length ?? 0,
  data,
})

describe('convertSheetsToLatex', () => {
  it('creates a basic tabular environment when data exists', () => {
    const sheet = buildSheet([
      [
        { m: 'A' },
        { m: 'B & C' },
      ],
      [
        { v: '1' },
        { v: '2' },
      ],
    ])

    const latex = convertSheetsToLatex([sheet], { environment: 'tabular', columnAlignment: 'c' })

    expect(latex).toContain('\\begin{tabular}')
    expect(latex).toContain('A & B \\& C')
    expect(latex).toContain('1 & 2')
  })

  it('outputs multirow and multicolumn directives for merged cells', () => {
    const sheet = buildSheet([
      [
        { m: 'Header', mc: { r: 0, c: 0, rs: 2, cs: 2 } },
        undefined,
      ],
      [undefined, undefined],
      [
        { m: 'Tail' },
        { m: 'Value' },
      ],
    ])

    const latex = convertSheetsToLatex([sheet], { environment: 'tabular', columnAlignment: 'c' })

    expect(latex).toContain('\\multirow{2}{*}{\\multicolumn{2}{|c|}{Header}}')
    expect(latex).toContain('Tail & Value')
  })

  it('limits output to the provided selection bounds', () => {
    const sheet = buildSheet([
      [{ m: 'A1' }, { m: 'B1' }, { m: 'C1' }],
      [{ m: 'A2' }, { m: 'B2' }, { m: 'C2' }],
      [{ m: 'A3' }, { m: 'B3' }, { m: 'C3' }],
    ])

    const latex = convertSheetsToLatex([sheet], {
      environment: 'tabular',
      columnAlignment: 'c',
      selection: { startRow: 1, endRow: 2, startCol: 0, endCol: 1 },
    })

    expect(latex).not.toContain('A1')
    expect(latex).toContain('A2 & B2')
    expect(latex).toContain('A3 & B3')
    expect(latex).not.toContain('C2')
  })

  it('converts yen signs to backslashes', () => {
    const sheet = buildSheet([
      [
        { m: '￥' },
        { m: '¥' },
      ],
    ])

    const latex = convertSheetsToLatex([sheet], {
      environment: 'tabular',
      columnAlignment: 'c',
    })

    expect(latex).toContain('\\\\ & \\\\')
  })

  it('auto-detects used bounds when no selection provided', () => {
    const sheet = buildSheet([
      [],
      [
        undefined,
        { m: 'Only cell' },
      ],
      [],
    ])

    const latex = convertSheetsToLatex([sheet], {
      environment: 'tabular',
      columnAlignment: 'c',
    })

    expect(latex).not.toContain('~')
    expect(latex).toContain('Only cell')
  })
})
