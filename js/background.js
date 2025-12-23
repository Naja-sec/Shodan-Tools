console.log('Content script loaded!');

function extractIPs() {
  const ipElements = document.querySelectorAll('strong');
  const ipAddresses = [];
  ipElements.forEach(element => {
      ipAddresses.push(element.innerText);
  });
  console.log('Extracted IPs:', ipAddresses);
  return ipAddresses;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message received:', message);
  if (message.action === "getIPs") {
      const ips = extractIPs();
      console.log('Sending response:', { ips });
      sendResponse({ ips });
      return true; 
  }
});
