# LinkedIn Ad Block

A Chrome extension that blocks sponsored posts and display ads from your LinkedIn feed and sidebar.

## What it blocks
- **Sponsored / Promoted posts** in your feed
- **Display ads** in the right sidebar
- **Promoted job listings** in the feed

## How it works
- A CSS file injected at page load instantly hides known ad elements before they render
- A MutationObserver watches for dynamically loaded ads as you scroll and hides those too
- A counter in the popup tracks how many ads have been blocked this session
- Toggle blocking on/off any time from the popup

## Installation

1. Clone this repo
   ```bash
   git clone https://github.com/jmartucc97/LinkedInAdBlock.git
   ```
2. Go to `chrome://extensions` in Chrome
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked** and select the `linkedin-ad-block` folder
5. Navigate to linkedin.com — ads will be blocked automatically

## Notes
- LinkedIn occasionally updates its markup, which may require updating selectors in `content.js` and `block.css`
- This extension only runs on `linkedin.com`

## License
MIT
