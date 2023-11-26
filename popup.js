let myButton = document.getElementById('clickButton');
let list = document.getElementById('textCaptured');
let pageURL = document.getElementById('urlCaptured');

let searchQuery = null;

if (myButton == null)
	list.innerHTML += "PROBLEMS";

// Dispatch url to google cloud function that will execute NER on the 
// text and return the top 5 entities
// returns {Promise<any>} which is a list of the top 5 entities in the text 
/*async function runQuery (url) {
	const serverURL = 'https://cs410server-y4rorqzjqa-uc.a.run.app' // URL HERE
	const data = {url : url}
	
	const response = await fetch (serverURL, {
		method: 'POST',
		mode: 'cors',
		credentials: 'omit',
		headers: {
			'Access-Control-Allow-Origin' : '*',
			'Content-Type' : 'application/json'
		},
		body : JSON.stringify(data)
	});
	return response.json();
}
*/

// Handler to receive text from content script]
//chrome.runtime.onMessage.addListener ((request, sender, sendResponse) => {
//	let url = request.url;
//	list.innerHTML (url);
	
//	runQuery (url).then (res => {
//		list.innerHTML += "RESPONDED";
//	});
	
	//get text and remove { ... } code
	//list.innerHTML = "";

	//let invertedIndex = {};
	//let text = (request.innerHTMLString).replace(/ *{[^)]*\}*/g, "");
	//let text = request.innerHTMLString.toLowerCase().replaceAll(/\n/g, " ");

	// lowercase and scrub punctuation
	//text = text.toLowerCase().replaceAll( /[~`’!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=-]/g, " ")
	// remove stop words  
	//stopwords = [" for ", " a ", " of ", " the ", " and ", " to ", " in "];
	//for (word of stopwords) {
	//	text = text.replaceAll(word, " ")
	//}

	// Display text in the popup
	//if (text == null || text.length == 0) {
		// no text
	//	list.innerHTML += 'No text found';
	//}
	//else {
	//	tokenized_Text = text.split(" ");
	//	str = new Set (text.split (" "));
	//	str = [... str].join(" ");
		//list.innerHTML += str
		
	//	uniqueWords = str.split(" ");		
		
		//Create the inverted index
	//	for (word of uniqueWords) {
	//		if (word != "") {				
	//			wordCount = text.split(" " + word + " ").length - 1;
	//			
	//			invertedIndex[word] = wordCount
	//			
				//print the unique words and count to the panel
	//			list.innerHTML += word + " " + invertedIndex[word] + "<br>";
	//		}
	//	}	
	//	
	//}
	
//	sendResponse({status : true});

//})

myButton.addEventListener ('click', async () => {
	list.innerHTML = "<br>Processing ... please wait a few seconds ...";

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

/*
// Button's click event listener
mybutton.addEventListener('click', async () => { 
	// get the current active tab
	let [tab] = await chrome.tabs.query({active:true, currentWindow: true});
	
	if(tab.url?.startsWith("chrome://")) return undefined;
	
	//let url = tab.url;
	//chrome.runtime.sendMessage({url}, (response) => {console.log(response);});
	
	pageURL.innerHTML = tab.url;
	list.innerHTML += "A ";
    fetch('/invoke_python_function')
        .then(response => response.text())
        .then(result => {
            document.getElementById('result').innerText = result;
			list.innerHTML +="B1 "
			list.innerHTML += result

        })
		.catch((err) => {
			console.log(err.message);
			list.innerHTML +="B2 "
		});	
	list.innerHTML += "C ";

});
*/