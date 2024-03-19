import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Batcave");
	}

	async executeViewScript() {
			let lang = document.querySelector(".lang"),
				link = document.querySelector("a"),
				tournament_name = document.querySelector("h3.tournament_name");
			
			console.log("Tournament name:", tournament_name);
		
			// Get all elements with the class 'lang-item'
			const langItems = document.querySelectorAll('.lang-item');
		
			// Loop through each lang-item element and attach a click event listener
			langItems.forEach(langItem => {
				langItem.addEventListener('click', () => {
		
				});
			});
	}

	async getHtml() {
		// Fetch the HTML content from a separate file
		const response = await fetch(document.location.origin + "/batcave");
		console.log(response)
				
		// Ensure the fetch was successful
		if (!response.ok) {
			throw new Error('Failed to load HTML file');
		}

		// Extract the HTML content from the response
		const html = await response.text();
		return html;
	}

	
}