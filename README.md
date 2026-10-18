# Breeding Concepts

Interactive pages explaining concepts from Falconer & Mackay's *Introduction to Quantitative Genetics* and Fehr's *Principles of Cultivar Development*. Each page pairs a short explanation and the key equations with a widget that runs in the browser.

Built with [Quarto](https://quarto.org) and Observable JS, published to GitHub Pages by `.github/workflows/publish.yml` on every push to `main`.

## Working locally

```sh
quarto preview      # live-reloading local server
quarto render       # build the site into _site/
```

## Adding a concept page

1. Create a `.qmd` file under `quantgen/` (Falconer & Mackay) or `cultivar/` (Fehr).
2. Write the explanation in Markdown with LaTeX math, and the widget in `{ojs}` cells. Inputs made with `viewof x = Inputs.range(...)` update every cell that uses `x`.
3. Add the page to the sidebar in `_quarto.yml` and tick it off in `roadmap.qmd`.
