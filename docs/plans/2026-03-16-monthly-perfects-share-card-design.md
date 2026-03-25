# Monthly Perfects, Badges, and Share Card Design

## Overview
This design adds a monthly "perfect days" chart, a badge system tied to monthly perfect rate, and a share card generator. The features are linked by a single rule: a perfect day means all tasks completed on that day. The design keeps the current component structure and data model, adds a small set of new components, and introduces a dedicated share card template rendered to an image.

## Goals
- Show a monthly cumulative perfect-days curve.
- Compute and display a monthly badge tier based on perfect rate.
- Generate a fixed-format share card image offline.
- Keep data logic centralized and UI components simple.

## Non-goals
- No server side features.
- No cross-device sync.
- No external analytics.

## User Experience
- Bottom action row shows "Export" plus a new "Share" button.
- Share button opens a modal preview of a fixed share card template.
- Share card includes: chief comment at top, badge in middle, cumulative curve below, and a quote at the bottom.
- If the month is not complete, badge is shown in a lighter color and the time range is displayed.
- The share card background image is fixed by default but user-replaceable.

## Core Rules
- Perfect day: all tasks completed for that day.
- Monthly perfect rate: perfect days / days elapsed in current month.
- Badge tiers (by perfect rate):
  - 0-50%
  - 51-84%
  - 85-99%
  - 100%
- If the month is not finished, all badges use lighter color.

## Data Flow and Computation
New derived values are computed from existing `records`:
- `monthStart`, `monthEnd`, `daysElapsed`
- `perfectDaysCount`
- `perfectRate`
- `monthProgressDone` (true when current date is last day of month)
- `perfectSeries` (daily cumulative perfect count)

Computation steps:
1. Build the list of dates for the current month.
2. For each date up to today, determine if it is perfect.
3. Accumulate perfect count for the curve.
4. Compute perfect rate and badge tier.

## Components
- `StatsPanel.vue`: displays monthly counts and the chart.
- `BadgeDisplay.vue`: renders badge tier, color (light/dark), and time range text.
- `ShareCardModal.vue`: renders the share card template and triggers image generation.

## Chart Implementation
- Use `chart.js` as an npm dependency (offline ready).
- A line chart renders `perfectSeries` with date labels.
- Chart instance created and destroyed on mount/unmount to avoid leaks.

## Share Card Generation
- Use `html2canvas` to render the share card container to PNG.
- Fixed canvas size (for example 1080x1920) to keep layout stable.
- Download is triggered by a generated anchor link.

## Quotes
- Use a built-in quote list.
- A random quote is selected at share generation time.

## Settings
- Allow users to replace the share card background image.
- Keep default image in `public/`.

## Testing Checklist
- Monthly curve matches perfect days.
- Badge tier changes at correct thresholds.
- Month not finished shows light badge and time range text.
- Share card downloads a valid image offline.
- New UI does not alter existing features.
