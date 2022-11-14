import API from "./api";
import { MessageType, ResponseType } from "./message";

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

chrome.runtime.onMessage.addListener((request, sender, sendResponse: (response: ResponseType) => void) => {
	(async () => {
		switch (request.type) {
			case MessageType.CaptureTabRequest: {
				const dataURI = await chrome.tabs.captureVisibleTab();

				return sendResponse({ type: MessageType.CaptureTabResponse, dataURI });
			}

			case MessageType.doOCRRequest: {
				const text = await API.callPost<string>(`ocr`, { dataURI: request.dataURI });

				return sendResponse({ type: MessageType.doOCRResponse, text });
			}
		}

		throw new Error(`Unknown message type`);
	})().catch((error) => {
		sendResponse({ type: MessageType.Error, error: error.message });
	});

	return true;
});
