let myButton = document.getElementById('clickButton');
let list = document.getElementById('textCaptured');
let pageURL = document.getElementById('urlCaptured');

let searchQuery = null;

if (myButton == null)
	list.innerHTML += "PROBLEMS";

myButton.addEventListener ('click', async () => {
	//if (!tab.url || !tab.url.startsWith('http')) {
	//	return;
	//}
	
	list.innerHTML = "<br><center>Processing ... please wait a few seconds ...</center>";

	let [tab] =await chrome.tabs.query({active:true, currentWindow: true});
	chrome.runtime.sendMessage({action: 'invoke_python_function', data:{key: 'value' , "url": tab.url} });
});

chrome.runtime.onMessage.addListener (function (request, sender, sendResponse) {
	if (request.result) {
		list.innerHTML = request.result;
	}
	else {
		list.innerHTML = "No Results Found";
	}
});
