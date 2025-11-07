/**
 * utils/luckysheetClient.ts — thin helpers to dynamically load Luckysheet in the browser.
 */
import type { LuckysheetAPI, LuckysheetSheet } from '@/types/luckysheet'

type JQueryStatic = typeof import('jquery')

let cachedLuckysheet: LuckysheetAPI | null = null
export interface SheetSelectionBounds {
  startRow: number
  endRow: number
  startCol: number
  endCol: number
}

const ensureJQuery = async (): Promise<JQueryStatic> => {
  if (typeof window === 'undefined') {
    throw new Error('jQuery requires a browser runtime')
  }

  if (window.jQuery) {
    return window.jQuery
  }

  const jqueryModule = await import('jquery')
  const jQueryInstance = (jqueryModule.default ?? jqueryModule) as JQueryStatic
  window.jQuery = jQueryInstance
  window.$ = jQueryInstance
  return jQueryInstance
}

const ensureMousewheel = (jq: JQueryStatic): void => {
  const target = jq ?? window.jQuery ?? window.$
  if (!target?.fn) {
    return
  }

  const prototype = target.fn as Record<string, any>

  if (typeof prototype.mousewheel === 'function') {
    return
  }

  // Provide a minimal fallback using the standard wheel event.
  prototype.mousewheel = function mousewheelPolyfill(
    this: any,
    handler?: (event: WheelEvent, originalEvent: WheelEvent) => void,
  ) {
    return this.on?.('wheel', function onWheel(this: any, event: WheelEvent) {
      handler?.call(this, event, event)
    })
  }
}

export const loadLuckysheet = async (): Promise<LuckysheetAPI> => {
  if (cachedLuckysheet) {
    return cachedLuckysheet
  }

  if (typeof window === 'undefined') {
    throw new Error('Luckysheet can only be loaded in the browser')
  }

  const jq = await ensureJQuery()
  await import('jquery-mousewheel')
  ensureMousewheel(jq)
  await import('luckysheet/dist/plugins/js/plugin.js')
  const luckysheetModule = await import('luckysheet/dist/luckysheet.umd.js')
  const api = (luckysheetModule?.default ?? luckysheetModule) as LuckysheetAPI
  cachedLuckysheet = api
  return api
}

export const getLuckysheet = (): LuckysheetAPI | null => cachedLuckysheet

export const teardownLuckysheet = (): void => {
  cachedLuckysheet?.destroy?.()
}

export const readSheets = (): LuckysheetSheet[] => {
  const sheets = cachedLuckysheet?.getAllSheets?.()
  return Array.isArray(sheets) ? sheets : []
}

export const getSelectionBounds = (): SheetSelectionBounds | null => {
  const ranges = cachedLuckysheet?.getRange?.()
  const range = Array.isArray(ranges) ? ranges[0] : undefined
  if (!range || !range.row || !range.column) {
    return null
  }

  const [rowStart, rowEnd] = range.row
  const [colStart, colEnd] = range.column

  return {
    startRow: Math.max(0, Math.min(rowStart, rowEnd)),
    endRow: Math.max(0, Math.max(rowStart, rowEnd)),
    startCol: Math.max(0, Math.min(colStart, colEnd)),
    endCol: Math.max(0, Math.max(colStart, colEnd)),
  }
}
