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
    if (node.getAttribute && node.getAttribute('role') === 'listitem') {
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
  document.querySelectorAll('p.d12727d5, [componentkey]').forEach(el => {
    try {
      const text = (el.textContent || '').trim().toLowerCase();
      if (text === 'promoted' || text.startsWith('promoted by')) {
        hideAdPost(el);
      }
    } catch(e) {}
  });
}
function init() {
  let scanTimer = null;
  const observer = new MutationObserver(() => {
    if (scanTimer) clearTimeout(scanTimer);
    scanTimer = setTimeout(() => scanPage(), 100);
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Scan every second
  setInterval(() => scanPage(), 1000);

  setTimeout(() => scanPage(), 500);
  setTimeout(() => scanPage(), 1500);
  setTimeout(() => scanPage(), 3000);
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