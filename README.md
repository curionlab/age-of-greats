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

```
age-of-greats/
├── index.html       # App (self-contained front-end)
├── data.json        # All figure & event data
├── docs/
│   ├── README_ja.md          # Japanese README
│   ├── screenshot_age.png    # Age Compare screenshot
│   └── screenshot_year.png   # Calendar screenshot
└── LICENSE
```

---

## How to update `data.json`

All content lives in `data.json`. No build step, no server — just edit the file and commit.

### Top-level structure

```json
{
  "metadata": { "version": "4.0", "title": "...", "languages": ["ja","en"] },
  "categories": [ ... ],
  "items": [ ... ]
}
```

### Person object

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

| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | Unique across the whole file. Use lowercase + hyphens. |
| `category` | ✅ | Must match a `categories[].id` value |
| `name.ja` / `name.en` | ✅ | Both languages needed for UI language toggle |
| `start` | ✅ | Birth year. Use negative integers for BC (e.g. `-100`) |
| `end` | ✅ | Death year. Use current year for living figures |
| `isAlive` | ✅ | `true` for living figures. The bar fades at the right edge |
| `mainwiki` | ✅ | Wikipedia URLs for name-click modal |
| `events` | ✅ | Array of life events (at least Birth and Death recommended) |
| `events[].age` | ✅ | Age at the time of the event |
| `events[].wiki` | ❌ | Optional per-event Wikipedia link |

### Age vs. year

Events use **age**, not calendar year. The app converts between them internally using `start + age = calendar year`. For BC figures, `start` is negative (e.g., Caesar: `"start": -100`).

### Adding a new category

Add an entry to the `categories` array:

```json
{
  "id": "sports",
  "label": { "ja": "スポーツ", "en": "Sports" },
  "color": "#e74c3c"
}
```

Then set `"category": "sports"` on any person.

### Event writing guidelines

- Include at minimum: **Birth** (`age: 0`) and a final event at the end of life
- `label` should be short (≤ 10 chars) — it appears on the timeline dot tooltip header
- `text` can be longer (1–2 sentences)
- Both `ja` and `en` strings are required; they are shown based on the UI language setting
- `wiki` is optional but strongly recommended for verifiability
- For BC figures, `age` is still a non-negative integer representing years after birth

---

## Contribution guide (Pull Requests welcome!)

We welcome PRs that:
- Add new historical figures
- Add events to existing figures
- Fix factual errors
- Improve translations (ja ↔ en)

**Guidelines:**
1. Add your figure to `data.json` following the schema above
2. Include source URLs in `events[].wiki` or in the PR description (Wikipedia preferred, other reputable sources accepted)
3. Provide both Japanese and English text for `name`, `label`, and `text`
4. Keep `id` values lowercase and hyphen-separated; verify it doesn't conflict with existing entries
5. One PR per figure (or small thematic batch) keeps reviews manageable

> **Draft PR tip:** If you're unsure about an event's details, open a Draft PR and we can verify together.

---

## Data template (copy & paste)

<details>
<summary>Minimal person template</summary>

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

## License

[Apache License 2.0](LICENSE)

Copyright (c) 2026 curionlab

---

*Inspired by the spirit of Plutarch's "Parallel Lives" — comparing great figures across time.*
