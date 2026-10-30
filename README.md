# Talia — Portfolio

Static site: plain HTML, CSS and JS, written mobile-first (base styles are for phones; `min-width` media queries add the tablet and desktop layouts). No build step. Open `index.html` or host the folder anywhere (GitHub Pages, Netlify, Vercel).

## Make it yours

| What | Where |
|---|---|
| Hero stickers | Put transparent WebP images in `assets/stickers/`, then change each `.sticker` `src` + `alt` in `index.html`. Stickers float in a ring around the name. All values are % of the hero, so they scale with it. `--x`/`--y`/`--w` = position + size on laptops/desktops, `--xs`/`--ys`/`--ws` = on phones and portrait tablets, `--r` = tilt. Keep them clear of the letters. |
| Projects | Duplicate an `<article class="project">`. Screenshots go in `assets/projects/`. `--tint` sets the card colour (`--pink`, `--butter`, `--sage`, `--lilac`). |
| Project pages | `projects/polar-db.html` is a case-study template. Copy it (e.g. `projects/new-project.html`), then update: the `<title>`, description and social tags in the `<head>`, the breadcrumb JSON-LD, the breadcrumb `aria-current` name, the text, facts and screenshots (in `assets/projects/<name>/`), and `--tint` on `<article class="case">`. Add a `Case study →` link to that project's card in `index.html`. |
| Testimonials | "What people say" (after About, just before the footer) shows **placeholder text**. Replace each quote, name, role and "?" initial with real ones (with permission) before going live. Add or remove `<figure class="quote">` cards freely: 3 or fewer show as a grid, 4 or more automatically become a swipeable carousel with arrow buttons. Put the strongest quote first. Add `hidden` to the `<section>` tag to hide it. |
| Skills | Edit the `<li>` chips in `#skills`. The four cards sit in a 2 × 2 grid from tablets up and stack on phones. The "Currently learning" chips sit below the cards. |
| About + FAQ | Background paragraph and drop-down Q&As in `#about` (copy a `<details class="faq__item">` to add one; its `id` lets links open it, e.g. `#nail-art`). The "Want to know more?" button under the FAQs links to `#contact`. |
| Contact / socials | Footer, repeated on all seven pages (home, five case studies and the 404 page): email, LinkedIn and GitHub. To add another social link, copy an `<li>` in `.socials` on every page. The home page also lists your LinkedIn and GitHub in its JSON-LD `sameAs` (in the `<head>`). |
| Colours | Tokens at the top of `css/styles.css` (light in `:root`, dark in the two dark blocks). Use `--accent-text` (not `--pink-strong`) for any pink **text** or focus outline: it passes WCAG AA contrast. |
| Site address | Every page `<head>` (except the 404 page) has a canonical URL and social-share tags using `https://tahleeuh.com/`. If the portfolio lives somewhere else, find-and-replace that address in every HTML file, `robots.txt` and `sitemap.xml`. Share images are in `assets/og/` (1200×630). |
| Sitemap + robots | `sitemap.xml` lists the home page and each case study for search engines; add a `<url>` for any new page and update its `<lastmod>` date. `robots.txt` allows everything and points to the sitemap. |
| 404 page | `404.html` ("Fetch failed"): shown for any address that doesn't exist. Its links start with `/`, so it only displays properly on a web server. `.htaccess` (a hidden file, so remember to upload it) tells Apache/LiteSpeed hosts to use it; GitHub Pages and Netlify pick up `404.html` on their own. Edit the "Throw it again" replies in `js/main.js`. |
| Caching + images | `.htaccess` tells browsers to keep images for a year and CSS/JS for a month. After editing `css/styles.css` or `js/main.js`, bump the `?v=` number where every page links them (e.g. `?v=2` → `?v=3`) so visitors get the new version. Home-page stickers and project thumbnails have smaller copies (`-160`, `-320`, `-480`, `-800`.webp) picked by `srcset`; make new copies if you replace one of those images. |
| Icons | `favicon.ico`, `favicon.svg`, `favicon-32.png` and `apple-touch-icon.png` in `assets/icons/`, linked from every page's `<head>`. |

Tip: for die-cut stickers, remove the background (Photoshop / remove.bg / Canva), add a thick white stroke, export around 600px wide and save as WebP (keeps the transparency at a fraction of the PNG size).

## AI Assistance

AI assistance (Claude by Anthropic) was used for planning, code suggestions, debugging and review.
