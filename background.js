chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.text) {
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${message.text}`;
      
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "No meaning found";
          chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: showPopup,
            args: [message.text, meaning]
          });
        })
        .catch(error => console.error("Error fetching word meaning:", error));
    }
  });
  
  function showPopup(word, meaning) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '10px';
    popup.style.right = '10px';
    popup.style.background = '#fff';
    popup.style.padding = '10px';
    popup.style.border = '1px solid #ccc';
    popup.style.zIndex = '1000';
    popup.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
    popup.innerHTML = `<strong>${word}:</strong> ${meaning}`;
    
    document.body.appendChild(popup);
    
    setTimeout(() => popup.remove(), 5000);
  }
  