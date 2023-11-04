
/*chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));
*/

/*chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
	if (!tab.url) return;
	
	await chrome.sidePanel.setOptions({
		tabId,
		path: "popup.html",
		enabled: true
	});
});*/