let mybutton = document.getElementById('clickButton');
let list = document.getElementById('textCaptured');

// Handler to receive text from content script]
chrome.runtime.onMessage.addListener ((request, sender, sendResponse) => {
	//get text
	let text = request.innerHTMLString;

	// Display text in the popup
	if (text == null || text.length == 0) {
		// no text
		//let li = document.createElement('li');
		//li.innerText = 'No text found';
		//list.appendChild(li);
		list.innerHTML += 'No text found';
	}
	else {
		alert("YOYOYOY2");

		alert(text);
		// display text
		/*text.forEach((doc) => {
			let li = document.createElement('li');
			li.innerText = doc;
			list.appendChild(li);
		})*/
		//let li = document.createElement('li');
		//li.inerText = text;
		//list.appendChild(li);
		list.innerHTML += text;
	}
	sendResponse({status : true});

})

// Button's click event listener
mybutton.addEventListener('click', async () => { 
	// get the current active tab
	let [tab] = await chrome.tabs.query({active:true, currentWindow: true});
	
	if(tab.url?.startsWith("chrome://")) return undefined;
	
	// Execute script to parse content on pageX
	chrome.scripting.executeScript ({
		target: {tabId : tab.id},
		func: scrapetextFromPage,
	});
});

// function to scrape text from page
function scrapetextFromPage() {
	const parser = new DOMParser();
	let innerHTMLString = parser.parseFromString(document.body.innerHTML, "text/html")
		.documentElement.textContent;
	//console.log(innerHTMLString);
	
	// RegEx to parse text from html code
	//const textRegEx = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
	
	// parse text from the html of the page
	//let htmlText = document.body.innerHTML.match(textRegEx);
	//console.log(htmlText);

	// send text to popup
	//chrome.runtime.sendMessage({htmlText});
	chrome.runtime.sendMessage({innerHTMLString}, (response) => {console.log(response);});
}
