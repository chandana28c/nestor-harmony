

# KodNest Premium Build System — Design System

A calm, intentional, and coherent design foundation for a serious B2C product. Every pixel follows a single design mind.

---

## 1. Theme & Color Tokens

Establish the full color system in CSS variables:
- **Background**: `#F7F6F3` (off-white)
- **Foreground/Primary text**: `#111111`
- **Accent**: `#8B0000` (deep red), with a subtle hover variant
- **Success**: Muted green (`#2D6A4F`-range)
- **Warning**: Muted amber (`#B08D57`-range)
- **Borders & Muted surfaces**: Derived neutrals from the off-white base
- Dark mode excluded — this is a light-only, calm system

## 2. Typography

- **Headings**: Serif font (e.g., `'Playfair Display'` or `'Lora'`), large sizes, generous letter-spacing, confident weight
- **Body**: Clean sans-serif (e.g., `'Inter'`), 16–18px, line-height 1.6–1.8
- **Text blocks**: Max-width 720px for readability
- Consistent type scale: no random sizes, everything maps to the spacing system

## 3. Spacing Scale

Enforce a strict spacing system across all components:
- `8px`, `16px`, `24px`, `40px`, `64px`
- Mapped to Tailwind utility classes for consistent use everywhere

## 4. Global Layout Shell

A persistent layout wrapper used on every page:
- **Top Bar**: Project name (left), progress indicator "Step X / Y" (center), status badge (right) with states: Not Started, In Progress, Shipped
- **Context Header**: Large serif headline + one-line subtext below the top bar
- **Split Workspace**: 70/30 layout — Primary Workspace (left) + Secondary Panel (right)
- **Proof Footer**: Persistent bottom checklist — □ UI Built □ Logic Working □ Test Passed □ Deployed

## 5. Core UI Components (Restyled)

Restyle the existing shadcn/ui components to match the design system:
- **Buttons**: Primary = solid deep red with white text; Secondary = outlined with deep red border. Consistent border-radius and hover transitions (150–200ms ease-in-out)
- **Inputs**: Clean 1px borders, no heavy shadows, clear focus ring using accent color
- **Cards**: Subtle 1px border, no drop shadows, balanced padding from the spacing scale
- **Badges**: Status badges for the top bar (muted background tints for each state)
- **Checkboxes**: For the proof footer, clean and minimal

## 6. Secondary Panel Component

A reusable sidebar panel containing:
- Step explanation text (short, clear)
- Copyable prompt box (with copy button)
- Action buttons: Copy, Build in Lovable, It Worked, Error, Add Screenshot
- All styled calmly — no visual noise

## 7. Error & Empty States

- **Error states**: Explain what went wrong + clear next step to fix it, never blame the user
- **Empty states**: Show a purposeful message with a clear next action, never feel dead or broken

## 8. Demo Page

A single demonstration page that showcases all components together in the global layout structure, confirming the design system is complete and visually coherent.

