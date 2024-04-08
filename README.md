# Malicious Sites Checker

## Description
This Chrome extension alerts users about potentially malicious websites by applying filters to URLs and checking them against the VirusTotal API for analysis.

## Usage
1. Install the extension by loading the unpacked extension in Chrome's extension settings.
2. Click on the extension icon to check the current website.
3. If the website is suspected as malicious, a confirmation dialog will prompt for further inspection.
4. Upon confirmation, the extension checks the URL against the VirusTotal API for analysis.
5. The extension displays the analysis result in an alert box.

## Features
- URL filtering based on string patterns (e.g., no HTTPS, IP address only, presence of hyphens or symbols).
- Integration with the VirusTotal API for URL analysis.
- Background script runs continuously to monitor website URLs.
- User-friendly alerts for inspection and analysis results.

## Installation
1. Clone this repository to your local machine.
2. Open Chrome and go to `chrome://extensions/`.
3. Enable Developer mode in the top right corner.
4. Click on "Load unpacked" and select the cloned repository folder.
5. The extension icon should now appear in your browser's toolbar.

## Permissions
- `tabs`: Allows the extension to access and modify the active tab's URL.
- `https://www.virustotal.com/*`: Allows the extension to make API requests to VirusTotal for URL analysis.

## Disclaimer
This extension is for educational and informational purposes only. It does not guarantee the security of websites and should not be used as the sole basis for determining a website's safety.
