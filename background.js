// LinkedIn Ad Block - Background Service Worker

let totalBlocked = 0;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'AD_BLOCKED') {
    totalBlocked = msg.count;
    // Update badge on extension icon
    chrome.action.setBadgeText({ text: String(totalBlocked) });
    chrome.action.setBadgeBackgroundColor({ color: '#0077b5' });
  }
});
