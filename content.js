let blockShorts = false;
let blockPlayables = false;

// Load saved preferences
chrome.storage.sync.get(['blockShorts', 'blockPlayables'], (result) => {
  blockShorts = result.blockShorts || false;
  blockPlayables = result.blockPlayables || false;
  applyPreferences();
});

// Listen for preference updates
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updatePreferences') {
    blockShorts = request.blockShorts;
    blockPlayables = request.blockPlayables;
    applyPreferences();
  }
});

function applyPreferences() {
  const style = document.createElement('style');
  style.id = 'youtube-features-controller';
  
  let css = '';
  
  if (blockShorts) {
    css += `
      ytd-reel-shelf-renderer,
      ytd-rich-shelf-renderer[is-shorts],
      ytd-mini-guide-entry-renderer[aria-label*="Shorts"],
      ytd-guide-entry-renderer[aria-label*="Shorts"] {
        display: none !important;
      }
    `;
  }
  
  if (blockPlayables) {
    css += `
      ytd-rich-item-renderer[is-playable],
      ytd-video-renderer[is-playable] {
        display: none !important;
      }
    `;
  }
  
  // Remove existing style if present
  const existingStyle = document.getElementById('youtube-features-controller');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  style.textContent = css;
  document.head.appendChild(style);
}

// Apply preferences on page load and DOM changes
applyPreferences();
const observer = new MutationObserver(() => applyPreferences());
observer.observe(document.body, { childList: true, subtree: true }); 