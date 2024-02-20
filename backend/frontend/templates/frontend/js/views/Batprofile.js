import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Batprofile");
	}

	async getHtml() {
		// Fetch the HTML content from a separate file
		const response = await fetch(document.location.origin + "/batprofile");
		// Ensure the fetch was successful
		if (!response.ok) {
			throw new Error('Failed to load HTML file');
		}

		// Extract the HTML content from the response
		const html = await response.text();
		return html;
	}
}