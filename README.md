# Salt&Shuffle — Weekly Meal Planner

## Overview
A personal, single-user iPhone app that takes the cognitive load out of weekly meal planning. The user feeds it the contents of their pantry, the meals they like, and which days they're eating out. The app then shuffles a week of lunches and dinners (Mon–Fri by default) and auto-generates a shopping list for the gap between pantry and plan.

Breakfast is intentionally NOT planned — the user eats oats every workday.

The product centers on one verb: **Shuffle the week**. Everything else is in service of that — pantry management, eating-out toggles, meal swaps, favorites, never-again, and a custom-meal library.

## About the Design Files
The files in this bundle are **design references created in HTML** — interactive prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in the target codebase's existing environment** (React Native, SwiftUI, Flutter, etc.) using its established patterns and libraries. If no codebase exists yet, choose the framework most appropriate for a personal iOS-first meal-planner (SwiftUI or React Native are both natural fits) and implement there.

The HTML prototypes use React + inline Babel + an `<IOSDevice>` frame purely for fidelity preview in the browser. Strip those when porting — only the visual + interaction language is what matters.

## Fidelity
**High-fidelity.** Final typography, colors, spacing, layout, and interaction patterns are committed. Recreate pixel-perfect, then substitute the codebase's existing primitives (buttons, sheets, list rows, etc.) only where they match the design's intent.

## Design Language

### "Cookbook" aesthetic
The product reads as a warm, personal pantry journal — not a SaaS tool, not a content app. The hero treatment is a serif display ("Plan for *this week.*") with a small mono caption above ("No. 19 · The Week"). Day rows feel like ledger entries. Tags read like file-card stamps.

### Visual rhythm
- Big italic serif numbers for stats
- All caps mono micro-labels with 1.2–1.4 letter-spacing for section headers
- Solid radial-gradient circular "plates" instead of food photos (the user explicitly preferred this over photos)
- Single terracotta accent for action color; everything else is cream + warm dark ink

## Design Tokens

### Colors (exact)
```
paper      #f6efe3   — main background (warm cream)
paperDeep  #ede2cd   — deeper paper variant
ink        #211c14   — primary text
inkDim     #5a4f3a   — secondary text
inkFaint   #8a7d62   — tertiary / meta text
rule       rgba(33,28,20,0.12)  — divider
ruleSoft   rgba(33,28,20,0.06)  — soft divider inside cards
accent     #b04a28   — single action color (terracotta)
card       #fffaee   — card background, slightly warmer than paper
```

Meal "plate" gradients use a `[lighter, darker]` tuple per meal (see `app/data.js` — `tint` field). These were hand-tuned per dish family (Indian = warm orange/red, salads = green, smoothies = berry/green/brown).

### Typography
```
Display   "Instrument Serif" (Google Fonts), italics often used for emphasis
Body      "IBM Plex Sans" 400/500/600
Mono      "IBM Plex Mono" 400/500 — labels, micro-caps, ingredient keys
```
Default sizes (mobile, 402×874):
- Hero display: 56px / line-height 0.95 / letter-spacing -1.5
- Sheet title: 38px / line-height 1
- Day name display: 22px italic
- Meal name: 21px italic display
- Meal sub: 12.5px body
- Mono caps labels: 9.5–10px, letter-spacing 1.2–1.4, uppercase

Display font is `--cookbook-display` CSS var so it can be swapped via the in-prototype Tweaks panel (Instrument Serif / Source Serif 4 / Geist Sans).

### Spacing & radii
- Standard horizontal padding: **22px** (gutters); **18px** for bottom bar
- Day row vertical padding: 14px
- Sheet top: 24px corner radius
- Buttons: 22px corner radius (44h pill) or 26px (52h pill, primary shuffle button)
- Icon button: 52×52, 26 radius, 0.5px rule border
- Form input: 8px radius

### Shadows
- Sheet content (no shadow, slide-up only)
- Card shuffle overlay: `0 8px 24px rgba(33,28,20,0.18)`
- Plate gradient inner ring: `inset 0 0 0 4px rgba(255,255,255,0.18)` + `0 6px 18px <plate-dark-color>40`

## Screens / Views

### 1. Week View (the home screen)
**Purpose:** see the planned week at a glance, tap any meal to act on it, hit Shuffle to regenerate.

**Layout (top → bottom):**
1. **Status bar** (iOS native; in the HTML prototype this is `<IOSStatusBar>`)
2. **Top bar** (50px pad-top, 22px h-pad) — small mono label "NO. 19 · THE WEEK" left, a circular settings/sun icon right (32×32, 0.5px border).
3. **Hero** (14/22 pad) — `Plan for / this week.` two lines, the second in terracotta italic. Below: three stat columns separated by 1px vertical rules: `cooking`, `eating out`, `meals total`. Numbers are italic 28px serif; labels are 9.5px mono caps.
4. **Slot tabs** (Lunch / Dinner) — flex 1/1, 24px serif label + 9px mono sublabel ("midday" / "evening"). Active tab gets a 28×1.5px terracotta underline at the bottom of the row + bold non-italic.
5. **Day rows** (14/18 padding, 0.5px ruleSoft divider). Each row:
   - 38px-wide left column: day code "MON" (mono caps 10/1.4) + slot time "12" or "19" (22px italic serif)
   - 56px circular meal plate (radial gradient — see `DishPlate` in `cookbook.jsx`)
   - Flex column: meal name (21px italic serif), sub (12.5px body inkDim), tag row (CTag chips: 9.5px mono caps, 0.5px rule border, 2px radius)
   - **Eating-out state:** row drops to 0.42 opacity; the plate + name area is replaced by a short rule + "EATING OUT" caps label
6. **Footer meta** (after day rows) — two tap-rows, each with serif italic title + mono sublabel + small chevron: "Shopping list" (`N items to buy`) and "What's in your kitchen" (`N items on hand`).

**Bottom bar** (absolute, gradient fade from paper at top):
- 52×52 round icon button: **Meal library** (book icon)
- 52×52 round icon button: **Pantry** (grid icon)
- 52×52 round icon button: **Shopping list** (cart icon)
- **Shuffle the week** primary button — flex:1, 52h, dark ink fill, paper text, italic serif 19px, with a rotating shuffle icon when shuffling.

### 2. Slot tabs interaction
Switching Lunch ↔ Dinner re-renders the rows; no animation needed beyond the tab underline transition.

### 3. Shuffle animation (Tweakable)
Three styles, picked from the tweaks panel:
- **Cards** (default): a stack of meal cards fans out from center on a `cubic-bezier(.4,0,.2,1)` curve over 1.2s, rotating ±8° per slot, lifting -12px, then collapsing back. Cards stagger by 0.04s. Underneath, the day-row content opacity dips to 0 then back to 1 over 0.2s.
- **Slot**: a slot-machine-style cycle — every 70ms each row swaps to a different random meal of the active slot.
- **Stagger**: rows reveal sequentially with a 20px translateX + opacity fade, 0.4s each at 0.08s intervals.

Plan changes occur partway through the animation (700/300/200ms after start) so the user sees the result settle.

### 4. Meal sheet (bottom sheet)
Triggered by tapping a day row. Slides up from bottom (`translateY(100%) → none`, 0.3s `cubic-bezier(.2,.8,.2,1)`), under a `rgba(33,28,20,0.45)` backdrop with `blur(2px)`.
- 36×4 drag handle at top
- Mono caps label: "MONDAY · LUNCH"
- 38px serif meal name
- 13px body sub
- Centered 140px circular plate
- Row of CTag chips: time, kcal, tags
- Two action buttons (44h): **↻ Swap meal** (outline) + **Eating out** (filled terracotta when active)
- Ingredients section: mono caps label + flex-wrap of CTag chips
- Steps section: numbered list with terracotta italic serif numbers (22px) + body steps with 0.5px ruleSoft dividers between steps

### 5. Pantry sheet
- Mono caps: "YOUR KITCHEN"
- 38px serif "What's in stock"
- Two-mode pill toggle: **Tick from list** / **Paste a receipt**
- **List mode:** five aisle sections (Grains & Starches / Legumes & Protein / Vegetables / Fruits / Dairy & Cold / Spices & Pantry). Each is a mono caps header + flex-wrap pill chips. On = filled terracotta + paper text. Off = transparent + 0.5px rule.
- **Paste mode:** instructional body + 160h textarea (mono 12px) on `card` bg, then a filled "Match N items" primary button that parses the textarea (split on `,` and `\n`, lowercase, substring-match against pantry keys including underscore→space variants) and merges hits into the pantry set.

### 6. Shopping list sheet
- Mono caps: "TO BUY THIS WEEK"
- 38px serif "Shopping list"
- Body meta: `N items across M aisles · gaps after pantry`
- Per-aisle sections: mono caps header + checkbox rows. Each row: 18×18 circular checkbox (terracotta when checked + paper tick), 15px body label (strike-through + inkFaint when bought), small `Nx` mono badge for count.
- Built from `buildShoppingList(plan, pantry)` — see logic in `app/data.js`.

### 7. Meal library sheet (the "add your own" entry point)
- Mono caps: "THE COLLECTION"
- 38px serif "Your meals"
- Body meta: `N lunches · N dinners in rotation`
- Three-tab pill bar: **All · N** / **♥ Favorites · N** / **Never · N**
- "+ Add your own meal" dashed border tile (only shown on All tab when not editing) — clicking it expands an inline form:
  - Name input (single line)
  - Type segmented control: Lunch / Dinner / Both
  - Ingredients textarea (mono 12px, comma-sep)
  - Cancel / Save action row — Save disabled (0.45 opacity) until name + ingredients are filled
- Meal list: each entry is a 56px plate + name (with `OWN` mono badge for custom meals) + type/sub line + two 32×32 chip buttons (heart, ban) + a trash chip if custom. Banned meals are 0.55 opacity with strike-through.

## Interactions & Behavior

### Shuffle logic (CRITICAL)
- **No repeats within a week.** Implemented via Fisher–Yates shuffle of the eligible pool (filtered to the right slot type and excluding "never again" meals), then take the first N.
- If pool size < daysCount, the shuffle falls back to cycling — only happens if the user heavily prunes their meals.
- Days marked "eating out" are skipped — their meals are preserved across shuffles (not regenerated).
- Seedable via `mulberry32` so animation styles can repro the same week.
- See `makePlan(daysCount, seed, mealsArg)` in `app/data.js`.

### Swap meal
Picks a random meal of the same slot type, excluding (a) the current meal and (b) every other meal already used in the week for that slot. If no such meal exists, the swap is a no-op.

### Favorites / Never-again
- Toggling Favorite clears Never-again (and vice versa) for the same meal.
- Never-again meals are excluded from the active pool for shuffles and swaps.
- Both states are app-state, not per-week.

### Custom meals
- Live alongside built-ins in the same pool.
- IDs are namespaced `custom_<timestamp>_<n>` so they're stable across reorderings.
- Ingredients are slugged from the comma-sep textarea (`lower`, `[^a-z0-9]+ → _`) — that slug becomes the pantry/shopping-list key. Words the user types that match known pantry keys participate in shopping-list math.
- Custom meals get a deterministic tint cycled from `CUSTOM_TINTS`.
- Custom meals can be deleted; built-ins cannot.

### Pantry paste-import
Same slug logic. Splits on `,` and `\n`, lowercases each token, then for each token: find the first pantry-master key whose slug or pretty-form is a substring of the token. Matches merge into the existing pantry set (additive, never destructive).

### Shopping list math
`buildShoppingList(plan, ownedSet)`:
1. Walk every non-eating-out day's lunch + dinner.
2. For each ingredient that isn't in `ownedSet`, increment a per-ingredient count.
3. Group by aisle (using PANTRY_MASTER as the aisle lookup; anything unknown goes to "Other").
4. Sort each aisle by count descending.

### Days planned (Tweak)
1–7 (default 5). When changed, re-shuffles immediately. Day labels come from `DAYS_FULL = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']`.

## State Model

```
{
  // Persistent
  meals: Meal[]              // built-ins + user custom
  favorites: Set<id>
  neverAgain: Set<id>
  pantry: Set<ingredient_key>

  // Per-week
  plan: Day[]
  seed: number               // current shuffle seed

  // Ephemeral
  shuffling: boolean
  activeSlot: 'lunch' | 'dinner'
  sheet: null | { kind: 'meal' | 'pantry' | 'shopping' | 'meals', ...payload }
}
```

`Day`: `{ day: 'Mon', dayLong: 'Monday', lunch: Meal, dinner: Meal, eatingOut: boolean }`

`Meal`: `{ id, name, sub, type: ('lunch'|'dinner')[], time, kcal, tags, tint: [color, color], pantry: ingredient_key[], custom?: boolean }`

For production: persist `meals`, `favorites`, `neverAgain`, `pantry`, and the current `plan` to local storage (or, when you have a backend, sync there). The seed need not persist — generate fresh on session start.

## Data
- **27 seed meals** in `app/data.js` — vegetarian, Indian-leaning, plus sandwiches, quesadillas, salads, smoothies, pasta, fried rice, soup.
- **Pantry master list** organized by aisle (Grains & Starches, Legumes & Protein, Vegetables, Fruits, Dairy & Cold, Spices & Pantry).
- **Recipe steps** (3–4 short imperative lines per meal) keyed by meal id.

The seed data is intentionally personal (vegetarian Indian-leaning) — the user fills this in over time. Treat it as a starter library, not a fixed catalog.

## Assets
No external images. No icons from a library — all icons are inline SVG (16/18/22 viewBox, 1.3–1.5 stroke, currentColor). Fonts are Google Fonts (`Instrument Serif`, `IBM Plex Sans`, `IBM Plex Mono`).

## What was deliberately NOT built (yet)
The user has not asked for these — flag them as open questions before adding:
- Leftovers logic (cook-once-eat-twice)
- Prep-ahead suggestions ("cook Sunday, eat Mon–Wed")
- Real AI generation from inputs
- Nutrition totals across the week (per-meal kcal exists but isn't summed)
- Weekend planning (intentionally excluded — Mon–Fri only by default)
- Multi-user, sharing, exports
- Leftovers logic (cook-once-eat-twice)
- Authentication / cloud sync

## Files in this bundle
- `Meal Planner.html` — root HTML, sets up React + Babel, mounts the app, defines the Tweaks panel
- `app/data.js` — seed meals, pantry master, recipes, `makePlan`, `buildShoppingList`, `makeCustomMeal`
- `app/cookbook.jsx` — the entire UI (Week view, Day rows, all four sheets, shuffle overlays, bottom bar)
- `ios-frame.jsx` — iOS device chrome used for in-browser preview (NOT needed in a real iOS/RN app — discard)
- `tweaks-panel.jsx` — design-time tweak panel (NOT shipped — discard)

## Suggested implementation order
1. **Data layer** — port `data.js` (meals, pantry, recipes, makePlan, buildShoppingList) as plain pure functions. No UI dependencies.
2. **Week view** — static render of `plan`, no shuffle. Get the type, color, and spacing right.
3. **Bottom sheet primitive** — your target environment likely already has one (BottomSheet / Modal / .sheet modifier). Use it.
4. **Meal sheet → swap + eat-out** — the simplest interactive sheet, gets state plumbing working.
5. **Shuffle button + cards animation** — easy win, biggest delight.
6. **Pantry sheet** — list + paste modes.
7. **Shopping list sheet** — derives from plan + pantry.
8. **Meal library + add custom + favorites/never-again** — the last piece.
