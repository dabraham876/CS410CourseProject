from flask import Flask, jsonify, request

import requests
import spacy
import numpy as np

import sys

from bs4 import BeautifulSoup

from openai import OpenAI

api_key = ""

# Main function to take the client-side request for analysis of a URL
# Firstly, capture the inner HTML word corpus using BeautifulSoup
# Then load that into SpaCy NER to identify a list of topic entities
# Then count the number of occurrences of each entity in the corpus and use this to order the entity list
# Then select the top 5 entities, and submit a request to ChatGPT for a 2 sentence description
# Form ChatGPT's response into a new HTML summary block
# Send this HTML string back to the client (Chrome Extender)
def analyze_content(request):
    # get the url
    url = request['url']
    
    print ("Received URL: " + url)
    soup = BeautifulSoup(requests.get(url).text, "html.parser")
    text = soup.get_text()
    
    #Load Spacy NER model
    nlp = spacy.load('en_core_web_sm')

    #Extract entities from the text corpus
    doc = nlp(text)

    entities = []
    top = []
    i = 0
    for ent in doc.ents:
        entity = ent.text
        #count the number of occurrences of the entity name in the corpus
        count = text.count(entity)
        label = ent.label_
        
        # Ignore entities of type number
        if (label == "CARDINAL"):
            continue
        #exclude duplicates
        if (entity in entities):
            continue
        top.append ([entity, label, count])
        
        entities.append(entity)
        i += 1

    #Sort the unique entity list by number of occurrences in the corpus
    top.sort(key=lambda top : top[2])
    top = np.flip(top, axis=0)
    
    #Limit the number of topics sent back to the client to a reasonable number
    resultsLimit = 4
    
    #for debugging - list the go-forward topics
    print (top[:resultsLimit])
        
    #set up the ChatGPT session
    client = OpenAI(api_key = api_key)

    results = '<br>'

    #Loop through the top x topics and submit a request to ChatGPT for each topic
    #Then append this to the results string
    for i in range (min(len(top), resultsLimit)):
        searchString = [{"role" : "user", "content" : "Tell me in two short sentences about " + top[i][0]}]

        completion = client.chat.completions.create (
            model="gpt-3.5-turbo",
            messages= searchString
        )
        
        # capture the sentiment toward this topic in the document
        sentimentString = [{"role" : "user", "content" : "what is the setiment toward '" + top[i][0] + "in the following text: '" + text + "'?"}]

        sentiment = client.chat.completions.create (
            model="gpt-3.5-turbo", 
            messages = sentimentString
        )

        #Assemble the results HTML text to send back to the client
        results += "<h3>Topic " + str(i+1) + ". " + top[i][0] + "</h3>"

        #Add sentiment notes in blue
        if ((sentiment.choices[0].message.content).find("neutral") != -1):
            sentimentState = 'Neutral'
            results += "<h4><font color=grey>(" + sentimentState + " sentiment on page)</font></h4>"
        elif ((sentiment.choices[0].message.content).find("positive") != -1):
            sentimentState = "Positive"
            results += "<h4><font color=green>(" + sentimentState + " sentiment on page)</font></h4>"
        elif ((sentiment.choices[0].message.content).find("negative") != -1):
            sentimentState = "Negative"
            results += "<h4> <font color=red>(" + sentimentState + " sentiment on page)</font></h4>"
        else:
            sentimentState = "No Sentiment"
            results += "<h4><font color=grey>(No explicit sentiment on page)</font></h4>"
            
        results += completion.choices[0].message.content + "<br>"
        
    #send back a simple string with the HTML summaries for the client to display
    return results


print ("-----------------------------")
print ("Text Analytics Server Startup")
print ("-----------------------------")
api_key = input("Please paste OpenAI key from project report here:")
        
#Flask setup
app = Flask(__name__)

#bind the python function to the localhost server
@app.route('/invoke_python_function', methods=['POST'])
def invoke_python_function():
    data = request.json
    result = analyze_content(data)
    return jsonify({'result' : result})

#error handling
if __name__ == '__main__':
    app.run(debug=True)

