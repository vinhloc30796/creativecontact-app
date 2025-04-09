# Event Detail Page (`app/(public)/events/[slug]`)

This document outlines the structure and implementation status for the individual event detail page.

## Page Structure Overview (Based on Figma Node 704:624)

The event detail page consists of three main parts overlaid on a base background:

1.  **Fixed Header:**

    - Contains the site logo (`CC Logo 3`) and a "Join us" call to action.
    - Appears fixed at the top or positioned independently of the scrolling content.
    - Node ID (approximate): `704:625`

2.  **Horizontally Scrolling Content Area:**

    - This is the main interactive area, arranged as a horizontal row (`Frame 427318602` / `704:1113`).
    - It contains multiple distinct content "cards" or sections placed side-by-side.
    - The first card (`Frame 427318601` / `704:1114`) displays persistent event metadata:
      - Event Title (`Photo X 3D: ...` / `704:1115`)
      - Credits section (`Frame 427318594` / `704:1116`) detailing contributors and roles.
    - Subsequent cards represent the dynamic content blocks defined in the `Events` collection's `content` field (e.g., `EventDetails`, `EventGallery`, `EventSpeaker`). Examples in Figma:
      - Text Block (`Frame 427318599` / `704:1135`)
      - Image (`image 22` / `704:1137`)
      - Speaker Info (`Frame 427318597` / `704:1138`)
      - Gallery-like elements (`IMG_2635` / `704:1192`, `IMG_2613` / `704:1193`)
    - This area is intended to scroll horizontally, likely filling the viewport width initially but allowing overflow scrolling.

3.  **Floating Action Elements:**
    - These elements are positioned independently, likely fixed relative to the viewport.
    - Language Toggle (`Frame 427318562` / `704:654`) allowing users to switch between 'EN' and 'VI'.
    - Menu Button (`Frame 427318578` / `704:663`).

## Figma Content Example (Node 704:624)

The Figma design showcases the following sequence of content blocks within the horizontal scrolling area (`704:1113`), following the initial Metadata Card (`704:1114`):

1.  **Text Block (`704:1135`):** A simple text block with multiple paragraphs describing the event's context. (Likely corresponds to `EventDetails` or a generic Rich Text block).
2.  **Image Block (`704:1137`):** A single, large image. (Likely corresponds to `Media` block or part of `EventGallery`).
3.  **Speaker/Info Block (`704:1138`):** Contains a heading ("Về anh Tùng Chu") and descriptive text about the speaker. (Likely corresponds to `EventSpeaker`).
4.  **Call-to-Action Block (`704:1141`):** A visually distinct block containing a "connect here" button. (Might be a custom block or part of `EventDetails`).
5.  **Rich Text + Links Block (`704:1144`):** Contains a heading, descriptive text, and links (represented as "Instagram" and "Workshop Slide"). (Likely `EventDetails` or a custom block).
6.  **Image Block (`704:1192`):** Another image. (Likely `Media` or `EventGallery`).
7.  **Image Block (`704:1193`):** Yet another image. (Likely `Media` or `EventGallery`).

This example demonstrates how different Payload blocks (`EventDetails`, `EventSpeaker`, `Media`, `EventGallery`, potentially `EventCredits` within the metadata card) would be arranged horizontally.

## Implementation Status

- [ ] **Overall Page Layout:** Base structure with fixed header, scrolling content, and floating actions.
- [ ] **Fixed Header:** Component implemented and styled.
- [ ] **Floating Actions:** Language toggle and Menu button components implemented and styled.
- [ ] **Scrolling Content Area:** Horizontal layout and scrolling behavior implemented.
- [ ] **Metadata Card:** Displaying Event Title and Credits.
  - [ ] Fetching Event Title.
  - [ ] Implementing Credits display (requires `EventCredits` block integration).
- [ ] **Dynamic Block Rendering:** Rendering components based on Payload `content` blocks within the horizontal scroll area.
  - [ ] `EventDetails` Block Component
  - [ ] `EventSpeaker` Block Component
  - [ ] `EventSpeakers` Block Component
  - [ ] `EventGallery` Block Component
  - [ ] `EventCredits` Block Component (Note: Also used in Metadata Card)
  - [ ] Add rendering for other necessary block types.
- [ ] **Data Fetching:** Fetching event data based on the `[slug]` parameter.
- [ ] **Styling:** Applying Tailwind CSS according to Figma design.
- [ ] **Responsiveness:** Ensuring layout adapts to different screen sizes.
- [ ] **Accessibility:** Implementing ARIA attributes and keyboard navigation.
