import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
	constructor() {
		super();
		this.setTitle("Signin");
	}

	async getHtml() {
		// Fetch the HTML content from a separate file
		const response = await fetch(document.location.origin + "/signin/?Valid=true");
		
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
			const response = await fetch(document.location.origin + '/signin/?Valid=true', {
				method: 'POST',
				body: formData
			});
	
			if (!response.ok) {
				throw new Error('Failed to submit form');
			}
	
			const data = await response.json();
	
			if (data.loginForm) {
				window.location.href = document.location.origin + '/batpong/';
			} 
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}

	/* WORK IN PROGRESS
	async submitForm42API(formData) {
		try {
			const response = await fetch(document.location.origin + '/signin/?Valid=true', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Failed to get authorization URL');
			}

			const data = await response.json();
			if (data.authorization_url) {
				window.location.href = data.authorization_url;
			}
			else if (data.loginForm) {
				window.location.href = document.location.origin + '/batpong/';
			}
		}
		catch (error) {
			console.error('Error getting authorization URL:', error);
		}
	} */
}