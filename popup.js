(async () => {
  const t = (key) => chrome.i18n.getMessage(key);

  document.getElementById('title').textContent = t('popupTitle');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let host = '';
  try { host = new URL(tab.url).hostname; } catch {}

  if (!host) {
    document.getElementById('main').style.display = 'none';
    const msg = document.getElementById('special-page');
    msg.style.display = 'block';
    msg.textContent = t('popupSpecialPage');
    return;
  }

  document.getElementById('host').textContent = host;

  const { disabledSites = [], handleType = 'full' } = await chrome.storage.sync.get(['disabledSites', 'handleType']);
  let disabled = disabledSites.includes(host);
  let currentHandleType = handleType;

  const btn = document.getElementById('toggleBtn');
  const btnFull = document.getElementById('btnFull');
  const btnCenter = document.getElementById('btnCenter');

  document.getElementById('handleTypeLabel').textContent = t('handleTypeLabel');
  btnFull.textContent = t('handleTypeFull');
  btnCenter.textContent = t('handleTypeCenter');

  function render() {
    if (disabled) {
      btn.textContent = t('enableOnSite');
      btn.className = 'btn-enable';
    } else {
      btn.textContent = t('disableOnSite');
      btn.className = 'btn-disable';
    }
    btnFull.classList.toggle('seg-active', currentHandleType === 'full');
    btnCenter.classList.toggle('seg-active', currentHandleType === 'center');
  }

  render();

  btn.addEventListener('click', async () => {
    const { disabledSites: current = [] } = await chrome.storage.sync.get('disabledSites');
    let updated;

    if (current.includes(host)) {
      updated = current.filter((h) => h !== host);
      disabled = false;
    } else {
      updated = [...current, host];
      disabled = true;
    }

    await chrome.storage.sync.set({ disabledSites: updated });

    if (disabled) {
      try {
        await chrome.tabs.sendMessage(tab.id, { action: 'hvtDisable' });
      } catch {}
    } else {
      chrome.tabs.reload(tab.id);
    }

    window.close();
  });

  async function setHandleType(type) {
    currentHandleType = type;
    await chrome.storage.sync.set({ handleType: type });
    try {
      await chrome.tabs.sendMessage(tab.id, { action: 'hvtSetHandleType', handleType: type });
    } catch {}
    render();
  }

  btnFull.addEventListener('click', () => setHandleType('full'));
  btnCenter.addEventListener('click', () => setHandleType('center'));
})();
