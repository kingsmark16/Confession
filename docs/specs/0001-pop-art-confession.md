# 0001. Pop Art Confession Page

**Date**: 2026-07-10
**Status**: In Progress

## Summary

Build one public confession page that follows the supplied Stitch screen. It gives someone a bright, playful way to share a love letter and a few memories. Visitors can play the bundled romantic songs as a continuous playlist. The experience needs no account or server work.

## Context

The project is a Vite and React starter. The supplied Stitch screen is the visual and content source for this feature. It defines the pop art look, page order, copy, motion, and gallery content.

The gallery image links in the source are hosted elsewhere. The build must keep local copies in the project so the page does not depend on temporary design export links.

The navigation already offers a play music action. The player must use the songs bundled in `src/assets/music`, offer playback controls, and keep playing when its popup closes.

## Requirements

**User stories**:

- As a visitor, I want to read a bold personal confession so that the message feels celebratory and memorable.
- As the page owner, I want the supplied design and gallery to render reliably from project assets.
- As a visitor, I want to play the included romantic songs so that the confession has a ready made personal soundtrack.

**Acceptance criteria**:

- **AC-1**: The public page shows the supplied navigation, hero, confession, four memory cards, three reasons cards, final invitation, and footer in that order.
- **AC-2**: The page matches the supplied pop art direction through its yellow dot field, black outlines, red, green, and yellow accents, irregular sticker shapes, large display text, and offset shadows.
- **AC-3**: The four gallery images are local project files and each keeps the meaning and label from the supplied screen.
- **AC-4**: Navigation and primary call to action links move to their matching page sections. Entering the viewport reveals cards, floating emojis add movement, and reduced motion settings prevent nonessential animation.
- **AC-5**: The page works at narrow and wide viewport sizes. All interactive elements are keyboard reachable and retain clear focus feedback.
- **AC-6**: The play music action opens an accessible popup that lists the bundled songs from `src/assets/music` without showing a file picker.
- **AC-7**: The player provides previous, play or pause, and next controls. Closing the popup does not stop or reset active playback.
- **AC-8**: When a song ends, the next song starts automatically. The playlist returns to the first song after the final song.
- **AC-9**: Romantic decorative animation is visible only while audio is playing and respects reduced motion settings.

## Options considered

### Option 1: Port the supplied screen as React and local assets

Recreate the supplied screen in the existing React project and store its gallery images in the repository.

**Pros**:

- Keeps the supplied visual direction and interaction details.
- Fits the existing project with no new service or package.
- Avoids live design image links.

**Cons**:

- Copy and photos remain examples until the owner personalizes them.

### Option 2: Embed the supplied HTML directly

Serve the Stitch export as one HTML document.

**Pros**:

- Requires little code translation.

**Cons**:

- Bypasses the React application and keeps remote asset links.
- Makes accessibility and motion improvements harder to maintain.

### Option 3: Bundled audio playlist

Import the project audio assets and expose them as a fixed playlist.

**Pros**:

- Gives every visitor a ready to play soundtrack.
- Needs no file selection, account, or external music provider.
- Supports multiple files and automatic next track playback.

**Cons**:

- Audio files increase the deployed application size.
- Changing the playlist requires updating project assets.

### Option 4: Visitor selected local files

Use a browser file picker and temporary object URLs for visitor selected songs.

**Pros**:

- Visitors could supply their own soundtrack.

**Cons**:

- Adds an unwanted selection step and loses the curated experience.

## Decision

**Chosen option**: Option 1 with Option 3

Build the confession page in React with local gallery images, page scoped styles, and a bundled romantic audio playlist.

## Rationale

The starter already uses React and the supplied screen is a single static page. A direct React port is the smallest reliable change. Local gallery and music assets keep the experience reliable and remove the need for a file picker or music service.

## Feature design

**Data model sketch**:

The page keeps static copy, a fixed local gallery list, and a fixed bundled music playlist. Each song has an identifier, display name, and imported asset URL.

**State transitions**:

Music player: ready, playing, paused. Play moves ready or paused to playing. Pause moves playing to paused. Closing the popup changes only popup visibility and never playback state. A finished song advances to the next song and remains playing.

**API surface**:

None. The feature makes no application requests.

**Key invariants**:

- The visible section order and supplied labels remain intact.
- Gallery image alt text describes the memory instead of repeating decorative text.
- Links target sections that exist on the page.
- Reduced motion removes continuous and entrance animation while preserving content.
- The audio element remains mounted while the page is open, even when the popup is closed.
- The playlist comes only from project assets and presents no file picker.
- Previous and next wrap around the playlist in both directions.

**Security model**:

The page is public and has no authentication, submission, upload, or visitor file access.

**Critical test scenarios**:

- Happy path: a visitor reads every section and uses the navigation or hero link to reach the confession, verifies **AC-1** and **AC-4**.
- Failure case: a visitor enables reduced motion and still sees every section without continuous animation, verifies **AC-4**.
- Access: a keyboard visitor reaches all links and buttons with a visible focus state, verifies **AC-5**.
- Music path: a visitor opens the popup, plays a bundled song, closes the popup, and playback continues, verifies **AC-6** and **AC-7**.
- Playlist path: the current song ends and the next starts, including wraparound after the last song, verifies **AC-8**.
- Motion path: romantic animation starts and stops with playback and is suppressed by reduced motion, verifies **AC-9**.

## Build plan

1. Download the supplied gallery images into public assets and preserve useful file names and alt text, satisfies **AC-3**.
2. Build the responsive React page structure with the supplied sections and copy, satisfies **AC-1** and **AC-5**.
3. Add the pop art style system, local image gallery, navigation targets, reveal effects, floating emojis, and reduced motion rules, satisfies **AC-2**, **AC-3**, and **AC-4**.
4. Run the production build and lint checks, then correct any failures, satisfies **AC-1**, **AC-2**, **AC-3**, **AC-4**, and **AC-5**.
5. Add a page level music player with a bundled asset playlist and an audio element that remains mounted outside the popup, satisfies **AC-6** and **AC-7**.
6. Add playlist selection, previous, play or pause, next, and automatic next track behavior, satisfies **AC-6**, **AC-7**, and **AC-8**.
7. Add the accessible responsive popup and playback driven romantic animation, satisfies **AC-6** and **AC-9**.
8. Run the production build and lint checks for the music player enhancement, satisfies **AC-6**, **AC-7**, **AC-8**, and **AC-9**.

## Consequences

**Positive**:

- The design is available inside the existing app.
- The gallery remains available when external export image links expire.
- Visitors receive a ready to play romantic soundtrack.

**Negative / tradeoffs**:

- The current copy and photos are demonstration content that should be changed before a personal launch.
- The page is a static experience and does not collect responses.
- Bundled music increases the application download size and depends on browser supported audio formats.

**Neutral**:

- No server, environment variable, database, music provider, or new package is required.

## Follow-up

- [ ] Replace the example copy and memory photos with the owner’s real message before publishing.
