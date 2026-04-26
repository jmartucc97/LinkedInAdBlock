# LinkedIn Ad Block

Linkedin is less like a job board and more a social media and as grarbage dump now, this will remove sponsored posts from your feed to diminish annoying advertisements and slop taking your time away.

## What it blocks
- **Sponsored / Promoted posts** in your feed

## How it works
- A CSS file injected at page load instantly hides known ad elements before they render
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
- This extension only runs on `linkedin.com`
