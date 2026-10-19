# Discounts for Seniors — Hugo Theme

A responsive Hugo theme based on the supplied Discounts for Seniors website concept. It includes the cream and rust palette, bold editorial hero, category tiles, scenic promotional band, featured deal cards, article cards, newsletter section, and compact mobile navigation.

## Requirements

- Hugo Extended 0.120.0 or newer
- Internet access for Google Fonts and the Unsplash demo photography (replace these with locally licensed images before production if desired)

## Quick start

1. Create a Hugo site: `hugo new site my-senior-discounts`
2. Copy this theme folder into `my-senior-discounts/themes/discounts-for-seniors`
3. Copy `exampleSite/hugo.toml` to your site root as `hugo.toml` and change `baseURL`.
4. Copy `exampleSite/content/*` into your site's `content/` directory.
5. In `hugo.toml`, keep `theme = "discounts-for-seniors"`.
6. Run `hugo server -D` and open the local address Hugo prints.

Alternatively, use this folder itself as the starting point: copy `exampleSite/hugo.toml` to the project root, copy `exampleSite/content/` to the project root, and run `hugo server` from the theme folder after installing Hugo Extended.

## Customizing

- **Brand and navigation:** `layouts/partials/header.html` and `layouts/partials/footer.html`
- **Homepage sections and copy:** `layouts/index.html`
- **Colors, spacing and responsive breakpoints:** `assets/css/main.css` (CSS variables are at the top)
- **Category tiles and homepage sample cards:** `exampleSite/hugo.toml` under `[params]`
- **Real offers and articles:** add Markdown files under `content/discounts/` and `content/articles/`
- **Images:** each content page accepts an `image` front matter field. Homepage sample images are configured in `hugo.toml`.

## Search note

The header includes a search form that points to `/search/`. This is a visual and structural starting point, not a complete search index. Add a search page and client side index (for example, Pagefind or Fuse.js) before launch.

## Production notes

- Demo offer copy is illustrative. Verify all offer terms and claims before publishing.
- Replace social placeholder links, signup action, login, contact and policy routes with real destinations.
- For privacy and accessibility, connect newsletter signup to a provider and test keyboard navigation, contrast and screen reader behavior.
- The mockup includes a location search map. A production directory can add a dedicated locations template and map provider once data and API requirements are known.

## License

MIT. See `LICENSE`.
