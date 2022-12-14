import React from "react";
import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import App from "./interface/app";

(async () => {
	if (document.getElementById(`__OCRTRANSLATE__`)) return;

	const el = document.createElement(`div`);
	el.id = `__OCRTRANSLATE__`;
	const shadowRoot = el.attachShadow({ mode: `open` });

	shadowRoot.innerHTML = `<link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL(`content-script.css`)}"></link><div id='root'></div>`;

	document.body.append(el);

	const rootEl = shadowRoot.getElementById(`root`);

	if (rootEl) {
		const root = ReactDOM.createRoot(rootEl);

		root.render(React.createElement(StrictMode, {}, React.createElement(App)));

		setTimeout(() => shadowRoot.querySelectorAll(`style`).forEach((el) => el instanceof HTMLStyleElement && (el.disabled = true)), 500);
	}
})();
