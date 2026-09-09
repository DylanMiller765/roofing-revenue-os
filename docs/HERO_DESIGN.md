# Roofing hero redesign — 9 September 2026

## Direction
A fictional Houston roofing company with forest green, warm white and pale sage, the existing Manrope typeface, a photographic roof hero, restrained navigation and a prominent inspection request. Generated roof images are illustrations, not evidence of completed jobs. No reviews, certifications, response-time or insurance promises were invented.

## Interaction
`/` has an explicit demo selector. Previous/next buttons, keyboard arrow keys when focused in that selector, hero mouse dragging and touch swipes change replacement → storm → repair. Selection wraps at the ends. There is no automatic rotation. The image and message slide in from the direction selected, with reduced-motion support. The chosen intent is reflected in the URL; existing query attribution stays intact.

The form updates its roof concern without remounting or clearing the other entries. Main and sticky inspection actions jump to the form itself. `?intent=storm&preview=homeowner` (or replacement/repair) shows the corresponding homeowner destination without slider controls. This is still an honest fictional demo. Live paid traffic should be sent to the configured matching destination; visitors do not have to use the demo selector.

## Assets and provenance
Built-in image-generation tool; three original landscape images, optimized to WebP through Sharp with no compositional edits. Originals remain in the tool's generated-image folder. Runtime assets:
- `public/images/roof-replacement.webp`
- `public/images/roof-storm.webp`
- `public/images/roof-repair.webp`

Final prompts:

### Replacement
Use case: photorealistic-natural. Create one premium architectural photograph for a fictional Houston residential roofing company website hero. Wide landscape composition 1536x1024. Elevated three-quarter view of a beautiful but believable suburban Houston white painted brick home, expansive immaculate charcoal architectural asphalt shingle roof dominant in foreground, mature live oak trees, softly lit warm interior windows, landscaped green garden. Golden late afternoon sunlight, rich natural greens, muted warm whites, detailed realistic shingles and flashing, authentic residential architecture, editorial architectural photography not CGI. House roof across the center and right two thirds, left side has darker trees and simple shadowed roof space where HTML headline will overlay. No people, no logos, no lettering, no watermarks, no signs. This is illustrative generated imagery, not a real contractor project.

### Storm
Use case: photorealistic-natural. One premium editorial architectural photograph for a fictional Houston roofing website STORM DAMAGE inspection hero. Landscape 1536x1024. Elevated close three-quarter view across a realistic gray asphalt shingle roof of an attractive Houston brick suburban home, damp shingles just after a rain shower, rich green live oak trees behind the home, dramatic but soft blue-gray clouds breaking with pale warm sunlight. A few fallen oak leaves and one subtle raised shingle corner, no catastrophic damage. Realistic correct residential roof valleys, gutters, flashing, believable detailed materials. Composition roof and house on center and right; darker simple trees/roof across the left third to support HTML white headline overlay. Refined natural colors, documentary architecture photography, no fake CGI shine. No people, signs, logos, lettering or watermarks. Illustrative generated imagery, not real client work.

### Repair
Use case: photorealistic-natural. One premium close editorial roofing photograph for fictional Houston roofing website REPAIR AND LEAKS hero. Landscape 1536x1024. Close-up perspective across a real-looking weathered charcoal asphalt shingle residential roof, focus on a roof valley and metal flashing detail near a white brick chimney at right, subtle aging and slight lifted edge, not severe damage. Leafy Houston oak trees softly out of focus in background. Warm natural early morning light revealing authentic granular shingle texture, quiet rich olive green and stone colors, refined architectural magazine photography. Composition detailed roof/white brick chimney occupy center and right; darker simple soft focus roof area left third suitable for HTML headline overlay. Correct plausible roof construction. No people, tools, logos, lettering, labels, signs or watermark. Illustrative generated imagery, not an actual contractor project.

## Conversion boundary
The design prioritizes message relevance, readable mobile content, click-to-call and a short inspection request. No real traffic experiment has established a conversion lift. Production should replace fictional identity/number and illustrative photography with the client's verified details and authentic approved imagery.

## Verification
- Lint and TypeScript pass; all 56 existing tests pass; optimized webpack production build passes.
- Visually reviewed desktop at 1440 × 1000 and mobile at 390 × 844. Measured no document overflow at 390 or 320 pixels.
- Previous/next, keyboard arrows and a mouse drag across the hero change the selected intent, heading, image and form concern. Repair → next wraps to replacement.
- Entered mock homeowner/name/ZIP/phone details, switched examples, and successfully submitted the retained form. Receipt retained Google source and click identifier; URL retained campaign parameters.
- Inspection action on mobile scrolls directly to the form (measured form top approximately 54px).
- Homeowner preview has zero slider buttons and retains the configured intent.
- Touch swipe handlers and reduced-motion CSS are implemented; no physical touchscreen or assistive-technology certification is claimed.
- Operator dashboard and Ads policy/analyst source are unchanged. No live service, delivery, call or ad-account action occurred.

Screenshots: `public/screenshots/roofing-slider-desktop.png`, `roofing-slider-storm.png`, `roofing-slider-mobile.png`, and `roofing-form-mobile.png`.

## Logo refinement
Replaced the boxed house icon with a custom vector roof-and-star mark and a stacked Lone Star / Roof Co. wordmark. Header and footer share `components/RoofingLogo.tsx`; wording is configured in `config/client.ts`. The unboxed mark inherits the forest/cream palette and uses a muted sage star.
