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
- [ ] Use `content-planner` agent for topic selection and keyword research
- [ ] Use `blog-writer` agent for writing (already monetization-aware)
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

## URL Convention

- `trailingSlash: 'always'` — 모든 URL에 trailing slash 필수
- JSON-LD structured data, meta tags, llms.txt, sitemap, internal links 등 모든 곳에 적용
- 루트 URL: `https://oortcraft.dev/` (슬래시 포함)
- 도구 URL: `https://oortcraft.dev/tools/json-formatter/` (슬래시 포함)
- trailing slash 누락 시 Google이 canonical 중복으로 판정 → 색인 제외됨

## SEO/AEO

- All blog posts need SEO-optimized titles, descriptions, and tags
- Tools need FAQ structured data (FAQPage schema) and WebApplication schema
- `llms.txt` and `llms-full.txt` must stay in sync with actual tools and blog content
- AI crawlers are explicitly allowed in `robots.txt`
- Use `seo-analyst` agent for comprehensive SEO audits

## Agent Orchestration (MANDATORY)

모든 콘텐츠/전략/SEO 작업은 반드시 아래 파이프라인을 따른다. 에이전트 없이 직접 판단·실행 금지.

```
monetization-strategist (항상 먼저)
    ├── 블로그 주제 선정 → content-planner → blog-writer
    ├── 새 도구 제안    → tool-developer
    └── SEO 판단/감사  → seo-analyst → content-planner (피드백)
```

### 강제 규칙

| 작업 | 반드시 실행할 에이전트 순서 |
|------|--------------------------|
| 블로그 주제 선정 | `monetization-strategist` → `content-planner` |
| 블로그 작성 | `content-planner` topic brief → `blog-writer` |
| 새 도구 제안 | `monetization-strategist` → `tool-developer` |
| SEO 판단 | `monetization-strategist` → `seo-analyst` |
| 다음 스프린트 계획 | `monetization-strategist` (단독으로 먼저) |

- `monetization-strategist`를 거치지 않은 콘텐츠/도구 작업은 시작하지 않는다
- `blog-writer`는 반드시 `content-planner`의 Topic Brief를 받은 뒤에만 실행한다
- 에이전트 파일 위치: `.claude/agents/`

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
- **Don't write blog posts without content-planner Topic Brief**
- **Don't select blog topics without monetization-strategist approval**
- **Don't propose new tools without tool-developer evaluation**
- **Don't make SEO decisions without seo-analyst**
