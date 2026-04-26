// LinkedIn Ad Block - Content Script

let enabled = true;
let blockedCount = 0;

chrome.storage.local.get('enabled', (data) => {
  enabled = data.enabled !== false;
  if (enabled) init();
});

function hideAdPost(el) {
  let node = el;
  for (let i = 0; i < 20; i++) {
    if (!node || node === document.body) break;
    if (node.className && node.className.includes('_774d721f')) {
      if (!node.dataset.liabHidden) {
        node.style.setProperty('display', 'none', 'important');
        node.dataset.liabHidden = '1';
        blockedCount++;
        chrome.runtime.sendMessage({ type: 'AD_BLOCKED', count: blockedCount });
      }
      return;
    }
    node = node.parentElement;
  }
}
function scanPage() {
  if (!enabled) return;
  document.querySelectorAll('[componentkey]').forEach(el => {
    try {
      if (el.textContent.trim() === 'Promoted') {
        hideAdPost(el);
      }
    } catch(e) {}
  });
}

function init() {
  const observer = new MutationObserver(() => scanPage());
  observer.observe(document.body, { childList: true, subtree: true });
  scanPage();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'SET_ENABLED') {
    enabled = msg.enabled;
    if (enabled) {
      scanPage();
    } else {
      document.querySelectorAll('[data-liab-hidden]').forEach(el => {
        el.style.removeProperty('display');
        delete el.dataset.liabHidden;
      });
      blockedCount = 0;
    }
  }
});