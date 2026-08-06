# Contributing

Thanks for helping improve Planet Maker. The project is intentionally small, local-first, and approachable.

## Before opening a pull request

1. Open an issue for behavior changes that affect project files, bundled assets, or the offline boundary.
2. Keep UI copy and controls direct: the editor should feel like an application, not a marketing page.
3. Keep user content in the browser. Do not add analytics, accounts, API routes, database clients, or remote generation without an accepted proposal.
4. Include the original source and license for every new bundled texture or model.
5. Test both desktop and a narrow mobile viewport.

## Development workflow

```bash
npm install
npm run dev
```

Before submitting:

```bash
npm run typecheck
npm test
npm run build
```

Add focused tests for spherical-coordinate, serialization, or image-processing changes. For visual changes, include before/after screenshots and verify the real WebGL canvas rather than only the DOM.

## Pull requests

- Use a short, imperative title.
- Explain the user-visible outcome and the verification performed.
- Keep unrelated refactors separate.
- Preserve `THIRD_PARTY_NOTICES.md` and asset-specific license files.

By contributing, you agree that your source-code contribution is licensed under MIT and that third-party assets retain their stated licenses.
