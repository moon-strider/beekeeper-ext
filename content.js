const BEEKEEPER_URL = 'TBA';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'fillForm') {
      fillFormOnPage(request.token);
    } else if (request.action === 'copy') {
      copyToClipboard();
    } else if (request.action === 'paste') {
      pasteFromClipboard();
    }
  });
  
  function fillFormOnPage(token) {
    fetch(`${BEEKEEPER_URL}/formdata`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      for (const [field, value] of Object.entries(data)) {
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
          input.value = value;
        }
      }
    })
    .catch(error => {
      console.error('Failed to fetch form data:', error);
    });
  }
  
  function copyToClipboard() {
    navigator.clipboard.readText()
      .then(text => {
        console.log('Copied text:', text);
      })
      .catch(err => {
        console.error('Failed to read clipboard:', err);
      });
  }
  
  function pasteFromClipboard() {
    navigator.clipboard.readText()
      .then(text => {
        const input = document.querySelector('input');
        if (input) {
          input.value = text;
        }
      })
      .catch(err => {
        console.error('Failed to read clipboard:', err);
      });
  }
  