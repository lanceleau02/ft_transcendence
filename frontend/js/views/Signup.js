import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor(router) {
		super();
		this.setTitle("Signup");
		this.router = router;
	}

	async getHtml() {
		// Fetch the HTML content from a separate file
		const response = await fetch(document.location.origin + "/signup/?Valid=true");
		
		// Ensure the fetch was successful
		if (!response.ok) {
			throw new Error('Failed to load HTML file');
		}

		// Extract the HTML content from the response
		const html = await response.text();
		return html;
	}

	async submitForm(formData) {
		try {
			const response = await fetch(document.location.origin + '/signup/?Valid=true', {
				method: 'POST',
				body: formData
			});
	
			if (!response.ok) {
				throw new Error('Failed to submit form');
			}
	
			const data = await response.json();
	
			if (data.signupSuccess) {
				history.pushState(null, null, document.location.origin + '/signin/');
				await this.router();
			} 
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}
}
