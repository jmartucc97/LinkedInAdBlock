// LinkedIn Ad Block - Content Script

let enabled = true;
let blockedCount = 0;

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

function hideSidebarAd(el) {
  let node = el;
  for (let i = 0; i < 10; i++) {
    if (!node || node === document.body) break;
    if (node.dataset && node.dataset.liabHidden) return;
    if (node.tagName === 'SECTION' || node.tagName === 'LI' ||
        (node.tagName === 'DIV' && node.offsetHeight > 50 && node.offsetWidth > 100)) {
      node.style.setProperty('display', 'none', 'important');
      node.dataset.liabHidden = '1';
      blockedCount++;
      chrome.runtime.sendMessage({ type: 'AD_BLOCKED', count: blockedCount });
      return;
    }
    node = node.parentElement;
  }
}

function scanPage() {
  if (!enabled) return;

  // Block feed promoted posts
  document.querySelectorAll('p.d12727d5, [componentkey]').forEach(el => {
    try {
      const text = (el.textContent || '').trim().toLowerCase();
      if (text.startsWith('promoted')) {
        hideAdPost(el);
      }
    } catch(e) {}
  });

  // Block sidebar ads by iframe title
  document.querySelectorAll('iframe[title="advertisement"]').forEach(el => {
    try {
      hideSidebarAd(el);
    } catch(e) {}
  });

  // Block sidebar ads by componentkey
  document.querySelectorAll('[componentkey*="feed_ad"]').forEach(el => {
    try {
      if (!el.dataset.liabHidden) {
        el.style.setProperty('display', 'none', 'important');
        el.dataset.liabHidden = '1';
        blockedCount++;
        chrome.runtime.sendMessage({ type: 'AD_BLOCKED', count: blockedCount });
      }
    } catch(e) {}
  });

  // Block promoted badge sidebar ads
  document.querySelectorAll('[data-testid="promoted-badge"]').forEach(el => {
    try {
      hideSidebarAd(el);
    } catch(e) {}
  });
}

function init() {
  const observer = new MutationObserver(() => scanPage());
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('scroll', () => scanPage(), { passive: true });
  setInterval(scanPage, 1000);
  scanPage();
}

if (document.body) {
  init();
} else {
  document.addEventListener('DOMContentLoaded', init);
}

chrome.storage.local.get('enabled', (data) => {
  enabled = data.enabled !== false;
});

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