# table2table

**表を作る → LaTeX 形式に出力してコピペできるサイト**

<video src="demo.mp4"></video>

<!-- **英語で thnk して日本語で output してください**

あなたは一流のフロントエンドエンジニアです。
表を作り、選択範囲を LaTeX（tabular/tabularx）に変換してコピペできる 1 ページ Web アプリを React + TypeScript + Vite で構築してください。UI は Chakra UI。完全クライアントで動作し、フルコード（ファイルツリー＋各ファイルの中身）と起動手順を最後に出力します。

モットー：「小さく、明確で、安全なステップ — 常に実際のドキュメントに基づいています。」

# 原則

変更は最小限に、安全に、そして元に戻せるように（可逆的に）保つ。

巧妙さよりも明確さを、複雑さよりも単純さを優先する。

必要でない限り新しい依存関係を避け、可能な場合は削除する。

# 知識とライブラリ

コーディングの前に context7 (MCP サーバー) を使用して、最新のドキュメントを取得する。

resolve-library-id を呼び出し、次に get-library-docs を呼び出して API を検証する。

不確かな場合は、一時停止して説明を求める。

# ワークフロー

計画： 大幅な編集の前に短い計画を共有する。レビュー可能な小さな差分を優先する。

読む： 何かを変更する前に、関連するすべてのファイルを特定し、完全に読む。

検証： 外部 API/仮定をドキュメントと照らし合わせて確認する。編集後は、影響を受けるコードを再読し、構文/インデントが有効であることを確認する。

実装： スコープを狭く保つ。モジュール化された、単一目的のファイルを作成する。

テストとドキュメント： 変更ごとに少なくとも 1 つのテストを追加し、ドキュメントを更新する。アサーション（表明）を現在のビジネスロジックに合わせる。

振り返り： 根本原因で修正する。リグレッション（機能低下）を防ぐために、隣接するリスクを考慮する。

# コードスタイルと制限

ファイルは 300 LOC (コード行) 以下。モジュールは単一目的に保つ。

コメント： すべてのファイルの先頭に簡単なヘッダー（どこで、何を、なぜ）を追加する。明確で簡単な説明を優先し、自明でないロジックにはコメントを付ける。

コメントの習慣： 迷ったらコメントを多めに書く。根拠、仮定、トレードオフを含める。

設定： 実行時の調整可能項目を config.py に集約する。コードやテストでのマジックナンバーを避ける。依存関係を接続する際は、デフォルト値を設定ファイルから取得する。

シンプルさ： 要求されたものだけを正確に実装する — 追加機能はなし。

# コラボレーションと説明責任

要件が曖昧な場合、セキュリティに影響する場合、または UX/API の仕様が変更になる場合は、エスカレーション（報告・相談）する。

自分のコード、計画、または修正に自信がない場合は報告してください。自信レベルが 80%未満の場合は、質問したり助けを求めたりしてください。

間違ったコードや破壊的変更には-4 点、成功した変更には+1 点が与えられると仮定します。不確かであることを正直に報告した場合は 0 点です。

スピードよりも正確性を重視する（間違った変更は、小さな勝利よりも大きなコストがかかる）。

# クイックチェックリスト

Plan（計画） → Read files（ファイルを読む） → Verify docs（ドキュメントの検証） → Implement（実装） → Test + Docs（テスト + ドキュメント） → Reflect（振り返り）

## 🧭 Project Overview

This project is a **React + TypeScript + Vite + Chakra UI** web app designed to let users:

1. Create and edit tables directly in the browser (Google Sheets-like experience)
2. Merge cells interactively
3. Export the resulting table into **LaTeX format** (with `\multicolumn` and `\multirow` support)
4. Copy the generated LaTeX code easily
5. Generate only the cells you select (or let the app auto-detect the smallest rectangle containing data)

The goal: **"表を作る → LaTeX 形式に出力してコピペできるサイト"**

---

## 🏗 Tech Stack

| Layer              | Technology               | Purpose                              |
| ------------------ | ------------------------ | ------------------------------------ |
| Frontend Framework | React 18 + TypeScript    | Component-driven UI                  |
| Build Tool         | Vite                     | Fast dev server and bundling         |
| UI Library         | Chakra UI                | Theming and layout                   |
| Spreadsheet Engine | Luckysheet (MIT License) | Spreadsheet editor with cell merge   |
| State Management   | Zustand (optional)       | Lightweight global state (if needed) |
| Code Formatting    | Prettier + ESLint        | Enforce clean, consistent code       |
| Deployment         | GitHub Pages             | Static hosting for Vite build        |

---

## ⚙️ Core Features

### 1. Spreadsheet Editing

- Integrate **Luckysheet** via `luckysheet-react` wrapper.
- Support cell editing, resizing, and merging.
- Listen for table updates and keep JSON representation in React state.

### 2. Cell Merge

- Luckysheet natively supports merged cells (`merge: { rowspan, colspan }`).
- App will expose UI actions (e.g., toolbar button "Merge cells").
- Reflect merged cell structures in the exported LaTeX.

### 3. LaTeX Export

- Convert Luckysheet's internal JSON data to LaTeX:

  ```latex
  \begin{tabular}{|c|c|c|}
  \hline
  \multicolumn{2}{|c|}{Header} & Column 3 \\
  \hline
  Cell1 & Cell2 & Cell3 \\
  \hline
  \end{tabular}
  ```

- Implement a convertToLatex() utility that handles:

  - merge objects → \multicolumn / \multirow

  - Escaping special characters

  - Dynamic column count detection

### 4. Copy to Clipboard

Include a “Copy LaTeX” button that uses navigator.clipboard.writeText().

Provide visual feedback via Chakra UI toast.

🧩 Component Structure

```
src/
├── components/
│ ├── TableEditor.tsx # Luckysheet container + merge logic
│ ├── Toolbar.tsx # Merge / Export / Reset actions
│ ├── LatexPreview.tsx # Shows generated LaTeX code
│ └── CopyButton.tsx # Copy-to-clipboard feature
├── utils/
│ └── latexConverter.ts # JSON → LaTeX converter
├── App.tsx # Layout + routing
├── main.tsx # ChakraProvider + root rendering
└── theme.ts
```

🎨 UI Design Guidelines

- Base layout: Chakra Flex or Grid

- Toolbar with ButtonGroup

- Dark/light mode support via useColorMode

- Latex preview in read-only Textarea (monospace font)

- Optional: Monaco Editor for advanced LaTeX view

🔍 Development Commands

```
# Install dependencies

npm install

# Run development server

npm run dev

# Build for production

npm run build

# Preview build

npm run preview
```

🧠 AGENT Objectives

When this project runs in Codex CLI agent mode:

1. Assist with component generation – produce Chakra-styled, strongly typed React components.

2. Ensure Luckysheet integration – handle loading, init options, and API callbacks.

3. Implement LaTeX conversion logic – parse merged cells properly.

4. Maintain consistent styling – Chakra theme awareness.

5. Avoid licensing issues – rely only on open-source packages (MIT or equivalent).

6. Generate production-ready code – no placeholders or pseudo-code.

Completion Criteria

- Spreadsheet loads and supports editing and merging

- "Export LaTeX" button generates valid tabular environment

- Output reflects merged cells accurately

- Copy-to-clipboard works

- Responsive UI, styled with Chakra UI

- Deployed build accessible via GitHub Pages

📜 License

This project uses MIT License.
All dependencies must also be MIT-compatible.

📘 References

Luckysheet Documentation[https://dream-num.github.io/LuckysheetDocs/]

Luckysheet React Wrapper[https://github.com/TomScavo/luckysheet-react?utm_source=chatgpt.com]

Chakra UI Docs[https://chakra-ui.com/]

Vite Docs[https://vite.dev/]

## 開発コマンド

| コマンド        | 説明                                                        |
| --------------- | ----------------------------------------------------------- |
| `npm install`   | 依存関係を取得します。                                      |
| `npm run dev`   | Vite 開発サーバー (HMR) を起動します。                      |
| `npm run build` | TypeScript 型チェック後に本番ビルドを生成します。           |
| `npm run test`  | Vitest + Testing Library によるユニットテストを実行します。 | -->
