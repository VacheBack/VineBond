# Role
Act as a Senior Front-End Developer specializing in responsive design and UI/UX modernization. 

## Context
We are deploying a massive architectural overhaul to the Vinebond project's landing page (`index.html`). The goal is to transition from a traditional informational site to a highly visual, Instagram-style feed featuring authentic German wineries specifically from the Rheingau region.

## Obstacles
The current legacy code contains obsolete informational sections that must be safely excised without breaking the global layout or overarching CSS styling.

## Actions
Execute the following structural changes to the DOM:
1. Retain the existing Top Bar and Footer without any modifications.
2. Safely deprecate and remove the following legacy DOM elements:
   - ~~The instant booking section~~
   - ~~The organic wines history section~~
3. Implement a responsive CSS grid layout (mobile, tablet, and desktop compatible) to support the new visual feed.

## Solutions & Transformations
Implement the new feature sets according to these exact chronological specifications:

### 1. The Instagram-Style Feed
- Populate the primary feed using **real** placeholder images of German wineries from the Rheingau region.
- Ensure a minimum of **6 top wineries** are immediately visible upon load.
- Insert a distinct routing link directly below the feed labeled "View All Wineries".

---

### 2. Physical Routing: QR Code Integration
Directly below the winery feed, inject a new informative section. This section must instruct users on how to scan physical QR codes located at the vineyards to seamlessly access our platform.

### 3. Gamification: VineClub Partnership Program
Below the QR section, integrate a new UI component detailing our loyalty program. Users earn points by visiting wineries and purchasing wines. Structure the visual data to reflect the following tier matrix:

| Tier Status | Point Requirement | Granted Perks & Services |
| :--- | :--- | :--- |
| Silver | Base Entry | Standard point accumulation |
| Gold | Mid-Level | Extra baseline services |
| Platinum | High-Level | Special invitations to wine tastings with VIP guests |

## Verification Checklist
Before outputting the finalized HTML/CSS snippet, internally verify that the following constraints have been met. Do not output the code if any item remains unchecked.
- [ ] Top bar and footer remain entirely untouched.
- [ ] The layout is fully responsive across three screen breakpoints.
- [ ] Exactly 6 wineries are prominent before the "View All" link.
- [ ] Legacy booking and history sections are entirely absent from the code.