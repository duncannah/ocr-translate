import React from "react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import App from "./app/app";

(() => {
	if (`__OCRTRANSLATE__` in window) return;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	window[`__OCRTRANSLATE__`] = true;

	const rootEl = document.createElement(`div`);
	rootEl.id = `__OCRTRANSLATE__`;
	document.body.append(rootEl);

	chrome.runtime.sendMessage({ greeting: `hello` }, function (response) {
		const img = new Image();
		img.src = response.dataURI;

		document.body.append(img);
	});

	const root = ReactDOM.createRoot(rootEl);

	root.render(React.createElement(StrictMode, {}, React.createElement(App)));
})();
