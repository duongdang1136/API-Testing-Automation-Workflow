# AI Battle Competition 2025 - Pitch Deck Layout

- **Format:** 10 minute presentation + 10 minute Q&A
- **Goal:** Showcase the API Testing Automation Workflow initiative and its competitive edge
- **Deck Length:** 8 core slides (+ optional appendix/backup as needed)

## Slide 1 - Title & Presenter Hook
- **Purpose:** Introduce the presenter and establish the initiative name fast.
- **Key Talking Points:** Personal role, team name, one-line value proposition of the workflow.
- **Prototype Cues:** Use the hero treatment from `src/components/ProjectDashboard.tsx` (header typography + CTA style) as visual anchor.
- **Visual Treatment:** Full-bleed cover with gradient backdrop, team logo/avatar, competition branding.
- **Time Allocation:** ~1 min.
- **Speaker Reminder:** End with the pitch promise (e.g., "Cut API regression prep from days to hours"). Add session agenda bar at bottom.

## Slide 2 - Problem Context (Situation Before)
- **Purpose:** Frame pain points before adopting the workflow.
- **Key Talking Points:** Manual API testing bottlenecks, scattered specs, inconsistent coverage.
- **Prototype Cues:** Reference stats cards and filters from `ProjectDashboard` to visualize fragmented tracking; optionally overlay warning badges from `TeamManagementTab`.
- **Visual Treatment:** Split layout with left text narrative and right column using dashboard metrics screenshot annotated in red.
- **Time Allocation:** ~1.5 min.
- **Speaker Reminder:** Quantify baseline (e.g., "3 days per API suite, 40% rework").

## Slide 3 - Initiative Purpose & Vision
- **Purpose:** Articulate the initiative goals aligned with competition theme.
- **Key Talking Points:** Unified workspace, AI-assisted requirement capture, automation-first mindset.
- **Prototype Cues:** Highlight journey chips/steps from `TestGenerationPage.tsx` and mission copy from the dashboard subtitle.
- **Visual Treatment:** Three-column vision statements with icons (`Sparkles`, `FileText`, `Code2`) mirroring prototype iconography.
- **Time Allocation:** ~1 min.
- **Speaker Reminder:** Tie goals directly to KPIs judged at AI Battle (speed, accuracy, collaboration).

## Slide 4 - Initiative Content: Workflow Walkthrough
- **Purpose:** Demonstrate the end-to-end experience step-by-step.
- **Key Talking Points:** Requirement intake (`RequirementCollectionStep`), AI generation (`ScriptGenerationStep`), Postman export (`PostmanExportStep`).
- **Prototype Cues:** Use sequential screenshots/frames with numbered badges matching the in-product progress indicators and `Progress` component styling.
- **Visual Treatment:** Horizontal timeline with cards showing input > AI output > export. Embed microcopy from the UI (prompt templates, toast feedback).
- **Time Allocation:** ~2 min.
- **Speaker Reminder:** Mention live demo readiness; emphasize no code switching required for the user.

## Slide 5 - Effectiveness Metrics
- **Purpose:** Prove measurable impact post-rollout.
- **Key Talking Points:** Reduction in script authoring time, higher coverage, faster onboarding.
- **Prototype Cues:** Reuse status widgets from `ProjectDetail.tsx` and velocity stats from `VersionHistory.tsx` to show before/after bars.
- **Visual Treatment:** Dual bar/line charts using the light-theme card styling; include callout badges (green `CheckCircle2`) for achieved targets.
- **Time Allocation:** ~1.5 min.
- **Speaker Reminder:** Cite pilot numbers from `sampleProjects` (e.g., FangTV vs FPT Play projects).

## Slide 6 - Novelty & Creativity
- **Purpose:** Spotlight differentiators for judges.
- **Key Talking Points:** Prompt library, AI simulators (`src/utils/aiSimulator.ts`), collaborative handoff flows.
- **Prototype Cues:** Showcase collapsible prompt templates, live generation modals, and team avatars.
- **Visual Treatment:** Mosaic layout with three tiles, each featuring a GIF or static capture plus a short caption.
- **Time Allocation:** ~1 min.
- **Speaker Reminder:** Compare with traditional Postman workflows; reinforce AI-assisted creativity.

## Slide 7 - Implementation Requirements & Roadmap
- **Purpose:** Detail what is needed to apply the initiative at scale and outline the MVP-to-Next Phase evolution.
- **Key Talking Points:** Team roles (QA, BA, Dev), tooling (Vite app, Postman, Git), data governance; roadmap split between MVP (Requirement intake -> AI generation -> Postman export) and Next Phase (collaborative reviews, regression insights, external integrations).
- **Prototype Cues:** Pair `TeamManagementTab.tsx` roster styling with the release cadence cards from `VersionHistory.tsx` to visualize ownership and timeline.
- **Visual Treatment:** Checklist card for resourcing alongside a horizontal roadmap lane with badges for MVP launch and Next Phase milestones.
- **Time Allocation:** ~1 min.
- **Speaker Reminder:** Call out the gating metrics that unlock the Next Phase (e.g., 90% automated coverage, stakeholder sign-off) and link to supporting documentation.

## Slide 8 - Q&A + Call to Action
- **Purpose:** Transition to Q&A while reinforcing the ask.
- **Key Talking Points:** Invite questions, offer demo sandbox, highlight next milestone.
- **Prototype Cues:** Reuse success toast styling (`sonner`) for a "Ready to test it?" CTA; show a compact summary of active projects.
- **Visual Treatment:** Minimalist dark-on-light slide with CTA button motif centered.
- **Time Allocation:** ~1 min (before opening floor).
- **Speaker Reminder:** Prompt judges to focus on effectiveness/novelty and mention backup slides availability.

### Optional Backup Slides (Appendix)
- KPI deep-dive sourced from `sampleData` (coverage by feature).
- Architectural diagram of AI pipeline referencing `aiSimulator.ts`.
- Implementation roadmap with release cadence (`VersionHistory` data).
