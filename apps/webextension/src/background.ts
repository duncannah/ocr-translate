chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: `start`,
		title: `Start OCR-Translate`,
		contexts: [`page`],
	});
});

const injectContentScript = (tabId: number) => {
	chrome.scripting.executeScript({
		target: { tabId: tabId, allFrames: false },
		files: [`content-script.js`],
	});

	chrome.scripting.insertCSS({
		target: { tabId: tabId, allFrames: false },
		files: [`content-script.css`],
	});
};

chrome.contextMenus.onClicked.addListener((_, tab) => injectContentScript(tab?.id ?? 0));

chrome.action.onClicked.addListener((tab) => injectContentScript(tab.id ?? 0));

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	chrome.tabs.captureVisibleTab().then((dataURI) => {
		sendResponse({ dataURI });
	});

	console.log(sender.tab ? `from a content script:` + sender.tab.url : `from the extension`);
	return true;
});
