export async function logout() {
	try {
		var myHeaders = new Headers();
	    myHeaders.append('Content-Type', 'application/json');
		var csrfTokenElement = document.querySelector('[name="csrfmiddlewaretoken"]');
    	if (csrfTokenElement) {
        	myHeaders.append('X-CSRFToken', csrfTokenElement.value);
		}
		const response = await fetch(document.location.origin + '/logout/', {
			method: 'POST',
			headers: myHeaders
		});

		if (!response.ok) {
			throw new Error('Failed to load HTML /logout');
		}
		location.reload();
	}
	catch (error) {
		console.error('Error logout user:', error);
	}
}
