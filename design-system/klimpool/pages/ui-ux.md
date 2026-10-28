# KlimPooL UI/UX — Expressive Override

This page override is the source of truth for the UI review artifact. It takes precedence over the generated MASTER palette because the project brief explicitly sets the visual direction.

## Direction

Modern, playful, bold and expressive. Use a structured 12-column grid, a white surface, visible hierarchy, and small playful accents derived from the pink and blue tokens. Keep the interface calm enough for donation, verification, and volunteer decisions.

## Tokens

```css
:root {
  --color-primary: #DB2777;
  --color-secondary: #2563EB;
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-danger: #DC2626;
  --color-surface: #FFFFFF;
  --color-text: #111827;
  /* Supporting neutrals are derived from the supplied text/surface tokens. */
  --color-muted: rgba(17,24,39,.62);
  --color-line: rgba(17,24,39,.12);
  --color-primary-soft: rgba(219,39,119,.10);
  --color-secondary-soft: rgba(37,99,235,.10);
  --font-sans: "IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, monospace;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px;
  --radius-control: 12px; --radius-card: 20px;
  --shadow-card: 0 12px 28px rgba(17,24,39,.08);
  --duration: 200ms;
}
```

Soft backgrounds in the prototype use low-opacity variants of the supplied pink, blue, warning, and text tokens. They are supporting tints, not additional semantic palette colors.

## Screen map

- Public discovery and search: UC05, KF13–KF14. Published campaign/project cards show category, location, status, target, and details.
- Project detail and donation sheet: UC06, KF15–KF18, KF26. Balance, valid amount, closed state, duplicate request, atomic success/error, receipt, and updated percentage are represented.
- Volunteer application: UC07, KF19–KF20. Required data diri, keahlian, pengalaman, availability; pending status; duplicate and closed/fully booked errors.
- Volunteer management: UC08, KF21–KF22. Applicant details, accept/reject, accepted instructions, and empty state.
- Progress update: UC09, KF23–KF25. Owner/admin access gate, milestone/status, documentation validation, timestamped history.
- History and traceability: UC10. Chronological donation/progress entries, detail state, and empty state.

## Accessibility and interaction

- Base text is 16px with 1.5 line-height; all text and controls use the supplied palette and maintain readable contrast.
- Visible `:focus-visible` ring on every interactive control; icon-only controls have an accessible label.
- Controls are at least 44px tall on mobile; spacing between adjacent touch targets is at least 8px.
- Validation uses inline messages connected to fields, plus a focusable summary for failed submission.
- Motion uses 150–250ms transitions and is disabled under `prefers-reduced-motion`.
- Status is communicated with text and a color accent, never color alone.
- Layout is mobile-first and avoids horizontal scrolling.

## Deliverables

- `docs/M7/ui-ux/prototype.html` — self-contained interactive review prototype.
- `docs/M7/ui-ux/figma/klimpool-figma-board.svg` — SVG board with tokens, components, and representative frames; import directly into Figma.
