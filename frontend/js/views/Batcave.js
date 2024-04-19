import AbstractView from "./AbstractView.js";
import { pieChart } from "../visualization/pie.js";
import { curveGraph } from "../visualization/curve.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Batcave");
	}
	
	async getHtml() {
		// Fetch the HTML content from a separate file
		const response = await fetch(document.location.origin + "/batcave/?Valid=true");
				
		// Ensure the fetch was successful
		if (!response.ok) {
			throw new Error('Failed to load HTML file');
		}

		// Extract the HTML content from the response
		const html = await response.text();

		setTimeout(pieChart, 0);
		setTimeout(curveGraph, 0);

		return html;
	}
}
