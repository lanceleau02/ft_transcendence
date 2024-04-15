import Batpong from "./views/Batpong.js";
import Batcave from "./views/Batcave.js";
import Batprofile from "./views/Batprofile.js";
import Signin from "./views/Signin.js";
import Signup from "./views/Signup.js";
import { translation } from "./translation/translation.js";

const navigateTo = async (url) => {
    history.pushState(null, null, url);
    await router();
};

const router = async () => {
	const routes = [
		{ path: "/", view: Batpong },
		{ path: "/batcave/", view: Batcave },
		{ path: "/batprofile/", view: Batprofile },
		{ path: "/signin/", view: Signin },
		{ path: "/signup/", view: Signup },
	];
	
	const potentialMatches = routes.map(route => {
		return {
			route: route,
			isMatch: location.pathname === route.path
		}
	});
	
	let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)
	
	if (!match) {
		match = {
			route: routes[0],
			isMatch: true
		};
	}

	const view = new match.route.view();
	
	document.querySelector("#app").innerHTML = await view.getHtml();
	translation();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});

	document.body.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		if (e.target.getAttribute('id') === 'logoutForm') {
			e.target.submit();
		} else if (e.target.getAttribute('id') === 'usernameForm' || e.target.getAttribute('id') === 'passwordForm' || e.target.getAttribute('id') === 'avatarForm') {
			await submitFormBatprofile(formData);
		} else if (e.target.getAttribute('id') === 'signinForm') {
			await submitFormSignin(formData);
		} else if (e.target.getAttribute('id') === 'signupForm') {
			await submitFormSignup(formData);
		//} else if (e.target.getAttribute('id') === 'signin42apiForm') {
		//	await submitFormSignin42api(formData);
	}
	});

/* 	document.body.addEventListener("click", async (e) => {
		if (e.target.matches("[data-action='send-friend-request']")) {
			e.preventDefault();
			const userID = e.target.dataset.userId;
			const formData = new FormData();
			formData.append('userID', userID);
			await submitForm(formData, document.location.origin + '/send_friend_request/' + userID);
		}
	}); */

	router();
});

const submitFormBatprofile = async (formData) => {
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
};

const submitFormSignin = async (formData) => {
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
};

const submitFormSignup = async (formData) => {
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
			await router();
		} 
	} catch (error) {
		console.error('Error submitting form:', error);
	}
};

/* const submitForm = async (formData) => {
	try {
		const response = await fetch(document.location.origin + '/batprofile/?Valid=true', {
			method: 'POST',
			body: formData
		});

		if (!response.ok) {
			throw new Error('Failed to submit form');
		}

		const data = await response.json();

		if (data.friendRequestSent) {
			history.pushState(null, null, document.location.origin + '/batprofile/');
			await router();
		}
	} catch (error) {
		console.error('Error submitting form:', error);
	}
}; */

/* ne marche pas .. en cours ...
const submitFormSignin42api = async (formData) => {
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
}*/
