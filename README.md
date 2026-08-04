# Anthropac Workbench

Anthropac Workbench is a lightweight, browser-based app inspired by ANTHROPAC workflows for cultural domain analysis. It supports:

- **Freelisting**: enter participant lists and review frequency, first mentions, average rank, and a rank-weighted salience score.
- **Pile sorting**: enter labeled piles and inspect a shared item co-occurrence matrix.
- **Project export**: download study data and computed inputs as JSON for audit trails or later analysis.

## Run it locally

You only need Node.js 18 or newer. The app has no third-party runtime dependencies, so `npm install` is optional unless you want npm to create a lockfile.

```bash
git clone <repository-url>
cd Anthropac
npm start
```

Then open <http://localhost:5173> in your browser.

If port `5173` is already in use, set a different port:

```bash
PORT=8080 npm start
```

## Validate the project

```bash
npm test
npm run build
```

`npm run build` copies the static app into `dist/`, which can be hosted by any static file server.

## Using the prototype

1. Edit the domain name at the top of the page.
2. Add freelists by participant. Items can be comma-separated, semicolon-separated, or one item per line.
3. Add pile sorts with one pile per line, such as `Staples: rice, beans`.
4. Review freelist salience and the pile-sort similarity matrix.
5. Click **Export JSON** to download the project data for archiving or downstream analysis.
