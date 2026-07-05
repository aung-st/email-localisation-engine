# Email Localisation Engine

A React app that translates email content via LibreTranslate, with placeholder preservation and an inline email preview.

## How to run

```bash
npm install
npm run dev       # Dev server at http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview the production build
npm test          # Run tests (Jest)
npm run lint      # ESLint
npm run format    # Prettier
```

Requires a running [LibreTranslate](https://libretranslate.com/) instance. Set `VITE_BASE_URL` in `.env` to point at it

## Technologies

| Library           | Purpose                  |
| ----------------- | ------------------------ |
| React 19          | UI framework             |
| TypeScript 6      | Type safety              |
| Vite 8            | Build tool / dev server  |
| Jest + ts-jest    | Unit & integration tests |
| ESLint + Prettier | Linting & formatting     |
| mammoth           | DOCX → text extraction   |
| LibreTranslate    | Translation engine       |

## Assumptions

- The scope of the project was to translate email bodies and have it inserted into the html email template
- LibreTranslate server is running and reachable at the configured `VITE_BASE_URL`
- CSV files use a section-key first column with content in remaining columns
- Placeholder patterns to preserve: `{{variable}}` merge tags and `https://` URLs
- The email template can be styled slightly
- Single-column CSVs produce no output — the parser expects `section,content` pairs

## AI tools used

Development assisted by [opencode](https://opencode.ai) for tasks such as layout changes, generating test cases, and drafting the initial factory pattern.

[Gemini](https://gemini.google.com) for rubber duck debugging.

## What could be improved with more time

- **Other localisation engines** — the factory pattern supports it; only needs a `DeepLTranslateEngine` and `DeepLTranslateFactory` for example
- **More file formats** — support for XLSX, HTML email imports
- **Email template customisation** — let users edit template variables in the UI
- **UI internationalisation** — the tool localises emails but the interface itself is English-only
- **CTA layout and length validation** — Implement safeguards to prevent HTML button layouts from breaking or truncating when localisation or variable insertion dynamically alters Call-to-Action text length.

And more.

## My thought process

[View the process documentation](docs/process.md)
