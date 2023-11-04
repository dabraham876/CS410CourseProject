let mybutton = document.getElementById('clickButton');
let list = document.getElementById('textCaptured');

// Handler to receive text from content script]
chrome.runtime.onMessage.addListener ((request, sender, sendResponse) => {
	//get text and remove { ... } code
	list.innerHTML = "";

	let invertedIndex = {};

	
	//let text = (request.innerHTMLString).replace(/ *{[^)]*\}*/g, "");
	let text = request.innerHTMLString.toLowerCase().replaceAll(/\n/g, " ");

	// lowercase and scrub punctuation
	//text = text.toLowerCase().replaceAll( /[~`’!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, " ")
	
	// remove stop words  
	/*stopwords = [" for ", " a ", " of ", " the ", " and ", " to ", " in "];
	for (word of stopwords) {
		text = text.replaceAll(word, " ")
	}*/

	// Display text in the popup
	if (text == null || text.length == 0) {
		// no text
		list.innerHTML += 'No text found';
	}
	else {
		tokenized_Text = text.split(" ");
		str = new Set (text.split (" "));
		str = [... str].join(" ");
		uniqueWords = str.split(" ");
		//alert(uniqueWords);
		
		/*
		EXPERIMENTAL - CREATE THE INVERTED INDEX
		for (word of uniqueWords) {
			var regExp = new RegExp (" " + word + " ");
			wordCount = (text.match(regExp) || []).length;
			
			invertedIndex[word] = wordCount;
		}
		alert (invertedIndex["4th"]);*/
		
		//print the unique words to the panel
		for (word of uniqueWords) {
			list.innerHTML += word + "<br>";
		}
		
		//unique_words = [... new Set(token)];
		//list.innerHTML += unique_words;
		
		// display text
		//list.innerHTML += text;
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

	// send text to popup
	chrome.runtime.sendMessage({innerHTMLString}, (response) => {console.log(response);});
}

// Tokenize into bag of words model
var makeTokens = function (text) {
	if (text === null) {return []; }
	if (text.length === 0) {return []; }
	
	return text.toLowerCase().replace(/[~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-’]/g, '')
		.split(' ').filter(function (token) { return token.length > 0; });
}

var makeTfVector = function (countVector) {
  let total = sum(countVector);
  return countVector.map(
    function (count) {
      return total === 0 ? 0 : count / total;
    }
  );
};

