(async function () {
  const { disabledSites = [], handleType = 'full' } = await chrome.storage.sync.get(['disabledSites', 'handleType']);
  if (disabledSites.includes(location.hostname)) return;

  if (document.getElementById('hvt-panel')) return;

  const FALLBACK_ICON =
    'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" rx="2" fill="%23888"/></svg>';

  let collapseTimer = null;
  let expandTimer = null;

  // --- DOM construction ---

  const trigger = document.createElement('div');
  trigger.id = 'hvt-trigger';

  const handle = document.createElement('div');
  handle.id = 'hvt-handle';
  handle.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="12" height="2.2" rx="1.1" fill="currentColor"/>
    <rect x="1" y="6.9" width="12" height="2.2" rx="1.1" fill="currentColor"/>
    <rect x="1" y="10.8" width="12" height="2.2" rx="1.1" fill="currentColor"/>
  </svg>`;
  trigger.appendChild(handle);

  const panel = document.createElement('div');
  panel.id = 'hvt-panel';

  const header = document.createElement('div');
  header.id = 'hvt-header';
  header.textContent = chrome.i18n.getMessage('panelHeader');

  const list = document.createElement('div');
  list.id = 'hvt-list';

  panel.appendChild(header);
  panel.appendChild(list);
  if (handleType === 'center') trigger.classList.add('hvt-center');

  document.documentElement.appendChild(trigger);
  document.documentElement.appendChild(panel);

  // --- Tab rendering ---

  function buildTabItem(tab) {
    const item = document.createElement('div');
    item.className = 'hvt-item' + (tab.active ? ' hvt-active' : '');
    item.title = tab.title || tab.url || '';

    const icon = document.createElement('img');
    icon.className = 'hvt-icon';
    icon.src = tab.favIconUrl || FALLBACK_ICON;
    icon.onerror = () => { icon.src = FALLBACK_ICON; };

    const title = document.createElement('span');
    title.className = 'hvt-title';
    title.textContent = tab.title || tab.url || chrome.i18n.getMessage('untitledTab');

    const close = document.createElement('button');
    close.className = 'hvt-close';
    close.textContent = '×';
    close.setAttribute('aria-label', chrome.i18n.getMessage('closeTabLabel'));
    close.addEventListener('click', (e) => {
      e.stopPropagation();
      chrome.runtime.sendMessage({ action: 'closeTab', tabId: tab.id });
      item.remove();
    });

    item.addEventListener('click', () => {
      chrome.runtime.sendMessage({
        action: 'switchTab',
        tabId: tab.id,
        windowId: tab.windowId,
      });
    });

    item.appendChild(icon);
    item.appendChild(title);
    item.appendChild(close);
    return item;
  }

  async function renderTabs() {
    const { tabs } = await new Promise((resolve) =>
      chrome.runtime.sendMessage({ action: 'getTabs' }, resolve)
    );

    list.innerHTML = '';
    (tabs || []).forEach((tab) => list.appendChild(buildTabItem(tab)));
  }

  // --- Show / hide ---

  function showPanel() {
    clearTimeout(collapseTimer);
    renderTabs();
    panel.classList.add('hvt-visible');
  }

  function scheduleHide() {
    clearTimeout(collapseTimer);
    collapseTimer = setTimeout(() => panel.classList.remove('hvt-visible'), 250);
  }

  // --- Events ---

  trigger.addEventListener('mouseenter', () => {
    clearTimeout(expandTimer);
    expandTimer = setTimeout(showPanel, 120);
  });

  trigger.addEventListener('mouseleave', () => {
    clearTimeout(expandTimer);
    scheduleHide();
  });

  panel.addEventListener('mouseenter', () => clearTimeout(collapseTimer));
  panel.addEventListener('mouseleave', scheduleHide);

  // --- Disable message from popup ---

  chrome.runtime.onMessage.addListener((request) => {
    if (request.action === 'hvtDisable') {
      trigger.remove();
      panel.remove();
    }
    if (request.action === 'hvtSetHandleType') {
      trigger.classList.toggle('hvt-center', request.handleType === 'center');
    }
  });
})();
