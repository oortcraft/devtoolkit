# DevToolkit (oortcraft.dev) - Project Rules

## Purpose

This is a monetization-focused developer tools site. Every decision should be evaluated through the lens of **revenue impact** — traffic, SEO, ad placement, affiliate conversion, and user retention.

## Core Principles

1. **Data-driven decisions** — Use Google Analytics, Search Console, and ad network dashboards to guide priorities. Never assume what works; measure it. Tool selection, blog topics, and feature work should be backed by keyword research and traffic data.

2. **Monetization first** — The site exists to generate revenue. Features that don't contribute to traffic, engagement, or conversion should be deprioritized. Current strategy: SEO-first + affiliate + ads (see `.claude/plans/` for full strategy).

3. **Design before code** — All new features, tools, and pages MUST be designed in Pencil MCP (`oortcraft-design.pen`) before writing code. Desktop (1440px) + Mobile (390px) designs required. Verify with screenshots before implementing.

4. **Auto-deploy on push** — `git push origin main` triggers Vercel auto-deployment. There is no staging environment. Ensure `npm run build` passes (0 errors) before pushing.

## Tech Stack

- **Framework:** Astro 6 + React 19 Islands + Tailwind CSS 4
- **Content:** MDX blog posts in `src/content/blog/`
- **Hosting:** Vercel (Hobby plan)
- **Design:** Pencil MCP with shadcn kit (`oortcraft-design.pen`)
- **Analytics:** Google Analytics 4 (env var `PUBLIC_GA_ID`)

## Architecture

- Tools are client-side only (no server processing) — privacy is a brand differentiator
- Each tool = 4-5 files: `src/lib/{name}-utils.ts` + `src/components/tools/{Name}.tsx` + `src/pages/tools/{slug}.astro` + entry in `src/lib/tools.ts`
- Blog posts: `src/content/blog/{slug}.mdx` with frontmatter (title, description, pubDate, tags, relatedTools)
- Icon for each tool is defined in `src/lib/tools.ts` (single source of truth — do NOT duplicate iconMap)

## Workflow

1. Design in Pencil (desktop + mobile)
2. Implement code following existing patterns
3. `npm run build` — must pass with 0 errors
4. Update `llms.txt` + `llms-full.txt` for new tools/blogs
5. Commit and push to main → auto-deploy

## SEO/AEO

- All blog posts need SEO-optimized titles, descriptions, and tags
- Tools need FAQ structured data (FAQPage schema) and WebApplication schema
- `llms.txt` and `llms-full.txt` must stay in sync with actual tools and blog content
- AI crawlers are explicitly allowed in `robots.txt`

## Commit Style

Follow existing pattern: `feat:`, `fix:`, `refactor:`, `content:`, `style:` prefixes with English descriptions.

## After Deploy

After committing and pushing, always update the project memory file at `~/.claude/projects/-Users-junseok-kang-Desktop-toy-devtoolkit/memory/project_devtoolkit.md` to reflect:
- Current tool count and list
- Current blog count
- Any new decisions or strategy changes
- Updated "next steps" based on what was completed

## Don't

- Don't add features without considering monetization impact
- Don't skip Pencil design step for visual changes
- Don't push without verifying build passes
- Don't hardcode iconMap in individual pages (use `tools.ts`)
- Don't add server-side processing to tools (privacy-first)
