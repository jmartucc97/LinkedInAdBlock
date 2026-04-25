// LinkedIn Ad Block - Content Script
// CSS handles the initial block; this script catches dynamically loaded ads as you scroll

let enabled = true;
let blockedCount = 0;

// Load saved state
chrome.storage.local.get('enabled', (data) => {
  enabled = data.enabled !== false; // default to true
  if (enabled) observe();
});

// Selectors that identify ad elements
const AD_SELECTORS = [
  // Sponsored feed posts - look for "Promoted" text in the actor description
  '.feed-shared-update-v2',
  '.occludable-update',
  '[data-urn]',
];

const PROMOTED_STRINGS = ['promoted', 'sponsored', 'promoted\n', 'sponsored\n'];

function isAdPost(el) {
  // Check for "Promoted" label in actor sub-description
  const subDesc = el.querySelector('.update-components-actor__sub-description');
  if (subDesc) {
    const text = subDesc.innerText.trim().toLowerCase();
    if (PROMOTED_STRINGS.some(s => text.startsWith(s))) return true;
  }

  // Check data attributes
  const urn = el.getAttribute('data-urn') || '';
  if (urn.includes('sponsored')) return true;

  // Check for promo components
  if (el.querySelector('.update-components-promo')) return true;

  // Check for ad banner in sidebars
  if (el.querySelector('.ad-banner-container, [class*="ad-slot"], [data-ad-banner]')) return true;

  return false;
}

function isSidebarAd(el) {
  const classes = el.className || '';
  const id = el.id || '';
  return (
    classes.includes('ad-banner') ||
    classes.includes('ad-slot') ||
    classes.includes('ad_slot') ||
    classes.includes('ads-container') ||
    id.includes('ad_unit') ||
    id.includes('_ads_') ||
    el.querySelector('.ad-banner-container') !== null
  );
}

function hideEl(el) {
  if (el.dataset.liabHidden) return; // already processed
  el.style.setProperty('display', 'none', 'important');
  el.dataset.liabHidden = '1';
  blockedCount++;
  chrome.runtime.sendMessage({ type: 'AD_BLOCKED', count: blockedCount });
}

function scanPage() {
  if (!enabled) return;

  // Feed posts
  document.querySelectorAll('.feed-shared-update-v2, .occludable-update').forEach(el => {
    if (isAdPost(el)) hideEl(el);
  });

  // Sidebar ads
  document.querySelectorAll('section, aside, div').forEach(el => {
    if (isSidebarAd(el)) hideEl(el);
  });
}

function observe() {
  const observer = new MutationObserver(() => scanPage());
  observer.observe(document.body, { childList: true, subtree: true });
  scanPage();
}

// Listen for toggle from popup
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SET_ENABLED') {
    enabled = msg.enabled;
    if (enabled) {
      scanPage();
    } else {
      // Restore hidden elements
      document.querySelectorAll('[data-liab-hidden]').forEach(el => {
        el.style.removeProperty('display');
        delete el.dataset.liabHidden;
      });
      blockedCount = 0;
    }
  }
  if (msg.type === 'GET_COUNT') {
    chrome.runtime.sendMessage({ type: 'AD_BLOCKED', count: blockedCount });
  }
});
