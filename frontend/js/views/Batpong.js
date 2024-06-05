import AbstractView from "./AbstractView.js";
import { game } from '../game/game.js'
import { centerAndResizeBoard } from '../game/game_utils.js'

export default class extends AbstractView {
	constructor(router) {
		super();
		this.setTitle("Batpong");
        this.router = router;
	}

	async getHtml() {
		// Fetch the HTML content from a separate file
		const response = await fetch(document.location.origin + "/batpong/?Valid=true");
				
		// Ensure the fetch was successful
		if (!response.ok) {
			throw new Error('Failed to load HTML file');
		}

		// Extract the HTML content from the response
		const html = await response.text();
		return html;
	}

	async onRender() {
        game();
    }

	async getMatchResults(formData) {
		try {
			const myHeaders = new Headers();
			myHeaders.append('X-CSRFToken', document.getElementsByName('csrfmiddlewaretoken')[0].value);
	
			const response = await fetch(document.location.origin + '/batpong/?Valid=true', {
				method: 'POST',
				headers: myHeaders,
				body: formData // Pass formData as the body of the request
			});
	
			if (!response.ok) {
				throw new Error('Failed to submit form');
			}
	
			const data = await response.json();
			console.log(data);
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}
}

window.onresize = function() {
	centerAndResizeBoard(window.innerWidth, window.innerHeight);
}
