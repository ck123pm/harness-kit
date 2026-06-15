---
name: md-to-html-doc
description: Convert Markdown architecture docs into modern, responsive single-page HTML with sidebar nav, flowcharts, and state-machine diagrams
---

# Markdown to Modern HTML Doc

Convert Markdown architecture documents into modern, responsive single-page HTML.

## Flow

1. Read the source Markdown and understand its structure.
2. Generate a complete HTML document at the requested output path.
3. Verify the result when possible.

## Requirements

- Every output must be a full HTML document.
- Every document must include a fixed left sidebar for section navigation.
- Every document must include a fixed back-to-top button.
- Prefer HTML and CSS layouts for diagrams instead of large fixed-coordinate SVGs.
- If SVG is needed, use `width="100%"` with an adaptive `viewBox`.
- The result must be responsive on desktop and mobile.

## Diagram Rules

- Vertical flows: use stacked HTML blocks with CSS connectors.
- Branches: use flex or grid for layout; use only small SVG connectors if necessary.
- State machines: prefer HTML layout for nodes and CSS for arrows.
- Avoid hard-coded SVG text coordinates unless there is no cleaner option.

## HTML Skeleton

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document Title</title>
  <style>
    /* CSS variables and component styles */
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <h1>Document Title</h1>
      <span>Subtitle</span>
    </div>
    <nav>
      <a href="#section-id">Title</a>
      <a href="#subsection-id" class="depth-2">Subtitle</a>
    </nav>
  </aside>

  <main class="main">
    <section id="section-id">
      <h2>Title</h2>
    </section>
  </main>

  <button class="back-to-top" id="backToTop">Top</button>

  <script>
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  </script>
</body>
</html>
```

## Conversion Rules

| Markdown content | HTML conversion |
| --- | --- |
| Heading hierarchy | Sidebar anchors plus section ids |
| Tables | Scrollable table wrapper |
| Code blocks | `<pre><code>` |
| Ordered steps | Structured list or cards |
| Flowchart-like content | HTML nodes plus CSS connectors |

## Output Expectations

- Preserve meaning; improve presentation.
- Generate one self-contained HTML file per source document unless the caller asks otherwise.
- If the source is intended for `.harness/wiki/`, keep `index.html` as the wiki entry page.
