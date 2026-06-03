# Noble Grounds Launch Assets

Add final brand assets here before launch. Do not commit placeholder or oversized
production assets unless they are intentional.

Recommended files:

- `logo.svg` - main header/footer logo, preferably SVG.
- `logo-white.svg` - light logo for dark backgrounds.
- `favicon.ico` - browser tab icon.
- `apple-touch-icon.png` - 180x180 PNG for iOS home screen.
- `og-noble-grounds.png` - 1200x630 social sharing image.

Current notes:

- `og-noble-grounds.svg` is a lightweight placeholder Open Graph image.
- `logo.png` exists locally but should be checked for final brand quality and
  compressed before use in the live UI if it is kept.

When final assets are ready, update:

- `data/site.ts` for `siteConfig.ogImage`.
- `app/layout.tsx` metadata icons if favicon/apple assets are added.
- Header/footer logo components if replacing the text mark.
