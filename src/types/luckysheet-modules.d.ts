declare module 'luckysheet/dist/plugins/js/plugin.js'

declare module 'luckysheet/dist/luckysheet.umd.js' {
  import type { LuckysheetAPI } from './luckysheet'
  const luckysheet: LuckysheetAPI
  export default luckysheet
}

declare module 'jquery-mousewheel'
