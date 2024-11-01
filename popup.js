document.getElementById('screenshot').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'takeScreenshot' });
  });
  
  document.getElementById('fillForm').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'fillForm' });
  });
  
  document.getElementById('copy').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'copy' });
  });
  
  document.getElementById('paste').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'paste' });
  });
  