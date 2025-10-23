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

## Slide 7 Necessary Conditions for Application
Technical Stack:
- Frontend: NextJS 
- Backend: Supabase (Auth, Database, Storage)
- AI: Gemini
- Deployment: Vercel

Team & Timeline:
- 2 Developers (1 FE + 1 BE)
- Development: 1 month
- Maintenance: Dedicated support rotation

Essential Requirements:
- System Prompt: OK
- SRS Documents: OK
- Quality process : OK
- AI API credits (~$X/month): Next Slide

## Slide 8 Phân tích Token Usage (Gemini API)
Actual Usage Data (1 Flows)

Input tokens: 1,733
Output tokens: 15,825
Total tokens: 17,558
Total Cost: $0.040083

*Token Flow Visualization*
```
END-TO-END TOKEN FLOW (3-Step Process)
═══════════════════════════════════════════════════════

USER INPUT
  "I need tests for Login OTP API with OAuth2..."
    │
    ▼
┌─────────────────────────────────────────────────────┐
│ STEP 1: List Requirements                           │
│ ─────────────────────────────────────────────────   │
│ Input:  1,406 tokens  ($0.012)                      │
│ Output: 4,781 tokens                                │
│                                                     │
│ ✓ Parse user requirements                           │
│ ✓ Extract API endpoints                             │
│ ✓ Identify test scenarios                           │
│ ✓ Structure data for next step                      │
└─────────────────────────────────────────────────────┘
    │(output becomes input) 
    ▼
┌─────────────────────────────────────────────────────┐
│ STEP 2: Generate Test Scripts                       │
│ ─────────────────────────────────────────────────   │
│ Input:  275 tokens  ($0.013)                        │
│ Output: 5,157 tokens                                │
│                                                     │
│ ✓ Create pre-request scripts                        │
│ ✓ Generate pm.test() assertions                     │
│ ✓ Setup environment variables                       │
│ ✓ Add helper functions                              │
└─────────────────────────────────────────────────────┘
    │(output becomes input) 
    ▼
┌─────────────────────────────────────────────────────┐
│ STEP 3: Export Postman JSON                         │
│ ─────────────────────────────────────────────────   │
│ Input:  52 tokens  ($0.015)                         │
│ Output: 5,869 tokens                                │
│                                                     │
│ ✓ Format as Postman Collection v2.1                 │
│ ✓ Add request/response examples                     │
│ ✓ Include documentation                             │
│ ✓ Generate collection metadata                      │
└─────────────────────────────────────────────────────┘
    │
    ▼
POSTMAN COLLECTION.JSON
  Ready to import into Postman

═══════════════════════════════════════════════════════
TOTAL TOKENS: 17,558
TOTAL COST:   $0.040083 per complete flow
═══════════════════════════════════════════════════════
```



Monthly Budget Estimation
*Scenario 1: Small Team (50 QA/Devs)*
Usage: 10 flows/person/week
Monthly: 50 users × 10 flows/week × 4 weeks = 2,000 flows
Total tokens: 17,558 × 2,000 = 35,116,000 tokens
Monthly cost: $0.040083 × 2,000 = $80.17
Annual cost: $962



## Slide 9 Budget Slide
"OPERATIONAL COSTS (ANNUAL)

AI Processing:        $962
  • Gemini API
  • ~2,000 flows (6,000 requests)/month
  • 50 active users

Infrastructure:       $24
  • Supabase (database):	FREE TIER
  • Vercel (hosting):	FREE TIER
  • Domain & SSL:	$24

──────────────────────────
TOTAL ANNUAL:        $986

TIME SAVED: ~166 hours/month = 20 main-days
(5 min/manual script × 2000 flows (6,000 requests))

PRODUCTIVITY GAIN: 50-70%




## Slide 10 - Q&A + Call to Action
- **Purpose:** Transition to Q&A while reinforcing the ask.
- **Key Talking Points:** Invite questions, offer demo sandbox, highlight next milestone.
- **Prototype Cues:** Reuse success toast styling (`sonner`) for a "Ready to test it?" CTA; show a compact summary of active projects.
- **Visual Treatment:** Minimalist dark-on-light slide with CTA button motif centered.
- **Time Allocation:** ~1 min (before opening floor).
- **Speaker Reminder:** Prompt judges to focus on effectiveness/novelty and mention backup slides availability.
