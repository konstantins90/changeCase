chrome.contextMenus.create({
	"title": "Uppercase",
	"contexts": ["selection"],
	"onclick" : toUppercase
});

chrome.contextMenus.create({
	"title": "Lowercase",
	"contexts": ["selection"],
	"onclick" : toLowercase
});

chrome.contextMenus.create({
	"title": "Convert",
	"contexts": ["selection"],
	"onclick" : convertCase
});

chrome.contextMenus.create({
	"title": "Slug",
	"contexts": ["selection"],
	"onclick" : toSlug
});

chrome.commands.onCommand.addListener(function(command) {
  console.log('Command:', command);

  chrome.tabs.query({
    active: true,
    windowId: chrome.windows.WINDOW_ID_CURRENT
}, function(array_of_Tabs) {
    var tab = array_of_Tabs[0];
    switch (command) {
    	case "uppercase":
		    toUppercase("", tab);
		    break;
    	case "lowercase":
		    toLowercase("", tab);
		    break;
    	case "convertcase":
		    convertCase("", tab);
		    break;
    }
});
});

function toUppercase(info, tab) { chrome.tabs.sendMessage(tab.id, { "type" : "onCaseItCM", "tocase" : "uppercase" }); }

function toLowercase(info, tab) { chrome.tabs.sendMessage(tab.id, { "type" : "onCaseItCM", "tocase" : "lowercase" }); }

function convertCase(info, tab) { chrome.tabs.sendMessage(tab.id, { "type" : "onCaseItCM", "tocase" : "convert" }); }

function toSlug(info, tab) { chrome.tabs.sendMessage(tab.id, { "type" : "onCaseItCM", "tocase" : "slug" }); }
