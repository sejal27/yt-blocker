let blockShorts = false;
let blockPlayables = false;

function getUserInfo() {
  const userInfo = {
    name: 'Not logged in',
    restrictionLevel: 'Unknown'
  };

  // Check if user is logged in
  const avatarButton = document.querySelector('button#avatar-btn');
  if (!avatarButton) {
    return userInfo;
  }

  // Get channel name
  const channelNameElement = document.querySelector('yt-formatted-string.ytd-channel-name');
  if (channelNameElement) {
    userInfo.name = channelNameElement.textContent.trim();
  }

  // Check for restriction indicators
  const restrictedMode = document.querySelector('ytd-toggle-button-renderer[is-restricted-mode]');
  const kidsMode = document.querySelector('ytd-app[is-kids-page]');
  
  if (restrictedMode) {
    userInfo.restrictionLevel = 'Restricted Mode';
  } else if (kidsMode) {
    userInfo.restrictionLevel = 'Kids Mode';
  } else {
    userInfo.restrictionLevel = 'Standard Mode';
  }

  return userInfo;
}

// Message listener for user info requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getUserInfo') {
    sendResponse(getUserInfo());
  }
  if (request.action === 'updatePreferences') {
    blockShorts = request.blockShorts;
    blockPlayables = request.blockPlayables;
    applyPreferences();
  }
});

// Load saved preferences
chrome.storage.sync.get(['blockShorts', 'blockPlayables'], (result) => {
  blockShorts = result.blockShorts || false;
  blockPlayables = result.blockPlayables || false;
  applyPreferences();
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

// Add this line at the end
getUserInfo(); 