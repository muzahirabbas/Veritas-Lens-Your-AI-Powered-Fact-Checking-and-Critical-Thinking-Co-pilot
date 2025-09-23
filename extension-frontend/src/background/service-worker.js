
import browser from 'webextension-polyfill';

let domainsData = null;

async function fetchDomains() {
  if (domainsData) return domainsData;
  try {
    const url = browser.runtime.getURL('assets/domains.json');
    const response = await fetch(url);
    domainsData = await response.json();
    return domainsData;
  } catch (error) {
    console.error('VeritasLens Error: Could not fetch domains.json', error);
    return { high_trust: [], low_trust: [] };
  }
}

async function updateActionIcon(tabId, url) {
  if (!url) return;

  const { high_trust, low_trust } = await fetchDomains();
  const currentUrl = new URL(url);
  const domain = currentUrl.hostname.replace('www.', '');

  let status = 'neutral';
  let title = 'Veritas Lens: Source Trust Unknown';

  if (high_trust.some(d => domain.includes(d))) {
    status = 'high';
    title = 'Veritas Lens: High Trust Source';
  } else if (low_trust.some(d => domain.includes(d))) {
    status = 'low';
    title = 'Veritas Lens: Low Trust Source';
  }
  // Placeholder for future heuristic analysis (caution status)

  const iconPaths = {
    high: '/icons/icon-48-green.png', // Note: These icons need to be created
    low: '/icons/icon-48-red.png',
    caution: '/icons/icon-48-yellow.png',
    neutral: '/icons/icon-48.png',
  };

  // For this version, we will change badge color instead of icon to avoid creating more assets
  const badgeColors = {
      high: '#27AE60', // Green
      low: '#C0392B', // Red
      caution: '#F39C12', // Yellow
      neutral: '#343A40' // Dark Gray
  }

  try {
    await browser.action.setTitle({ tabId, title });
    if (status !== 'neutral') {
        await browser.action.setBadgeText({ tabId, text: ' ' }); // small space to show color
        await browser.action.setBadgeBackgroundColor({ tabId, color: badgeColors[status] });
    } else {
        await browser.action.setBadgeText({ tabId, text: '' });
    }
  } catch (error) {
    // This can fail if the tab is closed, which is fine.
    // console.error(`Failed to update action for tab ${tabId}:`, error);
  }
}


function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.status === 'complete' && tab.url && tab.active) {
    updateActionIcon(tabId, tab.url);
  }
}

function handleTabActivation(activeInfo) {
  browser.tabs.get(activeInfo.tabId).then(tab => {
    if (tab && tab.url) {
      updateActionIcon(activeInfo.tabId, tab.url);
    }
  }).catch(e => console.error("Error getting tab info:", e));
}


// Listen for tab updates and activations
browser.tabs.onUpdated.addListener(handleTabUpdate);
browser.tabs.onActivated.addListener(handleTabActivation);

// Fetch domains on startup
fetchDomains();
