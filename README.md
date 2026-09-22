# Porto Docs

Source for [docs.portolabs.xyz](https://docs.portolabs.xyz), built with [Docusaurus](https://docusaurus.io).

The London 0.1.0 draft implementation specification is maintained in `london-0.1.0/` and included in the current site build at `/london-0.1.0/overview`. It is a proposal, not an approved or deployed architecture.

Existing canonical protocol content is mirrored: `docs/whitepaper.md` and `docs/pips/` are generated at build time by `scripts/pull-content.mjs`, which clones:

- [`porto-labs-xyz/whitepaper`](https://github.com/porto-labs-xyz/whitepaper) → `/whitepaper`
- [`porto-labs-xyz/PIPs`](https://github.com/porto-labs-xyz/PIPs) → `/pips`

To change the whitepaper or a PIP, open a PR against that source repo, not here , this site rebuilds automatically (daily, and on every push to `main` here) and picks it up.

## Local development

```bash
npm install
npm start        # pulls content, then runs the dev server at localhost:3000
```

`npm start` / `npm run build` both run `scripts/pull-content.mjs` first. The pulled content is gitignored , never commit `docs/whitepaper.md` or `docs/pips/`.

## Deployment

GitHub Actions (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages on:

- push to `main`
- a daily schedule (in case a source-repo change doesn't otherwise trigger a rebuild)
- manual dispatch (Actions tab → "Deploy docs" → Run workflow)
- `repository_dispatch` from the PIPs/whitepaper repos, so an edit there rebuilds this site within a minute or two

Custom domain is set via `static/CNAME` (`docs.portolabs.xyz`) , point a `CNAME` DNS record at `porto-labs-xyz.github.io`.

## Copyright and licence

Copyright © 2026 Entropy Tech Ltd.

The documentation content is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). Porto names, logos, and other trademarks are not licensed under this licence. The Docusaurus site code and third-party dependencies retain their respective licences.

## London draft validation

Run `npm exec docusaurus build` to validate the current local site, including London, without pulling or modifying generated PIP/whitepaper mirrors. The normal `npm run build` includes London too, and retains its existing upstream content-pull step. See `london-0.1.0/index.mdx`.
