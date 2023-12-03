
// Basic admin
chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension Installed");
});

// Binding an event to send a request to the python server ... 
// then pass the response back to the chrome extender
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'invoke_python_function') {
    fetch('http://localhost:5000/invoke_python_function', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request.data)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Result from Python:', data.result);
      chrome.runtime.sendMessage({ result: data.result });
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
});
