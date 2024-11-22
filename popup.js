document.addEventListener('DOMContentLoaded', async () => {
  const shortsToggle = document.getElementById('shorts-toggle');
  const playablesToggle = document.getElementById('playables-toggle');
  const youtubeControls = document.getElementById('youtube-controls');
  const notYoutube = document.getElementById('not-youtube');
  const userNameElement = document.getElementById('user-name');
  const restrictionLevelElement = document.getElementById('restriction-level');

  // Check if current tab is YouTube
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isYoutube = tab.url.includes('youtube.com');

  if (!isYoutube) {
    youtubeControls.style.display = 'none';
    notYoutube.style.display = 'block';
    return;
  }

  // Get user info
  chrome.tabs.sendMessage(tab.id, { action: 'getUserInfo' }, (response) => {
    if (response) {
      userNameElement.textContent = response.name;
      restrictionLevelElement.textContent = response.restrictionLevel;
      
      // Add color coding for restriction levels
      if (response.restrictionLevel === 'Restricted Mode') {
        restrictionLevelElement.style.color = '#c00';
      } else if (response.restrictionLevel === 'Kids Mode') {
        restrictionLevelElement.style.color = '#2979ff';
      } else {
        restrictionLevelElement.style.color = '#080';
      }
    }
  });

  // Load saved preferences
  chrome.storage.sync.get(['blockShorts', 'blockPlayables'], (result) => {
    shortsToggle.checked = result.blockShorts || false;
    playablesToggle.checked = result.blockPlayables || false;
  });

  // Save preferences and update content
  shortsToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ blockShorts: shortsToggle.checked });
    chrome.tabs.sendMessage(tab.id, { 
      action: 'updatePreferences',
      blockShorts: shortsToggle.checked,
      blockPlayables: playablesToggle.checked
    });
  });

  playablesToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ blockPlayables: playablesToggle.checked });
    chrome.tabs.sendMessage(tab.id, {
      action: 'updatePreferences',
      blockShorts: shortsToggle.checked,
      blockPlayables: playablesToggle.checked
    });
  });
}); 