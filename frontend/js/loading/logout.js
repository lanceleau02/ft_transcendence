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

export async function checklogout() {
    try {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        var csrfTokenElement = document.querySelector('[name="csrfmiddlewaretoken"]');
        if (csrfTokenElement) {
            myHeaders.append('X-CSRFToken', csrfTokenElement.value);
        }
        const response = await fetch(document.location.origin + '/check-logout/', {
            method: 'GET',
            headers: myHeaders
        });
    
        if (!response.ok) {
            throw new Error('Failed to submit form');
        }
    
        const data = await response.json();
        console.log(data.formuser)
        if (data.formuser) {
            console.log('checklogout is yesss');
            logout();
        } else {
            console.log('checklogout is nooooo');
        }
    } catch (error) {
        console.error('Error logout user in checklogout:', error);
    }
}
