# Agent briefing: jholm-11ty-portfolio

You are working on **Justin Holmberg’s personal portfolio** — a static case-study site, not a web app with a backend, API, or component framework. Read this file before making changes. Prefer minimal diffs that match existing patterns.

**Live site:** [jholm.me](https://jholm.me) (custom domain via `CNAME`)  
**Source repo (linked on site):** [github.com/jholmbe/portfolio](https://github.com/jholmbe/portfolio)  
**Deploy:** GitHub Pages from `main` → build output in `public/` → `gh-pages` branch

---

## Stack

| Layer | Choice | Notes |
|-------|--------|--------|
| SSG | Eleventy 3 (`@11ty/eleventy`) | `eleventy.config.js` at repo root |
| Templates | Nunjucks (`.njk`) | Layouts in `src/_includes/`, macros in `src/_includes/macros/` |
| CSS | Tailwind CSS v4 | CLI build from `src/input.css` → `public/styles.css` |
| JS | Vanilla only | Inline scripts in `base.njk`; optional `embedJS` shortcode |
| Module system | ES modules | `"type": "module"` in `package.json` |
| Formatting | Prettier | `npm run format` — HTML parser for `.njk`, Tailwind class sorting plugin |

There is **no** React, Vue, bundler (Vite/Webpack), or test suite. Do not add dependencies unless the user asks.

---

## Commands

```bash
npm start          # build CSS once, eleventy --serve, watch Tailwind → public/styles.css
npm run build      # build:css + eleventy (local production build)
npm run build-ghpages  # build:css + npx @11ty/eleventy (used in CI)
npm run format     # prettier --write "src/**/*.{njk,css,js}"
```

- **Dev server:** Eleventy serve (default port 8080).
- **Output directory:** `public/` (gitignored). Do not commit build artifacts.
- **`public/styles.css`** is generated — edit `src/input.css`, never hand-edit the built file.

---

## Repository layout

```
jholm-11ty-portfolio/
├── AGENTS.md
├── eleventy.config.js        ← shortcodes, passthrough, projects collection
├── package.json
├── CNAME
├── src/
│   ├── index.njk             ← homepage (loops collections.projects)
│   ├── input.css
│   ├── _includes/
│   │   ├── base.njk
│   │   ├── project.njk
│   │   └── macros/
│   │       └── section.njk   ← case-study section layouts
│   ├── projects/             ← canonical project metadata + case-study body
│   │   ├── fabric.njk
│   │   ├── project-kilter.njk
│   │   ├── snake-game.njk    ← user may remove soon
│   │   └── faithselects.njk
│   └── assets/
└── .github/workflows/gh-pages.yml
```

There is **no** `src/_data/projects.js`. Homepage cards come from the `projects` collection.

---

## Eleventy configuration (`eleventy.config.js`)

**Directories:** `input: src`, `output: public`, `pathPrefix: "/"`.

**Collection `projects`:** all `src/projects/*.njk`, sorted by front matter `order` (ascending). Used on the homepage via `collections.projects`.

**Passthrough copy:** `src/assets`, `CNAME`.

**Shortcodes:**

| Shortcode | Usage |
|-----------|--------|
| `{% figmaEmbed url [, id] %}` | Figma embed iframe |
| `{% embedJS path %}` | Build-time file read → Prism-styled `<pre><code>` (snake project only today) |
| `{% externalLinkIcon size, fill %}` | Inline external-link SVG |

**Filters:** `{{ '/assets/foo.png' \| url }}`, `{{ project.url }}` for collection items.

---

## Data flow (single source of truth)

Each case study is **one file**: `src/projects/<slug>.njk`.

- **Front matter** → `project.njk` layout (summary header) + homepage card (via collection).
- **Body** → case-study sections (macros + custom markup).

### Homepage (`src/index.njk`)

Loops `{% for project in collections.projects %}` and reads `project.data.*`:

| Field | Purpose |
|-------|---------|
| `coverImg`, `altText` | Card image |
| `title` | Card title (styled `uppercase` on homepage) |
| `oneLiner` | Card subtitle |
| `tags` | Joined with `" \| "` for card skills line |
| `homepageTags` | Optional — overrides `tags` on homepage only (FaithSelects) |
| `order` | Sort order in collection (1 = first) |

Link: `{{ project.url }}` (from `permalink` in front matter).

### Project front matter (required for layout)

| Field | Required | Notes |
|-------|----------|--------|
| `layout` | Yes | `"project.njk"` |
| `order` | Yes | Homepage sort order |
| `permalink` | Yes | e.g. `"/fabric/"` |
| `coverImg`, `altText`, `title`, `oneLiner`, `tags` | Yes | Summary block |
| `projectDescription` | Yes | HTML (`\| safe`) |
| `projectRepository` | Yes | Footer link |
| `timeline` | Optional | Shown under one-liner when set |
| `liveDemo` | Optional | If set, title links externally; otherwise plain text |
| `homepageTags` | Optional | Homepage-only skill line |

---

## Section macros (`src/_includes/macros/section.njk`)

Import at top of project templates:

```njk
{% from "macros/section.njk" import section, sectionImageOnly, sectionGrid %}
```

| Macro | Use for |
|-------|---------|
| `{% call section(title, imageSrc, alt="", pbClass="pb-16") %}…{% endcall %}` | Text column + `<img>` column. Caller = HTML below the `<h1>`. |
| `{{ sectionImageOnly(imageSrc, alt="", pbClass="pb-4") }}` | Image only (expression syntax, not `{% %}`). |
| `{% call sectionGrid(pbClass="pb-16") %}…{% endcall %}` | Custom two-column content (Figma, video, carousels). |

---

## Layouts

### `base.njk`

- Fonts: Fira Sans, Source Code Pro (Google Fonts).
- Prism Okaidia from CDN (used if `embedJS` present; may be removed with snake project).
- Body: `sm:grid sm:grid-cols-[1fr_3fr]`; mobile hamburger nav.
- Divider scroll animation via `IntersectionObserver` + `animate-expand` in `input.css`.

### `project.njk`

- Renders cover, tags, title (linked only if `liveDemo`), oneLiner, optional `timeline`, description.
- Injects `{{ content | safe }}` for case-study body.
- Footer: back to projects + repository link.

---

## Styling (`src/input.css`)

`@theme`: `--color-primary` (#2a2a2a), `--color-secondary` (#fff), Fira/Source Code Pro, `animate-expand`.

Case-study sections: macros encode the `sm:contents` two-column grid. FaithSelects uses `sectionGrid` with horizontal snap carousels (custom inner markup).

---

## Adding a new project

1. Add assets under `src/assets/<slug>-imgs/`.
2. Create `src/projects/<slug>.njk` with front matter (`order`, `permalink`, all required fields).
3. Build body with `section` / `sectionGrid` macros (copy from `fabric.njk` or `faithselects.njk`).
4. Set `order` relative to existing projects.
5. Use `homepageTags` only if the homepage skills line should differ from `tags`.
6. Run `npm run build` and verify homepage card + project page.

---

## CI / deploy

`.github/workflows/gh-pages.yml`: Node 20, `npm ci`, `npm run build-ghpages`, deploy `public/` to `gh-pages` on `main`.

---

## Current projects

| order | File | permalink | liveDemo |
|-------|------|-----------|----------|
| 1 | `fabric.njk` | `/fabric/` | — |
| 2 | `project-kilter.njk` | `/project-kilter/` | — |
| 3 | `snake-game.njk` | `/snake-game/` | GitHub Pages (may be removed) |
| 4 | `faithselects.njk` | `/faithselects/` | faithselects.com |

---

## Editing guidelines

- Match existing Tailwind utility style; run `npm run format` on touched files.
- Prefer macros over copy-pasting grid markup.
- Do not reintroduce `src/_data/projects.js` or duplicate homepage metadata elsewhere.
- Only create git commits when the user explicitly requests them.
- **README** still mentions View Transitions — not implemented in code.

---

*Architecture: projects collection + section macros. Updated after metadata unification refactor.*
