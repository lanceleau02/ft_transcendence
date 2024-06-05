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
            const offcanvas = document.querySelectorAll('.offcanvas.show');
            if (modals.length > 0 || offcanvas.length > 0 || window.location.href !== document.location.origin + '/batprofile/') {
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

    async switch2FA(switchElement) {
        try {
            let switchState = switchElement.checked;
            const url = switchState? '/on_model_2fa/' : '/off_model_2fa/';
            
            var myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('X-CSRFToken', document.getElementsByName('csrfmiddlewaretoken')[0].value);

            const response = await fetch(document.location.origin + url, {
                method: 'POST',
                headers: myHeaders
            });

            if (!response.ok) {
                throw new Error('Failed to switch 2fa');
            }
            
            const data = await response.json();
            
            if (!data.success) {
                console.log('Failed to switch 2FA user');
            }
            if (switchState) {
                const modal = new bootstrap.Modal(document.getElementById('otpModal'));
 	        	modal.show();

                const qrCodeImage = data.qr_code;
                document.getElementById('qrcode2FA').src = `data:image/png;base64,${qrCodeImage}`;
                
            }
            
        } catch (error) {
            console.error('Error display on/off 2fa', error);
        }
    }

    async submit2FAForm(formData) {
		try {
			const response = await fetch(document.location.origin + '/verify_2fa', {
				method: 'POST',
				body: formData
			});
	
			if (!response.ok) {
				throw new Error('Failed to submit form');
			}
			
			const data = await response.json();

			if (data.success) {
                const modal = bootstrap.Modal.getInstance(document.getElementById('otpModal'));
 	        	modal.hide();
			}
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	}

    async checkActivity() {
        try {
            const response = await fetch(document.location.origin + '/check_activity', {
                method: 'GET',
                headers: {
                    'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value
                }
            });

            if (!response.ok) {
                throw new Error('Failed to check activity for courant user');
            }

            const data = await response.json()

            if (data.statut === 'online') {
                
            }
        } catch (error) {
            console.error('Error check activity:', error);
        }
    }

    async startAutoRefresh() {
        setInterval(async () => {
            await this.refreshFriendRequests();
            await this.checkActivity();
        }, 10000);
    }

    async onRender() {
        await this.startAutoRefresh();
    }

    async loadUserProfile(userID) {
        try {
            var myHeaders = new Headers();
			myHeaders.append('Content-Type', 'application/json');
			myHeaders.append('X-CSRFToken', document.getElementsByName('csrfmiddlewaretoken')[0].value);
            const response = await fetch (document.location.origin + '/display_user_profil/' + userID + '/', {
				method: 'GET',
				headers: myHeaders
			});      
            if (!response.ok) {
				throw new Error('Failed to submit form');
			}
            
            const data = await response.json();
            
            if (data) {
                const offcanvasBody = document.querySelector('.offcanvas-body');
                const friendsData = data.friends;

                const summaryElement = document.createElement('summary');
                summaryElement.textContent = 'Friend List';

                const friendsDetails = document.createElement('details');
                friendsDetails.appendChild(summaryElement);
                
                function createFriendListItem(friend) {
                    const listItem = document.createElement('li');
                    listItem.className = 'friend-list-item';
                    listItem.innerHTML = `
                        <span>${friend.username}</span>
                        <img src="${friend.avatar_url}" alt="Friend Avatar" class="friend-avatar">
                    `;
                    return listItem;
                }
                
                friendsData.forEach(friend => {
                    const friendItem = createFriendListItem(friend);
                    friendsDetails.appendChild(friendItem);
                });

                function generateSummaryHtml(match) {
                    const loser = match.loser? match.loser : match.rival;
                    const winner = match.winner? match.winner : match.rival;
                    if (winner === match.rival)
                        return `<br>${loser} vs ${winner}: ${match.score_l}-${match.score_w}  :${new Date(match.date).toLocaleDateString()}`;
                    else
                        return `<br>${winner} vs ${loser}: ${match.score}  :${new Date(match.date).toLocaleDateString()}`;
                }
                const summaryElements = data.stat3.map(generateSummaryHtml);
                const joinedHtml = summaryElements.join('');

                offcanvasBody.innerHTML = `
                <div id="dynamicContent" class="profile-card">
                    <div class="user-info">
                        <p><strong>Name:</strong> ${data.name}</p>
                        <div class="avatar-profil-container">
                            <img src="${data.avatar}" alt="User Avatar" class="avatar-profil">
                        </div>
                    </div>
                    <p><strong>Status:</strong> ${data.is_online? 'Online' : 'Offline'}</p>
                    <div class="row">
                        ${friendsDetails.outerHTML}
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col">
                            <h5>Statistics</h5>
                            <ul>
                                <li class="stat-item win-rate"><strong>Win Rate:</strong> ${data.stat1}</li>
                                <li class="stat-item total-matches"><strong>Total matches played:</strong> ${data.stat2}</li>
                                <li class="stat-item">
                                    <details>
                                        <summary><strong>Last 3 matches:</strong></summary>
                                        <ul>${joinedHtml}</ul>
                                    </details>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>`;
            }
            
            const canvas = new bootstrap.Offcanvas(document.getElementById('UserDetails'));
            canvas.show();
        
        } catch (error) {
            console.error('Error rec profile user:', error);
        }
    }
}
