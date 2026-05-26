---
name: md-to-html-doc
description: Convert Markdown architecture docs into modern, responsive single-page HTML with sidebar nav, flowcharts, and state-machine diagrams
---

# Markdown to Modern HTML Doc

Convert Markdown architecture documents into modern, responsive single-page HTML.

## Flow

1. **Read source Markdown** and understand its structure (heading hierarchy, code blocks, lists, tables)
2. **Generate complete HTML** file, output to the same path with `.html` extension
3. **Open in browser** to verify the result

## Core Design Principles

### 1. Charts must use HTML/CSS, no fixed-position SVG

SVG with `x,y` coordinate positioning is an anti-pattern — labels overlap, content gets cut off, text blurs when scaled.

**Correct approach**: use flexbox/grid layout so the browser auto-calculates node positions. Arrows use CSS pseudo-elements or tiny SVG connectors (only branch lines need SVG because they're not purely linear layouts).

```
✅ Flow nodes → div.flow-node + flexbox vertical layout
✅ Branch lines → small SVG connector (connection line only, no text)
✅ State machine → flex horizontal 3-column, arrows via CSS ::after
❌ Large SVG viewBox + manual x,y coordinates
❌ <text> tag with fixed x,y
```

### 2. SVG must be `width="100%"` + adaptive viewBox

If SVG is needed, never write `width="880"` — use `width="100%"` with `viewBox` for browser auto-scaling based on container width.

### 3. Labels along paths (SVG scenario)

When multiple lines converge in SVG, labels at different `x,y` overlap. Use `<textPath>` for text along arrow paths, but HTML/CSS is still cleaner — labels in flex containers naturally avoid overlap.

## HTML Structure Template

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Title</title>
  <style>
    /* CSS variables + global styles + component styles */
  </style>
</head>
<body>

<!-- Fixed sidebar -->
<aside class="sidebar">
  <div class="sidebar-logo">
    <h1>Document Title</h1>
    <span>Subtitle / English</span>
  </div>
  <nav>
    <!-- Each h2/h3 gets a link, depth-2 for h3 -->
    <a href="#section-id">Title</a>
    <a href="#subsection-id" class="depth-2">Subtitle</a>
  </nav>
</aside>

<!-- Main content -->
<main class="main">
  <section id="section-id">
    <h2>Title</h2>
    <!-- cards, tables, code blocks, charts -->
  </section>
</main>

<!-- Back to top -->
<button class="back-to-top" id="backToTop">↑</button>

<script>
  // Scroll listener + back-to-top visibility + nav highlight
</script>

</body>
</html>
```

## CSS System

### Design Variables

```css
:root {
  --sidebar-w: 280px;
  --content-max: 960px;
  --bg: #f8f9fb;
  --surface: #ffffff;
  --text: #1e293b;
  --text-secondary: #64748b;
  --primary: #4f46e5;
  --primary-light: #e0e7ff;
  --primary-dark: #3730a3;
  --border: #e2e8f0;
  --code-bg: #1e293b;
  --code-text: #e2e8f0;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --shadow-sm: 0 1px 3px rgba(0,0,0,.06);
  --shadow-md: 0 4px 16px rgba(0,0,0,.08);
  --radius: 12px;
  --radius-sm: 8px;
}
```

### Flowchart Components (HTML + CSS)

```css
/* Vertical flowchart */
.flow-chart { display: flex; flex-direction: column; align-items: center; gap: 0; padding: 16px 0; }
.flow-node { padding: 10px 20px; border-radius: 10px; font-size: 13.5px; font-weight: 600; text-align: center; line-height: 1.5; max-width: 360px; width: max-content; }
.flow-node.entry   { background: #4f46e5; color: white; border-radius: 20px; }
.flow-node.primary { background: #e0e7ff; color: #3730a3; border: 1.5px solid #4f46e5; }
.flow-node.decision{ background: #fef3c7; color: #92400e; border: 1.5px solid #f59e0b; }
.flow-node.success { background: #d1fae5; color: #166534; border: 1.5px solid #10b981; }
.flow-node.danger  { background: #fee2e2; color: #991b1b; border: 1.5px solid #ef4444; }
.flow-node.warning { background: #fef3c7; color: #92400e; border: 1.5px solid #f59e0b; }
.flow-node.blue    { background: #dbeafe; color: #1e40af; border: 1.5px solid #3b82f6; }
.flow-node.dark    { background: #4f46e5; color: white; }
.flow-node.gray    { background: #f1f5f9; color: #475569; border: 1.5px solid #64748b; }
.flow-arrow-down { width: 2px; height: 20px; background: #94a3b8; position: relative; }
.flow-arrow-down::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid #94a3b8; }
.flow-connector { display: flex; justify-content: center; margin: 0; }
.flow-connector svg { display: block; width: 240px; height: 30px; }
.flow-connector line, .flow-connector path { stroke: #94a3b8; stroke-width: 2; fill: none; }
.flow-branch { display: flex; gap: 32px; align-items: flex-start; margin: 0; }
.state-machine { display: flex; flex-direction: column; align-items: center; padding: 16px 0; }
.sm-transitions { display: flex; gap: 32px; flex-wrap: wrap; justify-content: center; }
.sm-transition { display: flex; flex-direction: column; align-items: center; min-width: 160px; }
```

### Other Components

- **Card** `.card` — white background + rounded corners + hover shadow
- **Overview grid** `.overview-grid` — `grid-template-columns: repeat(auto-fit, minmax(220px, 1fr))`
- **Steps list** `.steps` — counter-reset + circular numbering
- **Good/bad examples** `.example.good` / `.example.bad` — green/red background
- **Design decision cards** `.decision` — with background/decision/reason metadata
- **Callout** `.callout.info/warning/danger/success` — left border color strip

## Chart Conversion Rules

| Markdown content | HTML conversion |
|---|---|
| Vertical flowchart/pseudocode | flexbox vertical `.flow-chart` + `.flow-node` + `.flow-arrow-down` |
| Branch/decision | `.flow-connector` (small SVG) + `.flow-branch` (two-column flex) |
| Parallel paths | `.flow-paths` (horizontal flex) + each path vertical inside |
| State machine | `.state-machine` — top center node + `.sm-transitions` horizontal |
| Tables | `<div class="table-wrapper"><table>...</table></div>` |
| Code blocks | `<pre><code>...</code></pre>` |

## Sidebar Navigation (left, fixed)

**Every HTML document must have.** Fixed position on left, right content scrolls freely.

```css
.sidebar { position: fixed; top: 0; left: 0; width: var(--sidebar-w); height: 100vh; background: var(--surface); border-right: 1px solid var(--border); overflow-y: auto; padding: 32px 0 24px; z-index: 100; box-shadow: var(--shadow-sm); }
.main { margin-left: var(--sidebar-w); padding: 40px 48px 120px; }
```

- Each `<h2>` generates `<a href="#id">Title</a>`
- Each `<h3>` generates `<a href="#id" class="depth-2">Subtitle</a>`
- JS listens to scroll, auto-highlights current section link (`.active` class)
- Responsive: `@media (max-width: 900px)` hide sidebar, main full-width

## Back-to-Top Button (bottom-right, fixed)

**Every HTML document must have.** Fixed at bottom-right, fades in after scrolling past 400px.

```css
.back-to-top { position: fixed; bottom: 32px; right: 32px; width: 44px; height: 44px; border-radius: 50%; background: var(--primary); color: white; border: none; cursor: pointer; box-shadow: var(--shadow-md); display: flex; align-items: center; justify-content: center; opacity: 0; transform: translateY(16px); transition: all .25s ease; z-index: 200; }
.back-to-top.visible { opacity: 1; transform: translateY(0); }
```

```js
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => { backToTop.classList.toggle('visible', window.scrollY > 400); });
backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
```

## Notes

- **Never use fixed pixel width** — all `width` uses relative units or `max-content`
- **SVG only for connection lines** — nodes and text are HTML elements
- **Branch connectors use small SVG** — because fork shapes aren't purely vertical, CSS pseudo-elements are too complex
- **Responsive** — `@media (max-width: 900px)` hide sidebar, main full-width
- **lang="zh-CN"** — Chinese font stack includes `'Noto Sans SC'`
