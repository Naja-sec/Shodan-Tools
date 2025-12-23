// Menu Navigation System
class MenuManager {
  constructor() {
    this.currentView = 'mainMenu';
    this.init();
  }

  init() {
    // Menu item click handlers
    document.querySelectorAll('.menu-item').forEach(item => {
      item.addEventListener('click', () => {
        const viewId = item.getAttribute('data-view');
        this.showView(viewId);
      });
    });

    // Back button handlers
    document.querySelectorAll('.back-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.showView('mainMenu');
      });
    });
  }

  showView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
      view.classList.remove('active');
    });

    // Show selected view
    const targetView = document.getElementById(viewId);
    if (targetView) {
      targetView.classList.add('active');
      this.currentView = viewId;
    }
  }
}

// Initialize menu manager
const menuManager = new MenuManager();

// IP Extractor functionality
document.getElementById('extractButton').addEventListener('click', async () => {
  console.log('Extract button clicked');
  const button = document.getElementById('extractButton');
  const textarea = document.getElementById('ipList');
  
  button.style.opacity = '0.7';
  button.disabled = true;
  textarea.value = 'Extracting...';
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log('Active tab:', tab);
    
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const ipElements = document.querySelectorAll('strong');
        const ipAddresses = [];
        ipElements.forEach(element => {
          ipAddresses.push(element.innerText);
        });
        console.log('Extracted IPs:', ipAddresses);
        return ipAddresses;
      }
    });
    
    console.log('Results:', results);
    if (results && results[0] && results[0].result) {
      const ips = results[0].result;
      if (ips.length > 0) {
        textarea.value = ips.join('\n');
      } else {
        textarea.value = 'No IPs found';
      }
    } else {
      textarea.value = 'No IPs found';
    }
  } catch (error) {
    console.error('Error:', error);
    textarea.value = 'Error: ' + error.message;
  } finally {
    button.style.opacity = '1';
    button.disabled = false;
  }
});


const intelButton = document.getElementById('intelOpenButton');
const singleIpInput = document.getElementById('singleIpInput');

function openIntelTabs(ip) {
  const query = encodeURIComponent(ip.trim());
  if (!query) {
    singleIpInput.focus();
    return;
  }
//

  const targets = [
    { name: 'Shodan', url: `https://www.shodan.io/search?query=${query}` },
    { name: 'Censys', url: `https://search.censys.io/hosts/${query}` },
    { name: 'ZoomEye', url: `https://www.zoomeye.org/searchResult?q=${query}` },
    { name: 'FOFA', url: `https://fofa.info/result?q=${query}` },
    { name: 'CriminalIP', url: `https://www.criminalip.io/asset/search?query=ip%${query}` },
    { name: 'Onyphe', url: `https://www.onyphe.io/search/?query=${query}` },
    { name: 'GreyNoise', url: `https://viz.greynoise.io/ip/${query}` },
  ];

  targets.forEach(target => {
    chrome.tabs.create({ url: target.url });
  });
}

if (intelButton && singleIpInput) {
  intelButton.addEventListener('click', () => {
    const ip = singleIpInput.value;
    if (!ip.trim()) {
      singleIpInput.focus();
      return;
    }
    openIntelTabs(ip);
  });

  singleIpInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
      event.preventDefault();
      intelButton.click();
    }
  });
}
