# YouTube Features Controller

A Chrome extension that helps you control and customize your YouTube viewing experience by allowing you to block Shorts and Playables content.

## Features

- **Block YouTube Shorts**: Toggle to hide all Shorts content from your feed
- **Block Playables**: Toggle to hide all Playable videos
- **Account Information**: View your YouTube channel name and content restriction mode
- **Persistent Settings**: Your preferences are saved and automatically applied
- **Real-time Updates**: Changes take effect immediately without page refresh

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory

## Usage

1. Click the extension icon in your Chrome toolbar while on YouTube.com
2. Use the toggle switches to enable/disable features:
   - Toggle "Block Shorts" to hide YouTube Shorts content
   - Toggle "Block Playables" to hide Playable videos
3. View your account information in the top section
4. Settings are automatically saved and applied across YouTube pages

## Technical Details

- Built with vanilla JavaScript
- Uses Chrome's Storage API for persistence
- Implements MutationObserver for real-time DOM updates
- Styled with custom CSS including HubSpot-inspired toggle switches

## Permissions

The extension requires minimal permissions:

- `storage`: To save your preferences
- `activeTab`: To modify YouTube's content
- Access to YouTube.com domain only

## Notes

- Works only on YouTube.com domains
- Requires Chrome browser
- No data collection or external services used
