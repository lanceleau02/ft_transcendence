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
				if (data.OTPEnabled) {
					const modalElement = document.getElementById('otpCodeModal');
					if (modalElement) {
						const modal = new bootstrap.Modal(modalElement, {backdrop: 'static'});
						modal.show();
					}
				} else {
					window.location.href = document.location.origin + '/batpong/';
				}
			}
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}

	async submitOtpForm(formData) {
		try {
			const response = await fetch(document.location.origin + '/otp_login_check', {
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

	async submitForm42API(formData) {
		try {
			const response1 = await fetch(document.location.origin + '/cursus-and-users', {
				method: 'POST',
				body: formData
			});
	
			if (!response1.ok) {
				throw new Error('Failed to get authorization URL');
			}
			
			const data1 = await response1.json();
			
			if (data1.authorization_url) {
				window.location.href = data1.authorization_url;
			}
		} catch (error) {
			console.error('Error getting authorization URL:', error);
		}
	}

	async fetchOTPJSON() {
		try {
			const response = await fetch('/callback_otp');

			if (!response.ok) {
				throw new Error('API42 OTP rec response fail');
			}

			const data = await response.json();
			
			const modalElement = document.getElementById('otpCodeModal');
			if (modalElement) {
				const modal = new bootstrap.Modal(modalElement, {backdrop: 'static'});
				modal.show();
			}
		} catch (error) {
			console.error('Error getting callback_otp fail', error);
		}
	}
}