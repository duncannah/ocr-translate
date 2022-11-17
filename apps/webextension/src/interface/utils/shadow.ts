export function getShadowRoot(el: HTMLElement): ShadowRoot | null {
	return el.shadowRoot || (el.getRootNode() as ShadowRoot);
}
