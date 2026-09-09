# Porto Docs

Source for [docs.portolabs.xyz](https://docs.portolabs.xyz), built with [Docusaurus](https://docusaurus.io).

This repo holds no protocol content itself. `docs/whitepaper.md` and `docs/pips/` are generated at build time by `scripts/pull-content.mjs`, which clones:

- [`porto-labs-xyz/whitepaper`](https://github.com/porto-labs-xyz/whitepaper) → `/whitepaper`
- [`porto-labs-xyz/PIPs`](https://github.com/porto-labs-xyz/PIPs) → `/pips`

To change the whitepaper or a PIP, open a PR against that source repo, not here — this site rebuilds automatically (daily, and on every push to `main` here) and picks it up.

## Local development

```bash
npm install
npm start        # pulls content, then runs the dev server at localhost:3000
```

`npm start` / `npm run build` both run `scripts/pull-content.mjs` first. The pulled content is gitignored — never commit `docs/whitepaper.md` or `docs/pips/`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages on:

- push to `main`
- a daily schedule (in case a source-repo change doesn't otherwise trigger a rebuild)
- manual dispatch (Actions tab → "Deploy docs" → Run workflow)
- `repository_dispatch` from the PIPs/whitepaper repos, so an edit there rebuilds this site within a minute or two

Custom domain is set via `static/CNAME` (`docs.portolabs.xyz`) — point a `CNAME` DNS record at `porto-labs-xyz.github.io`.
