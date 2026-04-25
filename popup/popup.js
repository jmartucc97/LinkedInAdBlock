// LinkedIn Ad Block - Popup Script

const toggle = document.getElementById('toggle');
const countEl = document.getElementById('count');

// Load saved state
chrome.storage.local.get(['enabled', 'blockedCount'], (data) => {
  toggle.checked = data.enabled !== false;
  countEl.textContent = data.blockedCount || 0;
});

// Toggle blocking on/off
toggle.addEventListener('change', () => {
  const enabled = toggle.checked;
  chrome.storage.local.set({ enabled });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'SET_ENABLED', enabled });
    }
  });
});

// Listen for count updates
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'AD_BLOCKED') {
    countEl.textContent = msg.count;
    chrome.storage.local.set({ blockedCount: msg.count });
  }
});
