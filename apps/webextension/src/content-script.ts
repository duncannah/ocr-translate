import React from "react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import App from "./interface/app";

(async () => {
	if (`__OCRTRANSLATE__` in window) return;

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	window[`__OCRTRANSLATE__`] = true;

	const el = document.createElement(`div`);
	const shadowRoot = el.attachShadow({ mode: `open` });

	shadowRoot.innerHTML = `<link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL(`content-script.css`)}"></link><div id='root'></div>`;

	document.body.append(el);

	chrome.runtime.sendMessage({ greeting: `hello` }, function (response) {
		const img = new Image();
		img.src = response.dataURI;

		document.body.append(img);
	});

	const rootEl = shadowRoot.getElementById(`root`);

	if (rootEl) {
		const root = ReactDOM.createRoot(rootEl);

		root.render(React.createElement(StrictMode, {}, React.createElement(App)));

		setTimeout(() => shadowRoot.querySelectorAll(`style`).forEach((el) => el instanceof HTMLStyleElement && (el.disabled = true)), 500);
	}
})();
