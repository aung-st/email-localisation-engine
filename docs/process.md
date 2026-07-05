# Thoughts, Choices & Motives

## Localisation Engine Factory

- **What I did:** Built a Factory Pattern to spin up the translation engines.
- **Why:** Scalability. Right now it might just be one or two engines, but if I want to add something like DeepL later, I don't want to rewrite the core logic. With the factory, I just drop in the new engine class, hook it up to the switch statement, and the rest of the app doesn't even notice the difference. Keeps things completely decoupled.

## Choosing LibreTranslate

- **What I did:** Picked LibreTranslate over other options. Beyond the suggested services I also took a glance at ChatGPT, Microsoft Translator, etc.
- **Why:** No cost. Being able to host it locally on a server means I don't have to worry about hitting API usage limits, paying monthly fees, or dealing with rate limiting while testing.

## Minimal Front-End Draft

- **What I did:** Threw together a barebones UI right after getting the engine running.
- **Why:** Sanity check. I needed to actually see how the parser behaves in real-time rather than just looking at logs. It helps catch UI/UX quirks early—like layout breaks or text truncation issues—before spending too much time polishing the code. Styling was to be done near the end.

## Building the Core Parser

- **What I did:** Built out the actual email parser logic next.
- **Why:** Core business logic. Once the translation plumbing was solid and I had a basic UI to test with, it was time to handle the heavy lifting—extracting the HTML, preserving links/URLs, keeping merge tags like `{{first_name}}` intact, and making sure dynamic text shifts didn't break the layout.

**Placeholder preservation (`src/utils/translate.ts`):**

`{{variable}}` merge tags and `https://...` URLs need to survive translation unchanged.

- **Failed approach:** Sequential placeholders (`__PH_0__`, `__PH_1__`). LibreTranslate's model either stripped the underscores or translated `PH` as a word, so the placeholder was gone by restore time.
- **Current approach:** Each preserved segment is replaced with a full UUID (`crypto.randomUUID()`) — e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`. UUIDs are too long and random for any NMT vocabulary, so they pass through translation untouched. A `Map<uuid, original>` tracks the mapping for restoration via `replaceAll`.

This is engine-agnostic — the extract/translate/restore pipeline lives in `translate.ts` before any engine call.

## The iFrame Text Line-Break Fix

- **What I did:** Noticed the translated text body inside the preview modal wasn't breaking into new lines because it was rendered inside an iframe, so I tweaked the underlying HTML template.
- **Why:** Visual accuracy. The iframe was stripping or ignoring standard layout styling, causing the email body to look like a giant wall of continuous text. Tweaking the template wrapper itself forced proper text-wrapping and line breaks, making sure the parsed email actually matches what a user would see in their inbox.

## Matching Page & Template Styling

- **What I did:** Styled the front-end page to look visually similar to the email template itself.
- **Why:** Consistency. Having the app's interface match the look and feel of the email template made it way easier to spot layout regressions. It keeps the workspace unified so what I see on the page mirrors how the final parsed email should feel.
