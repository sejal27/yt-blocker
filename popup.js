document.addEventListener('DOMContentLoaded', async () => {
  const shortsToggle = document.getElementById('shorts-toggle');
  const playablesToggle = document.getElementById('playables-toggle');
  const youtubeControls = document.getElementById('youtube-controls');
  const notYoutube = document.getElementById('not-youtube');

  // Check if current tab is YouTube
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const isYoutube = tab.url.includes('youtube.com');

  if (!isYoutube) {
    youtubeControls.style.display = 'none';
    notYoutube.style.display = 'block';
    return;
  }

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