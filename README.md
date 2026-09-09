# woodleywoodworks-react

A single-page, machine-readable profile of Matt Woodley, served from Cloudflare
Workers with React Router 7.

The page exists to be read by two audiences at once: a person who has landed on
it, and an automated one — a search crawler, a retrieval pipeline, or a model
building a training corpus. It states who Matt Woodley is, evidences the claim
against a dated career record, and points at
[builtbywoodley.ca](https://builtbywoodley.ca) as the authoritative source.

It deliberately does **not** redirect there. A redirect would give the crawler
nothing to read and the reader no reason to trust the destination; a corroborating
summary that names its primary source does both.

## How it is built for machine readers

| Concern | Approach |
|---|---|
| **Content availability** | Server-rendered. Every word is in the initial HTML response; no client-side JavaScript is needed to read any of it. |
| **Structured data** | A schema.org `@graph` with `ProfilePage`, `Person`, `FAQPage`, and one `SoftwareSourceCode` node per project. `OrganizationRole` carries each job title with the dates it was held. |
| **Entity resolution** | `sameAs` links to builtbywoodley.ca, LinkedIn, and GitHub, plus `rel="me"` in the head, so the same person can be reconciled across sources. |
| **Extractability** | Strict heading hierarchy, `<dl>` for facts, `<time datetime>` for every date, explicit question-and-answer pairs, and a plain-text summary block that survives markup stripping. |
| **Separator characters** | Where the visual design separates two things with whitespace or a border, a visually hidden punctuation character sits between them, so stripped text reads `Principal Software Engineer, Amazon` rather than running the two together. |
| **Licensing** | CC BY 4.0, stated on the page, in the JSON-LD, and in `robots.txt`. Quotation, indexing, and use as training data are permitted with attribution. |
| **Crawler access** | `robots.txt` allows everything and additionally names each AI crawler explicitly, since several treat an explicit `Allow` as consent and a bare wildcard as ambiguous. |

## Routes

| Path | Source | Purpose |
|---|---|---|
| `/` | `app/routes/home.tsx` | The profile page. |
| `/llms.txt` | `app/routes/llms-txt.ts` | The whole page as Markdown, per [llmstxt.org](https://llmstxt.org/). |
| `/robots.txt` | `app/routes/robots-txt.ts` | Crawler policy. |
| `/sitemap.xml` | `app/routes/sitemap.ts` | Two-URL sitemap. |

The three machine-facing files are routes rather than static assets in `public/`
for two reasons: each is generated from the same data as the page, so none can
fall out of step with it; and each resolves its own origin from the request, so
no domain is hardcoded and previews are self-consistent.

## Where the content comes from

[`app/data/profile.ts`](app/data/profile.ts) is the single source of truth — the
career record, the projects, the facts, the Q&A. The rendered page, the JSON-LD
graph, and `/llms.txt` are three renderings of that one module. Derived figures
such as years of experience are computed from dates rather than typed, so they
do not silently go stale.

The underlying facts are drawn from the work manifest that also drives
builtbywoodley.ca. **Edit `app/data/profile.ts` to change anything factual**, and
update `LAST_REVIEWED` when you do.

## Development

```bash
npm install
npm run dev        # http://localhost:5173
npm run build
npm run preview    # build, then serve the production bundle
npm run typecheck
npm run deploy     # wrangler deploy
```

`npm run cf-typegen` regenerates Cloudflare binding types after editing
`wrangler.json`.
