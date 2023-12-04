# CS410 Course Project: Intelligent Browsing

Webpage Summarization Tool

Tim Crosling (tgc3), Avi Nayak (anayak5), Shrishti Sharma (srishti9), Deepthi Abraham (deepthi7)

**Instructions:**

There are two steps to run the project

**Step 1: Run the Flask Python server:**
(a) Ensure you have the right python libraries:
         pip install flask spacy numpy openai


(b) Go to the ‘Server’ folder

(c) Run the python Server:
         python Server/textAnalyticsServer.py
		 
(d) The server will prompt you to enter the openAI private key (note - it usually asks for this twice)
		Cut and paste the key from the first page of the pdf "CS410 Project Final Report.pdf"

(e) Note the Server localhost address and port (should be 127.0.0.1:5000)

**Step 2: Load the extender into Chrome:**
(a) Open Chrome Browser

(b) Enter chrome://extensions/ in the address bar

(c) Toggle 'Developer Mode' to ON at the top right of the page

(d) Click 'Load Unpacked'

(e) Navigate to the directory containing the project and select the ‘ChromeExtension’ folder

(f) Browse to any webpage and toggle the side panel to the right of the plugin 

**Select "Intelligent Browser Plugin" from the drop down box at the top of the side panel to load the extension**

Once the extension has been loaded and the server is running, simply browse to any non-Chrome website (with a http address) and click the ‘Get Page Summary Now’ button

The tool may take a few seconds for the server to run the analytics script, but will return with results (worst case within 10 seconds).
