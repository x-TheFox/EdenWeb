# Edencorp: scroll script

Status: proposal for the next build pass. SPEC.md's hard rules still bind. Where this document changes a SPEC decision (stage table, section order, video, copy), the engineer edits SPEC.md first, as SPEC.md requires.

All proposed visible copy in this file uses plain hyphens only. Copy in quotation marks is final unless a review finds a problem.

---

## 0. The one idea this script enforces

The client is right. Today the field is a beautiful backdrop that changes mood per section, but almost nothing in it is *about* the visitor's engagement. Every stage is a metaphor the visitor has to decode on their own, and most stages decode to "the grass looks different now".

The fix is one continuous thread the visitor can follow with their eyes:

> **The audit finds 8 things. The storefront prices those same 8. You pick some. Exactly those grow. Exactly those get handed to you.**

Every visual below either carries that thread (survey finds lots, storefront lights lots, build grows lots, ownership moves lots) or is cut back to a resting backdrop. A visual that only sets mood gets **rest** treatment: dim, still camera, no cursor reaction, nothing competing with text.

Test applied to every visual: *what does this teach about how Edencorp works that copy alone can't?* Verdicts:

| Visual | Today | Verdict | What it teaches after the change |
|---|---|---|---|
| Wild field (hero) | Moody grass | **Keep + label** | "This is your business: each stalk is a task repeated." Needs a legend or it is a screensaver. |
| The comb | Best moment on the site, unlabelled | **Keep, tighten, label rows** | Repetitive work becomes ordered, synchronised, automated. |
| Autonomous / Alongside tint | Every 7th row turns orange | **Replace** with a checkpoint band | Where a person signs off, and that the work waits for them there. |
| Wilt (statement) | Field gets darker, a few stalks lean. Unreadable. | **Replace** with a split field | Same work, two builds: one holds, one falls apart as you scroll (time passes). |
| Plots (capabilities) | Hidden behind four opaque cards; hover lights a plot under the card you're hovering | **Cut** | Nothing. Capabilities is a text section on a resting field. |
| Fence and gate (qualify) | Not visible in the render (shot-7.2) | **Cut** | Nothing. Qualify is copy. The fence survives only as "Your infrastructure". |
| Survey contours + lens | Works, but finds nothing | **Keep, make it find the 8** | The audit is a search, and it produces a concrete list. |
| Priced lots (choose) | 26% of a random hash grid turns orange, unrelated to the storefront that appears 3 screens later | **Replace** with 8 real lots wired to the storefront cart | What you put in the cart is a piece of your ground. |
| Grow (build) | Camera drops low, all grass gets taller | **Replace** with per-lot growth driven by the build portal | Only what you bought is built; features build in parallel; the longest sets the pace. |
| Transplant (own) | An arbitrary slice of plot 2 moves; the destination fence overlaps the field | **Keep, rewire** to the built lots, separate ground, labelled | Handover = your built features physically leave our ground for yours. Retainer = we keep tending them. |
| BuildUpdates Remotion video | Renders as an empty dark box (poster is frame 0, where `loopFade` = 0) | **Cut** | Replaced by a live, scroll-scrubbed build portal showing the visitor's own cart. |
| Field behind Security / FAQ / Fit | Faint wallpaper under ink/85 | **Rest** | Continuity only: the "Your infrastructure" plot stays in frame under "Your ground. Your walls." |

---

## 1. Critique of the current experience

Grounded in `shots/*.png` (1440x900 unless prefixed `m-`) and the code.

### Global
- **The metaphor is never explained.** Nothing on the page says a stalk is a unit of work. A first-time visitor reads the field as "dark grass, premium AI startup". Generic. Without the legend, every later stage is decoration.
- **The scene and the page tell two stories.** The field shows lots at "Choose" (shot-9.6), then the real storefront appears ~3 viewport heights later over a covered field (shot-12.6). The field grows at "Build" while a separate video plays. Nothing the visitor does in the DOM changes the field except two toggles.
- **Accent discipline is broken.** Survey orange is used on five process eyebrows (QUALIFY, SURVEY, CHOOSE...), on "Row by row." as text, on every security bullet tick. SPEC 0.6 restricts it to CTAs, prices/cart, the survey/comb line, checkpoints, focus, form state. Overuse is why the orange in the field stops meaning anything.
- **Readability over the field relies on one left scrim** (`.scrim-l`, 0.86 to 0 at 75%). Where the camera puts bright stalks behind the copy column, text collides with texture: shot-3.3 ("outbound" over bright rows), shot-4.6 (statement lede over stalk tips), m-3.4 (whole comb block on mobile).
- **A bright 1px seam runs down the vanishing point** whenever the camera x lines up with a row (shot-7.2 at x=720, m-7.5 centre). It reads as a rendering bug. Cause: KEYS[1] x = 0.33 and row x positions at `-19.67 + 0.66r`, so a row sits almost on the camera axis and its blades stack into a line.
- **Length.** About 19 viewport heights at 1440x900. Empty screens: comb sweep moment has no copy and no labels (shot-2.05, intentional but unlabelled); 300px+ void between the process heading and Qualify (shot-7.2); statement is `min-h-[130vh]` for ~50vh of content; ~300px void after the storefront (shot-13.8) and after the FAQ (shot-15.5).
- **Reveal uses `filter: blur(6px)`** on large blocks over a live WebGL canvas. Costly, and on 1x screens it smears the display type for 900ms.

### Hero (shot-0, m-0, live-0)
- Strong first frame. The wild field is a legitimate "before".
- But the sub ("faster and more profitable") is the generic line every agency uses, and nothing tells the visitor that scrolling will change the field. The single most important interaction contract on the page is unstated.
- Mobile low tier (14k blades, DPR 1) turns the horizon band into sparse dots (m-0, y 230-300). Reads as noise.

### Comb (shot-1.5, 2.05, 3.3, live-2, m-3.4)
- The sweep (shot-2.05, live-2) is the best frame on the site. Keep it as the signature.
- At the exact moment the front sweeps, **no copy is visible**: the "before" line fades at progress 0.42, "after" arrives at 0.56. The visitor sees the climax with no caption.
- Row annotations (Support tickets ... Order updates) are an evenly spaced 6-column DOM grid at the bottom. The rows converge to a vanishing point, so labels sit over nothing in particular (shot-3.3). They look stuck on.
- The Autonomous/Alongside toggle tints every 7th row orange. From the shot-3.3 camera you cannot tell which rows, and nothing explains what orange means.
- 340vh pinned. The comb completes at progress 0.72, then 95vh of nothing new.
- Reduced motion (rm-comb) shows the "before" headline over the "after" field state in an earlier build; current code hides it, but the RM poster (`poster-cultivated.webp`) is shown from the hero onwards, so under reduced motion the visitor never sees the wild state at all. The before/after story is lost.

### Statement (shot-4.6)
- The wilt reads as "the grass got darker". No cause, no comparison, no time. Copy alone carries the argument, so the visual is wallpaper.

### Capabilities (shot-5.8, m-5.5)
- Four 75%-opaque cards cover the field. The plot divider lines and hover highlight are rendered under the card you're hovering, so the interaction is invisible. "PLOT A" labels are decoration.
- Offset second column (`md:translate-y-16`) adds height and breaks scanning.

### Process (shot-7.2 to 11.6, m-7.5)
- Heading "How an engagement actually runs." wraps to three lines at 13ch and gets clipped under the nav on scroll.
- Qualify: the fence/gate is invisible. Big empty top half of the screen.
- Survey (shot-8.6): the contour lens is genuinely good, but it reveals contour lines that mean nothing and finds nothing. Baseline contour strength 0.3 vs lens 1.0 is too close: the lens reveal is subtle. The hint "Move your cursor..." is 0.72rem moss mono and hidden on mobile, where there is no lens at all.
- Choose (shot-9.6): random orange lots with no prices, no IDs, and a text link to a storefront three screens away.
- Build (shot-10.6): the video box renders empty. Even when it plays, it is a fake chat loop in a box; the visitor can't read it at their own pace, can't relate it to anything they picked, and it is the only element on the page that ignores scroll.
- Own (shot-11.6): the transplant looks good, but the moving parcel is an arbitrary slice (`plot 2, |z|<4`), the destination outline overlaps the field (own rect x 16.5 to 27.5, field ends at x 20) so it does not read as separate ground, and the "Your infrastructure" label from SPEC is missing.

### Storefront (shot-12.6, 13.8)
- The component itself is solid. Problems: it is disconnected from the field (covered), it duplicates the Choose step, and 8 tall cards make it ~2 screens.

### Security, FAQ, Fit (shot-13.8, 15.5, fit)
- Fine as content. The faint field behind is harmless wallpaper. FAQ leaves a large void below the last item. Fit form is clean; the left column could connect it to the process ("this is the Qualify step").

---

## 2. Page architecture after the change

Order (desktop heights; pinned = sticky inner `100svh`, scroll distance = height minus 100):

| # | Beat | Section | Height | Pinned | Doc range (vh) | Scene stage |
|---|---|---|---|---|---|---|
| B0 | Wild ground | Hero | 100 | no | 0-100 | 0 wild |
| B1 | The comb | Comb | 220 | yes | 100-320 | 0 to 1 |
| B2 | Built twice | Statement | 160 | yes | 320-480 | 1 to 2 (split wilt) |
| B3 | Four kinds of work | Capabilities | ~90 | no | 480-570 | 2 to 3 rest |
| B4 | Qualify | Process head + step 1 | ~80 | no | 570-650 | 3 to 4 travel |
| B5 | Survey finds 8 | Process step 2 | 200 | yes | 650-850 | 5 survey |
| B6a | One number vs eight | Storefront intro | 120 | yes | 850-970 | 6 lots |
| B6b | Choose | Storefront demo | ~110 | no | 970-1080 | 6 lots (live cart) |
| B7 | Build | Process step 4 | 180 | yes | 1080-1260 | 7 build |
| B8 | Own | Process step 5 | 140 | yes | 1260-1400 | 8 own |
| B9 | Your walls | Security | ~100 | no | 1400-1500 | 9 rest on own plot |
| B10 | Straight answers | FAQ | ~90 | no | 1500-1590 | 9 rest |
| B11 | Check fit | Fit form + footer | ~120 | no | 1590-1710 | 9 rest, dimmer |

About 17 screens, down from ~19, and every pinned screen has a job. The Process rail (Qualify, Survey, Choose, Build, Own) now spans B4 to B8, with Choose being the storefront itself. Nav anchor `#storefront` points at B6a; `#process` at B4.

### Stage keys (replaces `KEYS` in `components/scene/field.tsx`)

Ten keys, same count as today, so `sample()` is unchanged. Fields not listed take `base`. New fields: `shiftX`, `shiftY` (lens shift as a fraction of viewport, applied with `camera.setViewOffset`), `rest` (0..1, kills pointer energy and parallax), `focus` (dims non-selected ground during lot beats). `fence` and `plots` are removed.

| i | Name | pos | look | Values |
|---|---|---|---|---|
| 0 | wild | [-5.5, 1.7, 14.5] | [1.5, -0.7, 0] | comb 0, dim 1 |
| 1 | combed | [-0.2, 2.6, 14.5] | [-0.2, -0.9, -6] | comb 1, dim 1 |
| 2 | split | [-3.5, 3.4, 15.5] | [0.5, -0.6, -6] | wilt 1 (driver-gated, see B2), dim 0.85, shiftX 0.12 |
| 3 | rest | [-0.2, 9, 22] | [-0.2, 0, -8] | dim 0.42, rest 1, fog [18, 70] |
| 4 | qualify | [-0.2, 13, 18] | [-0.2, 0, -6] | dim 0.5, rest 1, fog [16, 66] |
| 5 | survey | [0.4, 17, 10] | [0.4, 0, -6] | survey 1, dim 0.72, shiftX 0.18, fog [14, 60] |
| 6 | lots | [0.4, 30, 4] | [0.4, 0, -6.2] | lots 1, survey 0.15, focus 1, dim 0.85, shiftX 0.22, fog [20, 80] |
| 7 | build | [-2, 11, 10] | [0, 0, -6] | lots 1, focus 1, build 1, dim 0.9, shiftX 0.2, fog [14, 60] |
| 8 | own | [33, 14, 18] | [28, 0, -6] | lots 1, build 1, lift 1 (driver-gated), own 1, focus 0.6, dim 0.9, shiftX 0.15, fog [16, 70] |
| 9 | rest-own | [30, 7, 20] | [32, 0, -6] | build 1, lift 1, own 1, dim 0.38, rest 1, fog [14, 60] |

Camera x values are offset by half a row spacing (-0.2, 0.4) so no row sits on the view axis. Acceptance: no bright vertical seam at any key at 1440x900 or 390x844.

Lens shift: `camera.setViewOffset(W, H, -shiftX * W, -shiftY * H, W, H)` each frame with damped shiftX/shiftY (same `k` as camera); positive shiftX moves the subject right, leaving the left copy column over dimmer ground. On mobile (<768px) force `shiftX = 0` and use `shiftY = -0.16` on keys 5-8 so the subject sits in the lower half below top-anchored copy.

### Drivers (new: `sceneStore.drivers`)

Keys move the camera. **Drivers scrub the meaningful change inside a pinned hold**, so the camera can settle first and the change happens while the visitor is looking. Computed in `storyStage()` alongside the stage, from section progress:

```ts
drivers = {
  comb:   remap(p.comb, 0.15, 0.70),        // linear, scrubbed exactly
  wilt:   remap(p.statement, 0.22, 0.85),
  survey: remap(p.survey, 0.10, 0.90),      // finding reveal clock
  split:  remap(p.storefront, 0.15, 0.70),  // lump sum splits into 8
  build:  remap(p.build, 0.10, 0.85),       // portal clock, week 0..N
  lift:   remap(p.own, 0.10, 0.60),
}
```

Uniform = keyValue(stage) * driver, where a key's value acts as the gate (e.g. `uWilt = v.wilt * drivers.wilt`).

New `storyStage` mapping (each term adds 0..1):

```ts
s += remap(p.comb, 0.15, 0.70);        // 0 -> 1
s += remap(p.statement, 0.02, 0.20);   // 1 -> 2 (camera arrives, then wilt scrubs)
s += remap(p.capabilities, 0.10, 0.45);// 2 -> 3
s += remap(p.qualify, 0.10, 0.90);     // 3 -> 4
s += remap(p.survey, 0.00, 0.10);      // 4 -> 5
s += remap(p.storefront, 0.00, 0.12);  // 5 -> 6
s += remap(p.build, 0.00, 0.10);       // 6 -> 7
s += remap(p.own, 0.00, 0.10);         // 7 -> 8
s += remap(p.security, 0.00, 0.35);    // 8 -> 9
```

`StoryKey` becomes `comb | statement | capabilities | qualify | survey | storefront | build | own | security`.

### The 8 lots (new shared constant `LOTS` in `components/scene/shaders.ts`)

Lots are explicit and match the storefront catalogue one to one.

- Lot size 4.5 x 4.5 world units, gaps 1.2. Grid 4 x 2.
- Centres x: -8.55, -2.85, 2.85, 8.55. Row z: front -3.3 (MF-01..04), back -9.0 (MF-05..08).
- Half extent 2.25.
- Each blade gets `aLot` (float, -1 or 0..7) in `buildBlades()`, from its `aRow` position.
- "Your infrastructure" plot moves off the field: rect x [24.0, 46.4], z [-12.05, -0.25]. Eight slots, 4 x 2, centres x 26.75 + 5.3 j, z -3.3 / -9.0. A built lot is assigned the next free slot in cart order (`uLotDest[i]`).

---

## 3. The scroll script, beat by beat

Format per beat: range, what's seen, motions (one-line purpose each), scroll, pointer/touch, copy, scene state.

### B0. Wild ground (hero, 0-100vh)

- **Seen:** Full-bleed wild field, horizon at ~32% from top. Headline bottom-left. Legend bottom-right. Scroll cue bottom-centre.
- **Motions**
  - Blades grow from 12% to 100% height over 2.4s on load (existing intro). *Purpose: the ground arrives before the promise; one-time, sets the stage.*
  - Wild, out-of-phase sway. *Purpose: the "before" register: busy, unsynchronised work.*
  - Headline line-mask reveal 180ms/310ms delays, 1.25s expo-out (existing). *Purpose: pace the first read.*
  - Legend fades in at 1.6s, 600ms. *Purpose: decode the metaphor before the first scroll.*
- **Scroll:** 0-100vh drives nothing in the scene (stage stays 0). The hero scrolls away normally.
- **Pointer:** parts the wild field radially (existing `pushWild`). Parallax x 0.55, y 0.25. Touch: none.
- **Copy**
  - H1: "Built for your ground. Nobody else's."
  - Sub: "Edencorp studies how your business actually runs, then builds the AI and software it needs. Nothing off the shelf."
  - CTAs: "Check fit" / "See how it works"
  - Legend (mono annot, moss, bottom-right, aligned to shell edge, with a 24px bone stalk glyph before it): "Each stalk is one task your business repeats."
  - Scroll cue (mono annot, moss, bottom-centre, 1px x 28px bone line below it that draws top to bottom once over 900ms then holds): "Scroll to put it in order"
- **Scene:** key 0. `uComb 0`, `rest 0`.

### B1. The comb (220vh pinned, doc 100-320, scrub over 120vh)

Section progress p (0..1 over the pinned scroll).

| p | What happens | Copy on screen |
|---|---|---|
| 0.00-0.15 | Camera eases from key 0 toward key 1 start (rises 1.7 to 2.1). Field still wild. | "Most of the week is the same task, done again." (h2, opacity 1) |
| 0.15-0.70 | **The comb.** `drivers.comb` 0 to 1 linear: front sweeps x -24 to +24. Behind it, blades spring into rows (existing backOut overshoot) and switch to the phase-locked wave. As the front passes each row group's world x, that group's label appears (see below). | "Before" line stays until the front passes x = -6 (p ~0.40), then exits y -16px, opacity 0, 400ms. "After" h2 enters at p 0.50-0.60, y 20 to 0. |
| 0.70-1.00 | Hold. Rows sway in phase. Toggle interactive. | After copy + toggle + mode text. |

- **Motions**
  - The comb front: survey-orange glow on ground (`frontLine`) and blade tips (`vGlow`). *Purpose: shows the moment Edencorp takes the work over: chaos to order in one pass.*
  - Row spring with overshoot 1.9. *Purpose: "exact rows", engineered, not drifting into place.*
  - Phase-locked wave travelling +z. *Purpose: automated work runs in sync, without anyone touching it.*
  - "Row by row." gets a 2px survey underline whose width tracks the front: `scaleX = drivers.comb`, origin left. *Purpose: ties the headline to the line on the ground; the underline IS the comb line, so orange stays on-rule.*
  - Row labels: six DOM labels world-anchored (via `WorldLabels`, §5) at z = 6, x = -9.2, -5.2, -1.2, 2.8, 6.8, 10.8, each with a 1px x 40px line dropping to the ground point. Each fades in (300ms, y 6 to 0) when `front > labelX`. *Purpose: names the rows as real work, in perspective, as they become ordered.*
- **Scroll:** scrubs the comb exactly, both directions (scroll up un-combs).
- **Pointer:** before the front: parts wild blades. Behind the front: ring ripples down the rows (existing `pushRow`). Desktop shows one annot line after p 0.75: "Move across the rows" (moss), hidden after first pointer move with energy > 0.4. *Purpose: shows ordered work reacts as a system, not stalk by stalk.*
- **Toggle "Autonomous | Alongside your team"** (existing radiogroup, spring 380/34)
  - Autonomous: wave runs straight through. Text: "The work runs without anyone touching it. Your people move to the work only people can do."
  - Alongside: a **checkpoint band** appears across all rows at world z = 4.0 (in front of the label line): blades within 0.45 units of z = 4 turn survey orange at the tips, and the wave on the far side of the band runs 1.4 rad behind the near side, so the wave visibly waits at the band and then continues. Text: "Your team stays. Every task arrives drafted and checked, and a person signs off at the orange line before it goes out."
  - *Purpose: shows exactly what human-in-the-loop means: the work stops at one line where a person signs, then flows on.*
- **Copy**
  - Before: "Most of the week is the same task, done again."
  - After H2: "We take it over. Row by row." (all bone; underline in survey)
  - Lede: "AI workforces that run customer support, data entry, outbound sales, back-office operations and QA generation end to end."
  - Labels: "Support tickets", "Data entry", "Outbound follow-ups", "Invoice matching", "QA test cases", "Order updates"
- **Scene:** keys 0 to 1. `uComb = drivers.comb` (bypasses smoothing, `kFast` stays). `uHuman` damped 0..1 from toggle.
- **New GLSL (blade vertex):**

```glsl
uniform float uCheckZ;      // 4.0
// wave with a hold at the checkpoint
float gate = smoothstep(uCheckZ - 0.3, uCheckZ + 0.3, base.y);
float wave = sin(uTime * 1.5 - base.y * 0.38 + base.x * 0.015 + gate * uHuman * 1.4);
// replace humanRow
float band = (1.0 - smoothstep(0.2, 0.45, abs(base.y - uCheckZ))) * uHuman * orderS;
float humanAcc = band * smoothstep(0.35, 0.8, t);  // tips only
```

`gate` uses `+` so rows nearer the camera (higher z, later in the flow) lag. Delete the `mod(aMeta.y, 7.0)` row tint.

### B2. Built twice (statement, 160vh pinned, doc 320-480, scrub 60vh)

- **Seen:** Copy left. The combed field from a slightly higher three-quarter view; a faint 1px bone seam on the ground at world x = 2.0 splits it. Left half (behind and right of the copy, x < 2) and right half (x > 2) each have a world-anchored label above them at z = 0, y = 1.6.
- **Motions**
  - `uWilt = drivers.wilt` (p 0.22-0.85): only blades with `aRow.x > 2` fall: up to 70% of them drop out of order (back toward wild xz), shorten by up to 50%, lean, and their tips desaturate from bone to `vec3(0.33,0.35,0.32)`. Left half untouched, still swaying in phase. *Purpose: same work, two builds; scroll is time passing, and only the cheap one decays.*
  - A mono "Over time" tick under the seam: 1px bone line that grows 0 to 120px with `drivers.wilt`. *Purpose: tells the visitor scroll equals time here.*
- **Scroll:** scrubs the decay both ways. After p 0.85, hold.
- **Pointer:** ripples run on the left half; on the right half fallen blades part like wild ones. Natural consequence of the existing shader, no extra code. *Purpose: the cheap half no longer responds as a system.*
- **Copy**
  - H2 (display): "Cheap systems are the most expensive thing you can buy."
  - P1: "You pay once for the build, then again for everything it breaks. We charge for work that holds."
  - P2: "Our incentive is openly selfish: we only do well when you earn more and run faster. So every feature we propose has to earn its place."
  - Labels: left "Built to hold", right "Built cheap". Under-seam annot: "Over time"
- **Scene:** key 2. Acceptance: at 1440x900 the seam sits at 60-66% of viewport width; both labels fully right of the copy column.
- **GLSL (replace current wilt):**

```glsl
uniform float uSeam;  // 2.0
float cheap = smoothstep(uSeam - 0.3, uSeam + 0.3, aRow.x);
float fall = step(aRand.w, uWilt * 0.7) * cheap;
float orderEff = order * (1.0 - fall * 0.9);
float H = mix(hWild, hRow, orderS) * uGrow * (1.0 - fall * uWilt * 0.5);
bend += (vec2(0.3, 0.5) * fall + vec2(0.04, 0.14) * cheap) * uWilt;
vWilt = fall * uWilt;   // new varying; fragment: tip = mix(tip, vec3(0.33,0.35,0.32), vWilt)
```

Ground seam: `col += vec3(0.25) * (1.0 - smoothstep(0.0, 1.5, abs(p.x - uSeam)/fwidth(p.x))) * uWiltGate * field;` where `uWiltGate` is key 2's weight (fades with the stage).

### B3. Four kinds of work (capabilities, flow ~90vh, doc 480-570)

- **Seen:** A resting field (key 3: high, wide, dim 0.42). Copy is the content.
- **Motions:** rows only (existing reveal, changed to y 16px, 700ms, no blur, 60ms stagger). *Purpose: none beyond pacing; this is a rest beat by design.*
- **Scroll:** carries the camera from key 2 to 3 over p 0.10-0.45. Wilt damps back to 0 as stage leaves 2 (invisible: dim is falling at the same time).
- **Pointer:** none on the scene (`rest = 1` sets energy target 0 and parallax 0). Rows highlight on hover with bone border, no orange.
- **Layout:** a ledger, not cards. Four rows, hairline `border-line` separators, grid `[minmax(0,5fr) minmax(0,7fr)]`: name (h3) left, body + tags right. No `translate-y-16` offset, no "PLOT A". Background of the section: none; the dim field shows through.
- **Copy:** unchanged from SPEC 6 (H2 "Four kinds of work. One standard.", four items, note "Buy one piece or all four. Scope sets the price, never a package.").
- **Scene:** key 3. `uPlots`, `uCap`, `capHighlight` deleted.

### B4. Qualify (process heading + step 1, flow ~80vh, doc 570-650)

- **Seen:** H2 and the Qualify step in one viewport. Process rail appears (lg) with Qualify active. Field travels toward the survey view.
- **Motions:** camera key 3 to 4 (slow rise and push, 13 units over 80vh). *Purpose: travel only; prepares the overhead view the next three beats need.*
- **Scroll:** drives camera travel.
- **Pointer:** none.
- **Copy**
  - H2: "How an engagement actually runs." (max 18ch, two lines at 1440)
  - Step annot (moss, not orange): "1 of 5. Qualify"
  - H3: "A short fit check."
  - Body: "A call with whoever owns the decision. We confirm three things before anything else happens."
  - List (bone, 20px survey tick allowed: these are checkpoints): "A real bottleneck, or a clear vision" / "A budget that fits the scope" / "Readiness to move on a timeline"
  - TextLink: "Check fit" to #fit
- **Scene:** key 4. No fence.

### B5. Survey finds 8 (200vh pinned, doc 650-850, scrub 100vh)

- **Seen:** Copy left (sticky, top 22vh). Right 60%: overhead three-quarter view of the combed field with orange contour lines that tighten into 8 knots. As findings are found, each knot gets an orange square outline (the lot) and a world-anchored label. A frame tag top-right of the copy column: "Example audit. Fictional company."
- **Motions**
  - Contours drawn from terrain plus 8 "stuck" potentials, so the lines bunch up where the problems are. *Purpose: the audit is reading where work gets stuck, not decorating.*
  - Findings reveal on a clock: finding i is found when `drivers.survey > 0.06 + i * 0.11`, or earlier if the lens sits within 2.6 units of its centre for 250ms. On found: lot outline flashes survey 1.0 to 0.45 over 800ms (expo-out), label fades in 300ms. *Purpose: the audit produces a concrete, countable list.*
  - Lens: contour strength 0.12 outside, 1.0 inside a 2.5 to 6.5 unit radius around the pointer (baseline lowered from 0.3 so the lens is obvious). *Purpose: the visitor does the surveying.*
  - Counter in copy increments with each find, number swap 200ms. *Purpose: progress the visitor can read.*
- **Scroll:** advances the reveal clock; all 8 found by p 0.85. Scroll up hides findings again (re-found by scroll only, keeps it deterministic).
- **Pointer (desktop):** lens follows the ground hit point (existing raycast). Finding by lens marks it found immediately. Hint below the counter: "Move the lens to find them faster."
- **Touch (mobile):** no lens. The lens centre is driven by scroll: it glides through the 8 lot centres in order (catmull-rom through centres, position = `drivers.survey * 8`), so mobile sees the same search. No hint.
- **Copy**
  - Annot: "2 of 5. Survey"
  - H3: "We study the ground before we build on it."
  - Body: "Under NDA we interview your staff, study your industry and competitors, map where the work gets stuck, and work out what would most move speed and revenue."
  - Counter (mono, bone, aria-live polite, updates at most once per 600ms): "Found 5 of 8"
  - Note (border-left survey): "The audit carries a deposit, credited in full to whatever you build."
  - Finding labels (mono 0.72rem, bone on ink/80 pill, max 22ch), MF order:
    1. "Quote requests priced by hand, one at a time"
    2. "Carrier documents chased over email"
    3. "The same status question, all day"
    4. "Invoices matched to rate confirmations by eye"
    5. "Dispatchers digging through lane history"
    6. "Margin slips spotted after the month closes"
    7. "Outreach written from scratch for every shipper"
    8. "Quotes, tracking and documents spread across inboxes"
  - The same 8 lines also render as a visually hidden `<ol>` in the copy column so the content exists without WebGL and for screen readers.
- **Scene:** key 5. `uLotFound[8]` and `uLotFlash[8]` set from JS.
- **GLSL (ground fragment):**

```glsl
uniform vec2 uLotC[8];
uniform float uLotFound[8];
uniform float uLotFlash[8];
float pot = h * 6.0;
float lotEdge = 0.0;
for (int i = 0; i < 8; i++) {
  vec2 d = p - uLotC[i];
  pot += 2.2 * exp(-dot(d, d) / 5.0);
  float o = rectOutline(p, uLotC[i] - vec2(2.25), uLotC[i] + vec2(2.25), 1.0);
  lotEdge = max(lotEdge, o * uLotFound[i] * (0.45 + 0.55 * uLotFlash[i]));
}
float lens = 1.0 - smoothstep(2.5, 6.5, length(p - uPointer));
float contour = aaLine(pot, 0.6);
col = mix(col, SURVEY * 0.8, contour * uSurvey * (0.12 + 0.88 * lens));
col = mix(col, SURVEY, lotEdge * max(uSurvey, uLots));
```

Blades: keep `surveyHit` only on the high tier (`#define SURVEY_BLADES` when tier = high), using the same `pot` loop in the vertex shader; medium and low show contours on the ground only.

### B6a. One number vs eight (storefront intro, 120vh pinned, doc 850-970, scrub 24vh)

The "black box vs open storefront" moment. One gesture, no decoration.

- **Seen:** Centre-left: a single closed line styled like the bottom of a PDF proposal: "Proposal, 38 pages" (moss mono) and a single total in large mono bone: "$124,700". Field (key 6) shows the 8 found lots overhead, outlined bone, in the right half.
- **Motions**
  - `drivers.split` 0 to 1: the total splits into 8 rows (ID, name, price) that stack downward, each row's price counting from 0 to its value as it lands (stagger 60ms, 500ms each, expo-out). The "38 pages" line strikes through (1px bone line scaleX 0 to 1). *Purpose: shows the difference between a proposal and a storefront in one move: one lump sum becomes eight separate decisions.*
  - As each row lands, its lot gets its price label (world-anchored, mono) on the field. *Purpose: each price belongs to a specific piece of your ground.*
- **Scroll:** scrubs the split both ways.
- **Pointer:** none during the split.
- **Copy**
  - Annot: "3 of 5. Choose"
  - Before split, small line above the total: "A proposal gives you one number."
  - After split, H2 replaces it (crossfade 300ms): "A private storefront, not a proposal."
  - Sub: "Every finding from the audit, listed with its scope, estimate and price. Add what you want, remove what you don't, then check out."
  - Tag on the block: "Example. Fictional company, illustrative prices."
- The sum $124,700 is the exact sum of the 8 catalogue prices (14,800 + 9,600 + 7,400 + 11,200 + 16,500 + 18,900 + 12,300 + 34,000), computed from `catalog`, never hard-coded.
- **Scene:** key 6. Lots outlined bone 0.3, price labels visible, no selection yet.

### B6b. Choose (storefront demo, flow ~110vh, doc 970-1080)

- **Seen (desktop):** The storefront panel occupies the left 7 of 12 columns: the 8 features become **compact rows** (not cards): checkbox circle, ID/kind, name, summary on one line truncated with full text on expand, estimate, price. Cart summary docks at the bottom of the panel (sticky inside it). The right 5 columns are open: the fixed field shows the 8 lots overhead (`shiftX 0.22` keeps them there). Selected lots glow.
- **Motions**
  - Add a feature: its lot fills (ground `SURVEY * 0.09`) and its blade tips turn survey orange over 150ms (damp `1 - exp(-dt*12)`), then a single 600ms ripple ring expands from the lot centre (existing ring maths, one-shot via `uLotPulse[i]` time stamp). *Purpose: what you buy is a specific piece of your ground; cart = territory.*
  - Remove: tips return to bone, fill fades 250ms. *Purpose: symmetric, reversible.*
  - Hover a row: its lot brightens x1.25 and outline goes survey 0.6, 220ms. *Purpose: maps each line item to its place before you commit.*
  - Total springs (existing 140/22). *Purpose: price is live and exact.*
  - Unselected ground inside the field dims to 55% (`focus`). *Purpose: keeps attention on the lots.*
- **Scroll:** none on the scene; the camera holds key 6 while the panel scrolls past.
- **Pointer:** field does not react to the pointer here (`rest` 0 but energy target 0); interaction is the list.
- **Checkout:** existing sequence. Additionally, on "sent", all selected lot outlines go solid survey for 800ms, then settle to bone with orange tips kept. Copy in the sent state: "Build request sent. In a real storefront this goes straight to Edencorp, and the build starts from here. Keep scrolling to watch it grow."
- **Copy:** catalogue and cart copy as SPEC 6 (frame label stays: "Example storefront. Fictional company, illustrative prices."). Panel header: "Found in your audit: 8" / "Pick what fits your goals and budget."
- **Scene:** key 6. `uLotSel[8]` from cart store. Default cart MF-01, MF-03, MF-04 (existing `initial`).

### B7. Build (180vh pinned, doc 1080-1260, scrub ~135vh)

Replaces the video.

- **Seen:** Copy top-left (title + one paragraph). Below it, the **Build portal** component (left 6 columns, §5). Right: field at key 7, a lower three-quarter view of the lots. Selected lots were cut down to seedlings on entry and grow as the portal progresses.
- **Motions**
  - On stage 6 to 7, selected lots drop to 22% height over 500ms. *Purpose: "planted": the build starts from what you chose.*
  - `drivers.build` is the portal clock, mapped to weeks 0..N where N = longest upper estimate in the cart. Feature i progress = `clamp(week / weeksUpper_i, 0, 1)`. Lot i height = `mix(0.22, 1.45, progress_i)`. *Purpose: features build in parallel, and the longest sets the pace; the visitor sees the short ones finish first. This is the cart's own helper text made visible.*
  - Status chip per feature flips at thresholds: 0 "Planned", >0 "In build", 0.55 "Ready to test", 0.75 "Revision 1 of 3", 1.0 "Signed off". Chip pop: scale 0.92 to 1, 300ms spring 160/18. *Purpose: shows the states a client actually lives through, including revision rounds.*
  - Channel column: one message per threshold crossing, newest at the bottom, max 4 visible, slide y 12 to 0, 300ms. *Purpose: updates arrive where you already talk.*
  - On "Signed off", the lot's tips go from orange to bright bone and its outline becomes solid bone. *Purpose: done means handed back to you, not "still ours".*
- **Scroll:** scrubs the clock both ways. Reduced motion: replaced by a week stepper (§6).
- **Pointer:** none on the scene. Portal rows hover-highlight the matching lot (same as B6b).
- **Copy**
  - Annot: "4 of 5. Build"
  - H3: "Watch it grow."
  - Body: "A live portal to follow and test the work. Updates where you already talk: Slack, WhatsApp, Discord or email. A set number of revision rounds before sign-off, and direct contact throughout."
  - Portal caption: "Example build. It uses the features you picked above. Fictional company."
  - Empty-cart fallback caption: "You didn't pick anything, so this shows the example's default request."
  - Message templates (`{name}` = feature name; channel label is plain text, no logos):
    - In build: "{name}: work has started. Follow it in your portal." (via Slack)
    - Ready to test: "{name}: staging build is live. Test it any time." (via email)
    - Revision: "{name}: revision round 1 of 3 logged. The change ships to staging next." (via WhatsApp)
    - Signed off: "{name}: signed off. Thanks." (via Discord)
- **Scene:** key 7. `uBuild` gate, `uLotGrow[8]` from portal progress.
- **GLSL (blade vertex):**

```glsl
uniform float uLotSel[8];
uniform float uLotGrow[8];
uniform float uLotHover;     // -1 or index
uniform float uBuild;        // gate 0..1
uniform float uFocus;        // 0..1
float sel = 0.0, grow = 1.0, hov = 0.0;
if (aLot > -0.5) {
  int li = int(aLot + 0.5);
  sel = uLotSel[li];
  grow = uLotGrow[li];
  hov = 1.0 - step(0.5, abs(uLotHover - aLot));
}
H *= mix(1.0, mix(0.22, 1.45, grow), sel * uBuild);
float tipBand = smoothstep(0.55, 0.9, t);
float signed = step(0.999, grow) * uBuild;
vAccent = max(vAccent, sel * uLots * tipBand * (1.0 - signed));
vFocus = mix(1.0, 0.55, uFocus * (1.0 - sel)) * (1.0 + 0.25 * hov);
vDone = sel * signed;    // fragment: col = mix(col, vec3(0.95,0.95,0.91) * (0.3 + 0.8 * vT), vDone * 0.6)
```

Fragment: `col *= vFocus;` before `uDim`.

### B8. Own (140vh pinned, doc 1260-1400, scrub ~50vh)

- **Seen:** Copy left with a two-option toggle. Right: the field's edge and, 4 units of bare ground away, a separate fenced plot labelled "Your infrastructure".
- **Motions (Full handover, default)**
  - `drivers.lift` 0 to 1: each built lot lifts (arc 2.0 units, `sin(pi * l)`), travels to its slot in the own plot, and settles. Stagger 0.07 per lot in cart order. Holes remain in the field showing tilled furrows. *Purpose: handover is literal: your features leave our ground and live on yours.*
  - Own plot outline draws on as a single bone line tracing the perimeter clockwise (`uOwnDraw` 0 to 1 over the first 30% of the driver), label fades in at 0.3. *Purpose: your infrastructure exists before anything is moved into it.*
  - A second label on the plot, appearing at lift 1: "Full source code". *Purpose: names what you take with you.*
- **Motions (Managed retainer)**
  - Lots return to the field (lift damps to 0 over ~900ms, arc reversed). A thin survey line sweeps across the built lots every 5s (`uTend = fract(uTime / 5.0)`), brightening tips as it passes like a small comb. Label on the lots: "Tended by Edencorp". *Purpose: a retainer is the same comb, repeated: we keep running and improving it.* (This is the one intentional loop. It is in the scene, carries meaning, and stops under reduced motion.)
- **Scroll:** scrubs the lift in handover mode. In retainer mode scroll does nothing extra.
- **Pointer:** toggle only.
- **Copy**
  - Annot: "5 of 5. Own"
  - H3: "Take it with you, or let us tend it."
  - Toggle: "Full handover" | "Managed retainer"
  - Handover text: "Deployed to your infrastructure, with the complete source code and no further obligation to us."
  - Retainer text: "We keep running, maintaining and improving the systems."
  - Plot labels: "Your infrastructure", "Full source code"; retainer label: "Tended by Edencorp"
- **Scene:** key 8. `uLift = v.lift * drivers.lift * (1 - retainer)`, `uRetainer` damped from toggle.
- **GLSL (blade vertex, replaces parcel):**

```glsl
uniform vec2 uLotC[8];
uniform vec2 uLotDest[8];
uniform float uLotSlot[8];   // 0..7 order
uniform float uLift;
uniform float uRetainer;
float moving = 0.0; vec2 c = vec2(0.0), dst = vec2(0.0); float slot = 0.0;
if (aLot > -0.5) {
  int li = int(aLot + 0.5);
  moving = uLotSel[li] * step(0.5, orderS);
  c = uLotC[li]; dst = uLotDest[li]; slot = uLotSlot[li];
}
float l = clamp(uLift * 1.5 - slot * 0.07, 0.0, 1.0) * moving;
float le = smoothstep(0.0, 1.0, l);
base = mix(base, base - c + dst, le);
float arc = sin(3.14159 * l) * 2.0;
// retainer tending pass
float tf = mix(-12.0, 12.0, fract(uTime / 5.0));
vGlow += exp(-abs(base.x - tf) * 1.2) * moving * uRetainer * 0.8 * (1.0 - le);
```

Ground: own rect moves to x [24.0, 46.4], z [-12.05, -0.25]; outline drawn with a perimeter parameter `s` in 0..1 and `step(s, uOwnDraw)`.

### B9. Your walls (security, flow ~100vh, doc 1400-1500)

- **Seen:** Copy and the two blocks as today. Behind, at dim 0.38, the "Your infrastructure" plot with whatever was handed over (or the tended lots in retainer mode).
- **Motions:** camera eases to key 9 and holds. *Purpose: continuity; "your walls" sit around what you now own. No new motion.*
- **Pointer:** none.
- **Copy:** SPEC 6 Security, with these small edits: the bullet ticks become bone, not survey (they are not checkpoints or prices). Lede: "The practices we follow on every engagement, from the first call to the last line of code."
- **Scene:** key 9, `rest 1`.

### B10. Straight answers (FAQ, ~90vh)

- Rest. No scene change. Bottom padding cut to `clamp(4rem,10vh,6rem)` to remove the void in shot-15.5.

### B11. Check fit (form, ~120vh, then footer)

- **Seen:** Form on a solid `ink-2` surface (unchanged). Field at dim 0.3 behind the left column only.
- **Motions:** form step transitions as today (x 20px, 450ms expo-out). Success state as today.
- **Scene:** rest. **No form-driven field effects.** Considered and rejected: making answers shape the field teaches nothing about Edencorp, competes with the one task on the page that converts, and would animate behind inputs while someone types. The field stays still.
- **Copy**
  - H2: "Check fit."
  - Sub: "Two minutes. This is the Qualify step: if there's a fit, you book a call with us next."
  - Left list: "No minimum budget. Pick whichever range is honest." / "Your answers go to us and nobody else."

---

## 4. Video decision

**No Remotion video ships.** None earns its place.

- `BuildUpdates` fails the test: it is a fixed 12s loop the visitor can't control, can't relate to anything they picked, and can't read at their own pace. Everything it shows (portal progress, status chips, channel updates, revision rounds) is better as live HTML: crisp at every DPR, accessible, translatable, scroll-scrubbed, and driven by the visitor's own cart. Today it also renders as an empty box because the poster is frame 0, where `loopFade` is 0.
- `FieldLoop` (SPEC 7.2) is not needed: the no-WebGL path uses posters (§6).
- Replacement: the **Build portal** component (§5), placed in B7.
- Housekeeping: remove `VideoLoop` from `process.tsx`; delete `public/video/build-updates.*`; leave the `/video` workspace out of the build (delete it, or keep it unreferenced with a README line saying it is unused). Update SPEC 7 to "No video. Build step uses the live Build portal."

---

## 5. New or changed components

### 5.1 `WorldLabels` (new) `components/scene/world-labels.tsx`
- **Purpose:** DOM labels pinned to world positions in the field (comb rows, Built to hold / Built cheap, finding labels, lot prices, Your infrastructure). Crisp text, no texture text in GLSL.
- **Behaviour:** renders absolutely positioned `<span aria-hidden>` elements inside a fixed `inset-0 pointer-events-none z-[5]` layer (above canvas, below content `z-10`). Each label registers `{ id, world: [x,y,z], visible: () => boolean }` in `sceneStore.labels`. In `useFrame`, project with `v.set(...).project(camera)` (view offset is included), write `el.style.transform = translate3d(x, y, 0) translate(-50%, -100%)` and opacity directly. No React renders per frame.
- **States:** hidden, entering (300ms opacity + y 6 to 0), visible, leaving (200ms). Hidden when behind the camera (`v.z > 1`) or outside the viewport by more than 40px.
- **Style:** mono 0.72rem, uppercase tracking 0.08em, bone on `rgb(12 15 13 / 0.8)` pill, padding 4px 8px, radius full; a 1px x 32px bone/40 leader line to the ground point. Price labels: survey text only when the lot is in the cart (prices/cart rule).
- **Mobile:** max 3 labels visible at once (closest to screen centre win); comb shows "Support tickets", "Data entry", "Invoice matching" only.
- **Reduced motion:** same positions, no enter/leave transitions.
- **No WebGL:** layer not rendered. Every label's content also exists in normal DOM in its section.

### 5.2 `cart-store` (new) `components/storefront/cart-store.ts`
- **Purpose:** one cart shared by the storefront, the build portal, the own beat and the scene.
- **Behaviour:** module-level store `{ ids: string[], stage: "browse"|"sending"|"sent" }` with `subscribe/getSnapshot` for `useSyncExternalStore`. Every write also sets `sceneStore.lotSel[i]`, `sceneStore.lotSlot[i]` and `lotDest` (slot packing in cart order). Initial `["MF-01","MF-03","MF-04"]`.
- `storefront-demo.tsx` swaps `useState` for this store. No visual change on its own.

### 5.3 Storefront demo (changed) `components/storefront/storefront-demo.tsx`
- **Layout desktop (>=1024px):** panel spans 7/12 columns, catalogue as compact rows: 64px tall, `grid-cols-[28px_1fr_auto_auto]`: toggle circle, (ID/kind annot + name), estimate (mono moss), price (mono, survey when selected). Summary shows on click of the row's chevron, not by default. Cart summary is a sticky footer inside the panel (subtotal, deposit, estimated build, total, Checkout). The right 5 columns stay empty so the field shows through.
- **Hover/focus a row:** sets `sceneStore.lotHover = index`; blur/leave sets -1.
- **Tablet (768-1023px):** full width rows, field hidden behind panel; sticky bottom bar with mini lot map.
- **Mobile:** see §7.
- **Reduced motion:** total jumps, lots switch instantly, no ripple.
- **States:** browse, sending (1.4s bar), sent (outline flash in scene), reset.

### 5.4 `ProposalSplit` (new) `components/storefront/proposal-split.tsx`
- **Purpose:** B6a. One lump sum becomes eight priced lines.
- **Behaviour:** reads `drivers.split` via a Motion `useTransform` on the storefront section's scroll progress. Rows: `y` from -24 * index to 0, opacity 0 to 1, price counts with `useTransform` (rounded, `usd()`), stagger by index over the 0..1 range (row i window `[i*0.09, i*0.09 + 0.3]`). The strike line under "Proposal, 38 pages" is `scaleX: drivers.split`.
- **Interaction:** none. It's a scrubbed explanation, then the real demo follows.
- **Mobile:** same, rows compact (name hidden, ID + price only), 44px tall.
- **Reduced motion:** shows the end state (8 rows, struck line) with no scrub.
- **Honesty:** tag "Example. Fictional company, illustrative prices." on the block.

### 5.5 `BuildPortal` (new) `components/sections/build-portal.tsx`
- **Purpose:** B7. Replaces the video. Shows a build of the visitor's own cart.
- **Layout:** card `ink-2`, border `line-strong`, radius 10px. Header: "Client portal" annot + "Marlowe Freight Co." mono moss + week readout "Week 3 of 4" (mono bone). Body two columns (desktop): left = features (name, ID, 2px progress bar bone on `line`, status chip), right = "Updates" channel (messages with sender "Edencorp" in bone, "via Slack" mono moss). Footer: "Revision rounds remaining" for the whole build, starting at "3 of 3" and dropping to "2 of 3" when the first feature crosses its revision threshold. It drops only once per build, so the readout never hits 0 in the example (a set number of rounds, not a countdown to trouble).
- **Clock:** `week = drivers.build * N`, N = max upper weeks in cart. Week readout is an integer `ceil(week)` with min 1.
- **States:** empty cart fallback (default three), normal, all signed off ("Everything signed off. Ready for handover." in bone).
- **Interaction:** row hover highlights lot. No buttons except in reduced motion (stepper).
- **Mobile:** single column; features first (max 3 shown, "+2 more" line), channel shows the last 2 messages. Fits in 100svh minus copy (copy shortened to title + one line on mobile, see §7).
- **Reduced motion:** a segmented stepper "Week 1 2 3 4" (buttons, `aria-pressed`) replaces scrub; scene cuts to the matching heights.
- **Accessibility:** progress bars are `role="progressbar"` with `aria-valuenow`; channel is `aria-live="off"` (scrubbing would spam), with a visually hidden summary updated on step change in reduced motion only.

### 5.6 Comb section (changed) `components/sections/comb.tsx`
- Height 340vh to 220vh. Transforms rewired to `drivers.comb` (§3 B1). Row labels move from the bottom DOM grid to `WorldLabels`; the existing `<ul>` stays as `sr-only` for content. Underline span under "Row by row." Toggle copy updated, `sceneStore.human` unchanged.

### 5.7 Statement (changed) `components/sections/statement.tsx`
- Becomes a pinned 160vh section using `StageSection mode="pinned"`, sticky inner `100svh`, copy vertically centred, max width 46rem. Registers two world labels and the "Over time" tick.

### 5.8 Capabilities (changed) `components/sections/capability-list.tsx`
- Ledger layout (§3 B3). Remove `sceneStore.capHighlight`, `onMouseEnter/Focus` scene writes, "Plot A-D".

### 5.9 Process (changed) `components/sections/process.tsx`
- Split into four sections that register their own stage keys: `qualify` (flow), `survey` (pinned 200vh), `build` (pinned 180vh), `own` (pinned 140vh). The storefront section sits between survey and build in `app/page.tsx`. `ProcessRail` stays mounted across B4 to B8 (move it to a wrapper around those sections in `page.tsx`) and reads which of the five ids is active; Choose maps to `#storefront`.
- Step annots switch from `text-survey` to `text-moss`, format "2 of 5. Survey".

### 5.10 Own toggle (new, inside process own step)
- Radiogroup like the comb toggle (same spring). Writes `sceneStore.retainer` 0/1. Default handover. Under reduced motion the state cuts.

### 5.11 Scene backdrop (changed) `components/scene/scene-backdrop.tsx`
- Adds the `WorldLabels` layer. Adds copy-rect writer (§8.2). Poster logic per §6.

### 5.12 Mobile process progress (new) `components/sections/process-progress.tsx`
- Below 1024px, replaces the hidden rail: a 2px bar under the nav (top 64px), 5 segments with 4px gaps, active and completed segments bone, the current one survey (this is a progress/state indicator, same role as the form step bar). Visible only while B4 to B8 are in view. Fades 200ms.

---

## 6. Reduced motion and no-WebGL

`prefers-reduced-motion: reduce` gets a calm, still, but still *truthful* version. Stills change state; nothing moves continuously.

- **Renderer:** keep the canvas (when WebGL exists and not Save-Data), with `frameloop="demand"`, `uTime` frozen at 4.0, no pointer reaction, no parallax, no lens. Call `invalidate()` only when the stage index (rounded), cart, toggles or stepper change. Camera **cuts** to the new key: canvas crossfades through `dim * 0.5` over 300ms opacity (CSS on the canvas wrapper) on each cut. No dolly.
- **Per beat:**
  - B0: wild still (comb 0). Lenis off (existing).
  - B1: combed still once the section is 50% in view; no "before" headline (screen readers get it via sr-only); toggle switches band on/off instantly.
  - B2: end state: right half wilted, labels shown.
  - B3, B4: rest still.
  - B5: all 8 findings shown with outlines and labels; counter reads "Found 8 of 8"; contours at full strength, no lens.
  - B6a: end state (8 rows). B6b: lots switch instantly on cart change.
  - B7: week stepper; heights cut per step.
  - B8: toggle cuts between handover end state and retainer state; no tending sweep (static survey outline on tended lots instead).
  - B9 to B11: rest still.
- Section reveals: opacity only, 300ms (existing pattern, minus blur).
- **No WebGL / Save-Data / reduced motion on the low tier:** per-beat posters rendered from the real scene with Playwright at the end state of each beat: `poster-wild`, `poster-combed`, `poster-split`, `poster-survey`, `poster-lots`, `poster-own` (webp, 1600w, ~60-90KB each). Two stacked `<img>` crossfade 400ms when the rounded stage changes. Labels layer not rendered; DOM lists carry the content. This replaces today's single `poster-cultivated` that hides the before/after.

---

## 7. Mobile script (390 x 844)

General rules:
- Sticky pinned containers use `100svh`, never `100dvh` (dvh resizes when the URL bar hides and jolts the pin).
- Pinned heights shrink: comb 200vh, statement 140vh, survey 180vh, storefront intro 110vh, build 170vh, own 130vh.
- Copy is top-anchored at `top: 88px` in pinned beats; the scene subject sits in the lower half via `shiftY -0.16`. Scrim: top-down `linear-gradient(180deg, ink/0.92 0%, ink/0.75 45%, ink/0 70%)` instead of the left scrim.
- Low tier: blade width 0.036 to 0.05, fog `[8, 30]` so the sparse far field fades out instead of reading as dots; DPR 1 stays.
- No pointer effects; no hints that mention a cursor.

Per beat:
- **B0:** as desktop. Legend sits above the CTAs (left aligned, mono), scroll cue hidden (the thumb already knows). H1 3 lines at clamp min.
- **B1:** same scrub. Camera key 1 pos x -0.2, y 3.0 (slightly higher so rows read in a narrow frame). Three world labels. "Move across the rows" hidden. Toggle full width, labels "Autonomous" / "Alongside" (shortened; the body text explains). The band at z 4 sits around 70% screen height: check it is below the copy block.
- **B2:** copy top, field below; seam at 50% width (shiftX 0); labels "To hold" / "Cheap" (shortened, full words in body copy). Over-time tick hidden.
- **B3:** ledger stacks (name, body, tags). Rest field.
- **B4:** as desktop; progress bar appears under nav.
- **B5:** lens driven by scroll through lot centres; labels: only the current finding's label shows (one at a time, centre-bottom), the counter shows the rest. Visually hidden list stays.
- **B6a:** rows compact (ID + price); field shows lots in the lower 40%.
- **B6b:** field not visible behind the full-width list, so a sticky bottom bar (existing "Review request (n) / total") gains a **mini lot map** on its left: 4 x 2 grid of 10px squares, 3px gaps, bone outline, survey fill when selected, 150ms. Bottom sheet as today. Purpose: keeps "cart = your ground" on a screen too narrow for the field window.
- **B7:** title + "Every feature builds in parallel. The longest sets the pace." as the only body line; portal single column (§5.5); field lots visible in the lower ~35%.
- **B8:** toggle full width; lift scrub; plot label only "Your infrastructure".
- **B9-B11:** content only, rest field at dim 0.3.

---

## 8. Visual improvements

### 8.1 Typography
- `.h2` max widths: process 18ch, storefront 16ch, capabilities 16ch; all `text-wrap: balance` (already). Goal: two lines at 1440.
- Display weights stay 540-560, stretch 88-90%. Hero size stays `clamp(2.9rem, 7.4vw, 6.6rem)`.
- Mono annots: 0.72rem stays for labels; counters and week readouts 0.875rem bone tabular.
- Eyebrows: only the five process step annots ("n of 5. Verb"), in moss. No other eyebrows. (Rail and annots are the same information, so on lg the rail carries the accent and the annot stays moss.)
- "Row by row." becomes bone with the survey underline (§3 B1).

### 8.2 Readability: field-side copy mask (replaces most scrims)
Darken the field itself behind the active copy block instead of laying grey gradients over it.
- New uniforms (blade and ground fragment): `uCopyRect` (vec4, device pixels, gl_FragCoord space), `uCopyMask` (0..1), `uDpr`.

```glsl
float copyMask() {
  vec2 c = (uCopyRect.xy + uCopyRect.zw) * 0.5;
  vec2 h = (uCopyRect.zw - uCopyRect.xy) * 0.5;
  vec2 q = abs(gl_FragCoord.xy - c) - h;
  float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
  return 1.0 - smoothstep(0.0, 140.0 * uDpr, d);
}
// before fog
col *= mix(1.0, 0.32, copyMask() * uCopyMask);
```

- Writer: each beat's copy block gets `data-copy`. On scroll change (existing Motion events) and resize, the active section's `[data-copy]` rect is read with `getBoundingClientRect()`, padded 24px, converted: `x0 = left*dpr, y0 = (innerHeight - bottom)*dpr, x1 = right*dpr, y1 = (innerHeight - top)*dpr`, where dpr = `gl.getPixelRatio()`. `uCopyMask` damps to 1 when a rect exists, 0 otherwise (k = 6/s).
- Keep `.scrim-l` only as a no-WebGL fallback, and strengthen it there: `0.9 0%, 0.7 40%, 0 70%`.
- Acceptance: body text over the field measures >= 7:1 against the darkest-to-brightest sampled pixels behind it in shots at every pinned beat.

### 8.3 Colour
- Survey orange in the scene appears only for: comb front, checkpoint band, contour/findings, cart-selected lots, tending pass. Each has a meaning stated in copy. Nothing else in the field is orange.
- Signed-off lots go bright bone `vec3(0.95,0.95,0.91)`, not orange: done is calm.
- Wilted tips desaturate to `vec3(0.33,0.35,0.32)`.

### 8.4 Field lighting and shading
- Fake low sun from the horizon at azimuth `normalize(vec2(-0.4, -1.0))`: in the blade vertex, `vSun = 0.5 + 0.5 * dot(normalize(bend + vec2(1e-3)), sunDir)`; fragment multiplies tips (`vT > 0.5`) by `0.85 + 0.3 * vSun`. Gives the rows a readable grain when the wave passes.
- Back-rim: add `uHorizon * 1.6 * pow(vT, 3.0) * vFog * 0.5` to tips near the horizon so the far edge reads as a silhouette rather than a grey band.
- Ground furrows behind the comb: raise ridge contrast from 0.022 to 0.035; they become the visible "holes" after transplant.
- Keep `flat`/`linear` output. No post-processing.

### 8.5 Camera and transitions
- Camera damping stays `k = 1 - exp(-dt * 3.2)`. Add damping for `shiftX/shiftY` with the same k.
- Rule: no key-to-key move covers more than 25 world units per 100vh of scroll (B7 to B8 is the largest at ~36 units over 14vh of scroll: stretch its `storyStage` window to `remap(p.own, 0.00, 0.25)`, and start the lift driver at 0.25).
- No roll, constant fov 42.
- Pointer parallax multiplied by `(1 - rest)`; energy target multiplied by `(1 - rest)`.

### 8.6 UI micro-interactions (values)
- Reveal: y 16px, opacity, 700ms `cubic-bezier(0.16,1,0.3,1)`, stagger 60ms, no blur.
- Toggles: spring stiffness 380, damping 34 (existing).
- Storefront row toggle: circle fill 150ms, row `active:scale-[0.99]`.
- Lot response to cart: 150ms to target (damp k = 12/s), ripple 600ms once.
- Counter number swap: old y 0 to -8px opacity 0, new y 8 to 0, 200ms.
- Status chip pop: spring 160/18.
- Proposal split rows: 500ms each, stagger 60ms of driver range.
- Copy mask fade: k = 6/s.

### 8.7 Layout rhythm
- Section vertical padding `clamp(5rem, 12vh, 8rem)` on flow sections (down from 16vh max 10rem).
- Pinned copy blocks: desktop `top: 20vh`, max width 34rem, left on the shell.
- Remove the 300px voids: process heading shares the Qualify viewport; storefront bottom padding `clamp(4rem,10vh,6rem)`; FAQ bottom padding same.

### 8.8 Performance
- Pause rendering (`frameloop="demand"` toggle) when `rest = 1` and `uDim < 0.45` and no driver is changing, rendering one frame per 250ms for the slow sway; full rate otherwise. Saves battery through B3, B9-B11.
- Pause when `document.hidden`.
- The 8-lot loops are 8 iterations: fine on all tiers; blade-side contour loop only on high.

---

## 9. Prioritised implementation list

Each item is one engineer task. Files named are the ones to touch.

### P0: the spine (ship together)
1. **Cut the video.** Remove `VideoLoop` from the Build step, delete `public/video/build-updates.*`, update SPEC 7. Files: `components/sections/process.tsx`, `components/ui/video-loop.tsx` (delete if unused), `docs/SPEC.md`.
2. **Section split and order.** Split Process into `qualify`, `survey`, `build`, `own` sections; move Storefront between survey and build; update `StoryKey`, `sceneStore.progress`, `storyStage()` and add `drivers` (§2). Files: `components/sections/process.tsx`, `app/page.tsx`, `components/scene/scene-store.ts`, `components/scene/use-stage.ts`.
3. **New KEYS and lens shift.** Replace `KEYS` with §2 table, remove `plots`/`fence`, add `shiftX/shiftY/rest/focus/build`, apply `setViewOffset`, mobile overrides, half-row camera offsets. Files: `components/scene/field.tsx`.
4. **Eight lots in geometry.** `LOTS` constant, `aLot` attribute in `buildBlades()`, uniforms `uLotC[8]`, `uLotSel[8]`, `uLotHover`, ground outlines and fills; delete the hash-grid lots. Files: `components/scene/shaders.ts`, `components/scene/field.tsx`.
5. **Shared cart store** wired to `sceneStore.lotSel`. Files: new `components/storefront/cart-store.ts`, `components/storefront/storefront-demo.tsx`.
6. **Storefront compact rows + field window + hover mapping** (desktop) and mini lot map in the mobile bar. Files: `components/storefront/storefront-demo.tsx`, `components/sections/storefront.tsx`.
7. **Build portal** replacing the video, driven by `drivers.build` and the cart; per-lot growth uniforms `uLotGrow[8]`, `uBuild`, `uFocus`, signed-off styling. Files: new `components/sections/build-portal.tsx`, `components/sections/process.tsx` (build section), `components/scene/shaders.ts`, `components/scene/field.tsx`.
8. **Transplant rewired** to selected lots, own plot moved off the field, `uLotDest/uLotSlot`, perimeter draw. Files: `components/scene/shaders.ts`, `components/scene/field.tsx`, `components/storefront/cart-store.ts`.
9. **WorldLabels layer** (needed by 10, 11 and the own label). Files: new `components/scene/world-labels.tsx`, `components/scene/scene-store.ts`, `components/scene/field.tsx`, `components/scene/scene-backdrop.tsx`.
10. **Survey finds the 8**: potential contours, found/flash uniforms, reveal clock, lens-to-find, counter, finding labels, sr list, mobile scroll-driven lens. Files: `components/scene/shaders.ts`, `components/scene/field.tsx`, survey section in `components/sections/process.tsx`.
11. **Hero legend + scroll cue + sub copy.** Files: `components/sections/hero.tsx`.
12. **Accent discipline pass**: step annots moss, "Row by row." bone + underline, security ticks bone. Files: `components/sections/process.tsx`, `components/sections/comb.tsx`, `components/sections/security.tsx`.
13. **Reduced motion keeps before/after**: wild poster in hero, combed after B1, posters crossfaded by rounded stage (interim, before the P1 demand canvas). Files: `components/scene/scene-backdrop.tsx`, `public/scene/*` (render `poster-combed`, `poster-survey`, `poster-lots`, `poster-own`).
14. **Strengthen fallback scrims and switch sticky containers to `100svh`.** Files: `app/globals.css`, `components/sections/comb.tsx`, other pinned sections.

### P1: make each beat land
15. **Comb tightened**: 220vh, driver-based copy timing, world-anchored row labels, "Move across the rows" hint. Files: `components/sections/comb.tsx`.
16. **Checkpoint band** replacing every-7th-row tint, with wave hold. Files: `components/scene/shaders.ts`, `components/sections/comb.tsx` (copy).
17. **Split wilt** with seam, labels, "Over time" tick, pinned statement. Files: `components/scene/shaders.ts`, `components/scene/field.tsx`, `components/sections/statement.tsx`.
18. **ProposalSplit intro** (B6a). Files: new `components/storefront/proposal-split.tsx`, `components/sections/storefront.tsx`.
19. **Own toggle + retainer tending pass.** Files: own section in `components/sections/process.tsx`, `components/scene/shaders.ts`, `components/scene/scene-store.ts`.
20. **Copy mask uniform** and `data-copy` writer; demote scrims to fallback. Files: `components/scene/shaders.ts`, `components/scene/field.tsx`, `components/scene/scene-backdrop.tsx`, sections adding `data-copy`.
21. **Capabilities ledger**, remove plot highlight code. Files: `components/sections/capability-list.tsx`, `components/sections/capabilities.tsx`, `components/scene/scene-store.ts`.
22. **Reduced-motion demand canvas** with frozen time, camera cuts, week stepper. Files: `components/scene/field-canvas.tsx`, `components/scene/field.tsx`, `components/sections/build-portal.tsx`.
23. **Mobile process progress bar** and mobile pinned heights, top scrim, low-tier blade width and fog. Files: new `components/sections/process-progress.tsx`, `components/scene/quality.ts`, `components/scene/shaders.ts`, `app/globals.css`.
24. **Reveal without blur**, new spacing values, FAQ and storefront void fixes. Files: `components/ui/reveal.tsx`, `components/sections/faq.tsx`, `components/sections/storefront.tsx`, `app/globals.css`.
25. **Fit copy linking to Qualify.** Files: `components/sections/fit-check.tsx`.

### P2: polish and efficiency
26. Low-sun and back-rim shading, furrow contrast. Files: `components/scene/shaders.ts`.
27. Rest-state frame throttling and `document.hidden` pause. Files: `components/scene/field-canvas.tsx`, `components/scene/field.tsx`.
28. Checkout outline flash and storefront "sent" copy tying into Build. Files: `components/storefront/storefront-demo.tsx`, `components/scene/field.tsx`.
29. Lot ripple pulse on add (`uLotPulse[8]`). Files: `components/scene/shaders.ts`, `components/scene/field.tsx`.
30. Regenerate OG image and posters from the new end states. Files: `public/scene/*`, `app/opengraph-image.tsx`.
31. Remove or archive the `/video` workspace. Files: `video/`.

### Acceptance checks for the whole pass
- At every pinned beat, pause scrolling and ask: can a visitor say what the orange in the field means right now, using only words on screen? If not, the beat fails.
- Adding MF-06 in the storefront visibly changes the field within 150ms, the build portal lists MF-06 and its lot grows to the end of week 5, and in handover it is one of the lots that moves.
- With JS off: every finding, price, status and label exists as text in the DOM.
- Zero em or en dashes in visible copy (grep the built HTML for U+2013 and U+2014).
- No bright seam, no blank boxes, no screen without copy or a labelled change.
