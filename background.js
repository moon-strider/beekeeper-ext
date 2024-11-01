const BEEKEEPER_URL = 'TBA';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action) {
      authenticateUser().then(token => {
        getUserTier(token).then(tier => {
          if (isActionAllowed(request.action, tier)) {
            performAction(request.action, token);
          } else {
            sendResponse({ status: 'error', message: 'Action not permitted for your tier.' });
          }
        }).catch(error => {
          sendResponse({ status: 'error', message: 'Failed to retrieve user tier.' });
        });
      }).catch(error => {
        sendResponse({ status: 'error', message: 'Authentication failed.' });
      });
      return true;
    }
  });
  
  async function authenticateUser() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['authToken'], (result) => {
        if (result.authToken) {
          resolve(result.authToken);
        } else {
          reject('No auth token found.');
        }
      });
    });
  }
  
  async function getUserTier(token) {
    const response = await fetch(`${BEEKEEPER_URL}/user/tier`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch user tier.');
    }
    const data = await response.json();
    return data.tier;
  }
  
  function isActionAllowed(action, tier) {
    const permissions = {
      'free': ['takeScreeenshot'],
      'premium': ['takeScreenshot', 'copy', 'paste', 'fillForm'],
    };
    return permissions[tier] && permissions[tier].includes(action);
  }
  
  function performAction(action, token) {
    switch(action) {
      case 'takeScreenshot':
        takeScreenshot(token);
        break;
      case 'fillForm':
        fillForm(token);
        break;
      case 'copy':
        manipulateClipboard('copy', token);
        break;
      case 'paste':
        manipulateClipboard('paste', token);
        break;
      default:
        console.error('Unknown action:', action);
    }
  }
  
  function takeScreenshot(token) {
    chrome.tabs.captureVisibleTab(null, {}, async (image) => {
      const response = await fetch(`${BEEKEEPER_URL}/screenshot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ image })
      });
      if (response.ok) {
        console.log('Screenshot uploaded successfully.');
      } else {
        console.error('Failed to upload screenshot.');
      }
    });
  }
  
  function fillForm(token) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'fillForm', token });
    });
  }
  
  function manipulateClipboard(type, token) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: type, token });
    });
  }
  