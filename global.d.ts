declare global {
	interface HTMLElementEventMap {
		hoverChange: CustomEvent<boolean>;
	}
}
export {};