# Age of Greats

**「この年齢のとき、偉人たちは何をしていたのか？」を一瞬で見られるインタラクティブ年表アプリ**

年齢スライダーを動かすか、歴史上の西暦を指定するだけで、アインシュタイン、クレオパトラ、織田信長など50人の偉人たちが、同じ年齢・同じ時代に何をしていたかを一覧できます。

🌐 **[Live Demo → curionlab.github.io/age-of-greats](https://curionlab.github.io/age-of-greats/)**

> English README is available at [README.md](../README.md).

---

## スクリーンショット

| 年齢比較モード | 西暦（カレンダー）モード |
|:---:|:---:|
| ![年齢比較モード](screenshot_age.png) | ![西暦モード](screenshot_year.png) |

---

## できること

- **年齢比較モード** — スライダーで自分の年齢を設定。全偉人の年表に赤いラインが引かれ、その年齢で各人が何を達成していたかが一目でわかります。
- **西暦（カレンダー）モード** — 西暦軸に切り替えると、紀元前500年から現代まで、同じ時代に誰が生き、何が起きていたかを俯瞰できます。
- **カテゴリフィルタ** — 科学者・政治リーダー・芸術音楽・テクノロジー・文学・思想家探検家で絞り込み
- **人物名検索** — リアルタイム絞り込み
- **並び替え** — 生年順・名前順・寿命順
- **Wikipedia プレビュー** — 人物名やイベントドットをタップすると、アプリ内でWikipedia概要カードが開きます
- **日本語／英語 UI** — いつでも切り替え可能
- **スマートフォン対応**

---

## ファイル構成

```
age-of-greats/
├── index.html       # アプリ本体（フロントエンドのみで完結）
├── data.json        # 偉人・イベントデータ
├── docs/
│   ├── README_ja.md          # このファイル
│   ├── screenshot_age.png    # 年齢モードのスクリーンショット
│   └── screenshot_year.png   # 西暦モードのスクリーンショット
└── LICENSE
```

---

## data.json の更新方法

すべてのデータは `data.json` に集約されています。ビルド不要、サーバー不要。ファイルを編集してコミットするだけです。

### トップレベル構造

```json
{
  "metadata": { "version": "4.0", "title": "...", "languages": ["ja","en"] },
  "categories": [ ... ],
  "items": [ ... ]
}
```

### 人物オブジェクトの書き方

```json
{
  "id": "einstein",
  "category": "science",
  "name": { "ja": "アルベルト・アインシュタイン", "en": "Albert Einstein" },
  "start": 1879,
  "end": 1955,
  "isAlive": false,
  "mainwiki": {
    "ja": "https://ja.wikipedia.org/wiki/アルベルト・アインシュタイン",
    "en": "https://en.wikipedia.org/wiki/Albert_Einstein"
  },
  "events": [
    {
      "age": 26,
      "label": { "ja": "奇跡の年", "en": "Annus Mirabilis" },
      "text":  { "ja": "特殊相対性理論など4本の論文を発表", "en": "Publishes 4 groundbreaking papers incl. special relativity" },
      "wiki":  { "ja": "https://ja.wikipedia.org/wiki/奇跡の年", "en": "https://en.wikipedia.org/wiki/Annus_Mirabilis_papers" }
    }
  ]
}
```

| フィールド | 必須 | 説明 |
|---|---|---|
| `id` | ✅ | ファイル内でユニークな識別子。英小文字＋ハイフン推奨 |
| `category` | ✅ | `categories[].id` に存在する値を指定 |
| `name.ja` / `name.en` | ✅ | UI言語切り替えに使用。両言語必須 |
| `start` | ✅ | 生年。紀元前は負の整数（例：`-100`） |
| `end` | ✅ | 没年。存命人物は現在年を入れる |
| `isAlive` | ✅ | 存命の場合 `true`。バーの右端がフェードアウト表示になる |
| `mainwiki` | ✅ | 人物名タップ時のモーダルに使用するWikipedia URL |
| `events` | ✅ | ライフイベントの配列（誕生・死去は最低限入れることを推奨） |
| `events[].age` | ✅ | イベント発生時の年齢（非負整数） |
| `events[].wiki` | ❌ | イベント個別のWikipediaリンク（任意） |

### 年齢と西暦について

イベントは **年齢（age）** で管理します。西暦への変換は `start + age = 西暦` でアプリが自動的に行います。紀元前人物も `age` は誕生から数えた非負整数です（例：カエサル `"start": -100`、age 55 → 紀元前45年）。

### カテゴリを追加する

`categories` 配列に追加します：

```json
{
  "id": "sports",
  "label": { "ja": "スポーツ", "en": "Sports" },
  "color": "#e74c3c"
}
```

その後、人物に `"category": "sports"` を設定します。

### イベント記述のガイドライン

- 最低限 **誕生**（`age: 0`）と**終盤イベント**（死去または現在の活動）を入れてください
- `label` は短く（目安10文字以内）。ツールチップのヘッダーに表示されます
- `text` は1〜2文。内容の補足説明を書きます
- `ja` と `en` の両方を必ず記入してください
- `wiki` は任意ですが、信頼性のために強く推奨します
- 紀元前の人物でも `age` は誕生時を0とした正の整数で記入します

---

## コントリビュートについて（プルリク歓迎！）

以下のPRを歓迎します：
- 新しい偉人の追加
- 既存人物へのイベント追加
- 事実誤りの修正
- 日英翻訳の改善

**手順：**
1. `data.json` に上記スキーマに従ってデータを追加する
2. `events[].wiki` またはPR本文にソースURLを記載する（Wikipedia推奨）
3. `name`・`label`・`text` に日英両方のテキストを入れる
4. `id` は小文字＋ハイフンで、既存のものと重複しないようにする
5. 1人（または小テーマのまとめ）ごとにPRを出すとレビューしやすいです

---

## データ追加テンプレート（コピペ用）

<details>
<summary>人物追加テンプレート</summary>

```json
{
  "id": "your-id-here",
  "category": "science",
  "name": { "ja": "日本語名", "en": "English Name" },
  "start": 1900,
  "end": 1980,
  "isAlive": false,
  "mainwiki": {
    "ja": "https://ja.wikipedia.org/wiki/...",
    "en": "https://en.wikipedia.org/wiki/..."
  },
  "events": [
    { "age": 0,  "label": { "ja": "誕生",   "en": "Birth" }, "text": { "ja": "...", "en": "..." } },
    { "age": 25, "label": { "ja": "代表作",  "en": "Key Work" }, "text": { "ja": "...", "en": "..." }, "wiki": { "ja": "...", "en": "..." } },
    { "age": 80, "label": { "ja": "死去",   "en": "Death" }, "text": { "ja": "...", "en": "..." } }
  ]
}
```

</details>

---

## ライセンス

[Apache License 2.0](../LICENSE)

Copyright (c) 2026 curionlab

---

*プルタルコスの『対比列伝』の精神を受け継いで — 時代を超えた偉人たちを同じ軸で比較する。*
