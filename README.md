# Age of Greats

**An interactive timeline that answers: "What were history's greatest figures doing at my age?"**

Slide to your age — or pick a year in history — and see what Einstein, Cleopatra, Oda Nobunaga, and 47 others were doing at that exact moment in their lives.

🌐 **[Live Demo → curionlab.github.io/age-of-greats](https://curionlab.github.io/age-of-greats/)**

> 日本語のREADMEは [docs/README_ja.md](docs/README_ja.md) をご覧ください。

---

## Screenshots

| Age Compare Mode | Calendar (Year) Mode |
|:---:|:---:|
| ![Age Compare Mode](docs/screenshot_age.png) | ![Calendar Mode](docs/screenshot_year.png) |

---

## Features

- **Age Compare Mode** — Set your age with a slider. A red line marks that age across all timelines. Instantly see what every figure had already accomplished — or had yet to do — at your age.
- **Calendar (Year) Mode** — Switch to a historical calendar view. Browse any year from 500 BC to the present and see who was alive and what was happening simultaneously across the world.
- **Category filters** — Filter by Scientists · Politics & Leaders · Art & Music · Tech & Business · Writers · Thinkers & Explorers
- **Search** — Filter figures by name in real time
- **Sort** — Sort by birth year, name, or lifespan
- **Wikipedia preview** — Tap any figure's name or event dot to open an in-app Wikipedia summary card
- **Japanese / English UI** — Toggle language at any time
- **Mobile-friendly** — Works on smartphones and tablets

---

## Repository layout

```text
age-of-greats/
├── index.html                  # App entry
├── package.json                # Simple local commands such as npm run dev
├── merge-data.cjs              # Generates public/data.json from source data
├── build-public.cjs            # Copies app files into public/
├── data.base.json              # Source JSON: metadata + categories + empty items
├── data/
│   └── parts/
│       ├── 001.json            # Split figure data
│       ├── 002.json            # Split figure data
│       └── ...                 # Additional figure data files
├── public/                     # Generated publish directory (not edited directly)
│   ├── index.html
│   ├── data.json
│   └── docs/
├── .github/
│   └── workflows/
│       └── pages.yml           # GitHub Pages deployment workflow
├── docs/
│   ├── README_ja.md            # Japanese README
│   ├── screenshot_age.png      # Age Compare screenshot
│   └── screenshot_year.png     # Calendar screenshot
├── README.md                   # This File
└── LICENSE
```

---
## How to update data

This repository uses a split data source and a generated build artifact.

- `data.base.json` stores shared app data such as `metadata` and `categories`
- `data/parts/*.json` stores figure records
- `public/data.json` is the generated file consumed by the app and deployed to GitHub Pages

Do not manually edit `public/data.json`. It is a build artifact.

### Source structure

#### `data.base.json`

```json
{
  "metadata": { "version": "4.0", "title": "...", "languages": ["ja", "en"] },
  "categories": [ ... ],
  "items": []
}
```

#### `data/parts/*.json`

Each file should contain either:

```json
[
  {
    "id": "einstein",
    "category": "science",
    "name": { "ja": "アルベルト・アインシュタイン", "en": "Albert Einstein" },
    "start": 1879,
    "end": 1955,
    "isAlive": false,
    "main_wiki": {
      "ja": "https://ja.wikipedia.org/wiki/アルベルト・アインシュタイン",
      "en": "https://en.wikipedia.org/wiki/Albert_Einstein"
    },
    "events": [
      {
        "age": 26,
        "label": { "ja": "奇跡の年", "en": "Annus Mirabilis" },
        "text": {
          "ja": "特殊相対性理論など4本の論文を発表",
          "en": "Publishes 4 groundbreaking papers including special relativity"
        },
        "wiki": {
          "ja": "https://ja.wikipedia.org/wiki/奇跡の年",
          "en": "https://en.wikipedia.org/wiki/Annus_Mirabilis_papers"
        }
      }
    ]
  }
]
```

or:

```json
{
  "items": [ ... ]
}
```


### Build step

Build the publishable files with:

```bash
npm run build
```

This command will:

- copy the app files into `public/`
- merge `data.base.json` and `data/parts/*.json`
- generate `public/data.json`

Do not edit files inside `public/` directly.


### Local development

You do not need to build files by hand.

If you can open a terminal and run one command, you can use this project locally.

#### First-time setup

Install Node.js on your computer.

#### Start the app locally

From the project root, run:

```bash
npm run dev
```

This command will automatically:

- copy the app files into `public/`
- merge `data.base.json` and `data/parts/*.json`
- generate `public/data.json`
- start a local web server

Then open the local URL shown in the terminal.

#### For teachers and non-developers

A teacher can add a historical figure by editing one JSON file in `data/parts/`, then run:

```bash
npm run dev
```

That is enough to rebuild the data and preview the app locally.

In practice, the workflow is simple:

1. Add or edit a figure in `data/parts/`
2. Run `npm run dev`
3. Open the local page in a browser
4. Use it in class

#### Rebuild data only

If you only want to regenerate the public files without starting the local server, run:

```bash
npm run build
```

#### Important note

- Do not edit `public/data.json` directly
- Edit `data.base.json` for shared settings and categories
- Edit `data/parts/*.json` for figure data



### Field reference

| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | Unique across all part files. Use lowercase plus hyphens or underscores consistently. |
| `category` | ✅ | Must match a `categories[].id` value, or it will be auto-generated during merge. |
| `name.ja` / `name.en` | ✅ | Both languages are required for the language toggle. |
| `start` | ✅ | Birth year. Use negative integers for BC figures. |
| `end` | ✅ | Death year, or current year for living figures if needed by the app. |
| `isAlive` | ✅ | `true` for living figures. |
| `main_wiki` | ✅ | Preferred canonical field name for Wikipedia links. |
| `events` | ✅ | Array of life events. Birth and final-life events are strongly recommended. |
| `events[].age` | ✅ | Age at the time of the event. |
| `events[].wiki` | ❌ | Optional per-event Wikipedia link. |

### Age vs. year

Events use **age**, not calendar year. The app converts them internally using `start + age = calendar year`. For BC figures, `start` should be a negative integer.

### Adding a new category

Add a category definition to `data.base.json`:

```json
{
  "id": "sports",
  "label": { "ja": "スポーツ", "en": "Sports" },
  "color": "#e74c3c"
}
```

Then assign `"category": "sports"` to any matching figure.

### Event writing guidelines

- Include at minimum: **Birth** (`age: 0`) and a final event near the end of life
- Keep `label` short; it is used in compact UI contexts
- `text` can be one or two sentences
- Provide both Japanese and English text
- `wiki` is optional but recommended
- For BC figures, `age` is still a non-negative integer


## Contribution guide (Pull Requests welcome!)

We welcome PRs that:

- Add new historical figures
- Add events to existing figures
- Fix factual errors
- Improve translations (ja ↔ en)

**Guidelines:**

1. Add or update figure records in `data/parts/*.json`
2. Edit `data.base.json` only for shared metadata or category changes
3. Do not manually edit `public/data.json`; it is generated
4. Include source URLs in `events[].wiki` or in the PR description
5. Provide both Japanese and English text for `name`, `label`, and `text`
6. Keep `id` values unique across all part files
7. Keep PRs focused; one figure or one small thematic batch is easiest to review

> **Draft PR tip:** If you're unsure about event details, open a Draft PR first and we can verify together.



## Data template (copy & paste)

<details>
<summary>Minimal person template</summary>

```json
[
  {
    "id": "your-id-here",
    "category": "science",
    "name": { "ja": "日本語名", "en": "English Name" },
    "start": 1900,
    "end": 1980,
    "isAlive": false,
    "main_wiki": {
      "ja": "https://ja.wikipedia.org/wiki/...",
      "en": "https://en.wikipedia.org/wiki/..."
    },
    "events": [
      {
        "age": 0,
        "label": { "ja": "誕生", "en": "Birth" },
        "text": { "ja": "...", "en": "..." }
      },
      {
        "age": 25,
        "label": { "ja": "代表作", "en": "Key Work" },
        "text": { "ja": "...", "en": "..." },
        "wiki": { "ja": "...", "en": "..." }
      },
      {
        "age": 80,
        "label": { "ja": "死去", "en": "Death" },
        "text": { "ja": "...", "en": "..." }
      }
    ]
  }
]
```

</details>

---

## License

[Apache License 2.0](LICENSE)

Copyright (c) 2026 Curion Lab

---

*Inspired by the spirit of Plutarch's "Parallel Lives" — comparing great figures across time.*
