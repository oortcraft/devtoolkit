<!-- Keep this file under 200 lines. Merge related rules, remove outdated ones. -->
# DevToolkit (oortcraft.dev) - Project Rules

## Purpose

This is a monetization-focused developer tools site. Every decision should be evaluated through the lens of **revenue impact** — traffic, SEO, ad placement, affiliate conversion, and user retention.

## Core Principles

1. **Design before code** — All new features, tools, and pages MUST be designed in Pencil MCP (`oortcraft-design.pen`) before writing code. Desktop (1440px) + Mobile (390px) designs required. Verify with screenshots before implementing.

2. **Auto-deploy on push** — `git push origin main` triggers Vercel auto-deployment. There is no staging environment. Ensure `npm run build` passes (0 errors) before pushing.

## Monetization-First Framework

### Strategic Alignment
All work must align with the 5 principles in `.omc/plans/monetization-strategy.md`.
Before proposing new work, check: does it serve the current milestone's priorities?
Current milestone: 0-1K PV → 70% content, 20% SEO, 10% distribution.
Use `monetization-strategist` agent for cross-cutting prioritization decisions.

Every proposal must include quantitative justification. "I think this would be useful" is not sufficient — cite data.

### New Tool Checklist
- [ ] Estimated monthly search volume (Google Keyword Planner / Ahrefs free)
- [ ] Number of competing free tools (top 3, what they lack)
- [ ] Tool taxonomy: Commodity (traffic play) / Differentiator (retention) / Hub (internal linking)
- [ ] Revenue path: ad impressions, affiliate potential, or conversion to other tools
- [ ] Use `tool-developer` agent for full evaluation

### New Feature Checklist
- [ ] Which revenue metric does this improve? (traffic, engagement, conversion, retention)
- [ ] Expected impact: quantify if possible (e.g., "+10% session duration", "enables affiliate for X")
- [ ] If no measurable impact, deprioritize

### Blog Content
- [ ] Use `blog-writer` agent (already monetization-aware)
- [ ] contentType classification required (money/traffic/linkbait)

### Bug Fix / Refactor
- [ ] Is this on a revenue-critical page? (homepage, top-traffic tools, ad-enabled pages)
- [ ] Does it affect SEO output? (structured data, meta tags, sitemap, canonical URLs)
- [ ] If neither, normal priority — no quantitative analysis needed

### Quantitative Defaults
- Search volume: cite source and number (e.g., "1,200/mo — Ahrefs")
- CPC: cite if available (signals commercial intent)
- Competition: "3 free tools exist, none have X feature"
- Traffic projection: conservative estimate based on SERP position assumptions
- Time-box: Review and calibrate these checklists after reaching 1,000 monthly sessions

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
5. Commit and push to main

## Deploy

1. `git push origin main` — GitHub-Vercel 연동으로 자동 배포 트리거
2. 배포 확인: `npx vercel ls 2>&1 | head -5` 로 최근 배포 시간 확인
3. 실제 페이지 접속 확인 (새로 추가된 URL 중 하나로 확인)
4. **배포가 안 된 경우** (push 후 새 배포가 안 보이거나, 새 페이지가 404일 때):
   - 사용자에게 "Vercel 자동 배포가 트리거되지 않았습니다. 수동 배포할까요?" 확인
   - 승인 시: `npx vercel --prod` 로 수동 프로덕션 배포
   - 배포 후 다시 페이지 접속 확인

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
