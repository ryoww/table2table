/**
 * config/config.ts — centralizes tweakable knobs for the table workflow.
 */
export const TABLE_CONFIG = {
  defaultSheetName: "Table",
  columnAlignment: "c",
  latexEnvironment: "tabular" as const,
  headerBg: "#EDF2F7",
  initialRows: 40,
  initialColumns: 20,
} as const;

export const UI_COPY = {
  title: "table2table",
  tagline:
    "表を整えて、選択範囲をワンクリックでLaTeX (tabular/tabularx) に変換します。",
};

export const UI_DIMENSIONS = {
  colorModeToggleIcon: {
    base: 6,
    md: 6,
  },
} as const;
