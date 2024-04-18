import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(router) {
        super();
        this.setTitle("Batprofile");
        this.router = router;
    }

    async getHtml() {
        // Fetch the HTML content from a separate file
        const response = await fetch(document.location.origin + "/batprofile/?Valid=true");

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
            const response = await fetch(document.location.origin + '/batprofile/?Valid=true', {
                method: 'POST',
                body: formData
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
    
            const data = await response.json();
			
            if (data.formUsername) {
                const newUsername = data.username;
                const currentUsername = document.getElementById('currentUsername');
                const username = document.getElementById('username');
                currentUsername.innerHTML = '<div id="currentUsername"><b>' + newUsername + '</b>.</div>';
                username.textContent = newUsername;
            } else if (data.formPassword) {
                window.location.href = document.location.origin + '/batpong/';
            } else if (data.formAvatar) {
                const newAvatar = data.avatar;
                const avatarNavbar = document.getElementById('avatarNavbar');
                const avatarBatprofile = document.getElementById('avatarBatprofile');
                avatarNavbar.src = newAvatar;
                avatarBatprofile.src = newAvatar;
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }

    async sendFriendRequest(userID) {
		try {
			var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');
			myHeaders.append('X-CSRFToken', document.getElementsByName('csrfmiddlewaretoken')[0].value);
			const response = await fetch(document.location.origin + '/send_friend_request/' + userID + '/', {
				method: 'POST',
				headers: myHeaders
			});
	
			if (!response.ok) {
				throw new Error('Failed to send friend request');
			}
	
			const data = await response.json();
	
			if (data.success) {
                
			}
		} catch (error) {
			console.error('Error sending friend request:', error);
		}
	}

    async acceptFriendRequest(requestID) {
        try {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('X-CSRFToken', document.getElementsByName('csrfmiddlewaretoken')[0].value);
            const response = await fetch(document.location.origin + '/accept_friend_request/' + requestID + '/', {
                method: 'POST',
                headers: myHeaders
            });
    
            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }
    
            const data = await response.json();
    
            if (data.success) {
    
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    }

    async declineFriendRequest(requestID) {
        try {
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('X-CSRFToken', document.getElementsByName('csrfmiddlewaretoken')[0].value);
            const response = await fetch(document.location.origin + '/decline_friend_request/' + requestID + '/', {
                method: 'POST',
                headers: myHeaders
            });
    
            if (!response.ok) {
                throw new Error('Failed to accept friend request');
            }
    
            const data = await response.json();
    
            if (data.success) {
    
            }
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    }

    async refreshFriendRequests() {
        try {
            const modals = document.querySelectorAll('.modal.show');
            if (modals.length > 0) {
                return;
            }

            const response = await fetch(document.location.origin + '/batprofile/?Valid=true', {
                method: 'GET',
                headers: {
                    'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to refresh friend requests');
            }
    
            const html = await response.text();
            const parser = new DOMParser();
            const htmlDocument = parser.parseFromString(html, 'text/html');

            const friendRequest = htmlDocument.querySelector('.requests');
            const friendRequestBis = document.querySelector('.requests');

            const newUser = htmlDocument.querySelector('.users');
            const newUserBis = document.querySelector('.users');

            const newFriend = htmlDocument.querySelector('.friends');
            const newFriendBis = document.querySelector('.friends');

            if (friendRequest != friendRequestBis || newUser != newUserBis || newFriend != newFriendBis) {
                history.pushState(null, null, document.location.origin + '/batprofile/');
			    await this.router();
            }
        } catch (error) {
            console.error('Error refreshing friend requests:', error);
        }
    }

    async startAutoRefresh() {
        setInterval(async () => {
            await this.refreshFriendRequests();
        }, 1000);
    }

    async onRender() {
        await this.startAutoRefresh();
    }
}
