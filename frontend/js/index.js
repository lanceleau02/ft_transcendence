import Batpong from "./views/Batpong.js";
import Batcave from "./views/Batcave.js";
import Batprofile from "./views/Batprofile.js";
import Signin from "./views/Signin.js";
import Signup from "./views/Signup.js";
import { translation } from "./translation/translation.js";
import { logout } from "./loading/logout.js";

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

	if (match.route.path === "/" || match.route.path === "/batpong/") {
		const viewBatpong = new Batpong(router);
		await viewBatpong.onRender();
	}
};

const viewBatprofile = new Batprofile(router);
await viewBatprofile.onRender();

window.addEventListener("popstate", router);

window.addEventListener("beforeunload", async function(event) {
	try {
		const response = await fetch(document.location.origin + '/unload_user', {
			method: 'GET',
			headers: {
				'X-CSRFToken': document.getElementsByName('csrfmiddlewaretoken')[0].value
			}
		});
		
		if (!response.ok) {
			console.log('Fail to has response for unload activity user');
		}

		const data = await response.json();
		if (data.success) {

		}
	} catch (error) {
		console.error('Fail to call unload user activity:', error);
	}
});
document.addEventListener("DOMContentLoaded", () => {
	
	const otp_callback_42 = document.cookie.includes('otp_callback_42=true');
	if (otp_callback_42) {
		const view = new Signin();
		view.fetchOTPJSON();
	}

	// SPA NAVIGATION
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
			const logoutStatus = document.cookie.includes('logout_status=true');
			if (logoutStatus) {
				logout();
			}
		}
	});

	// FORMS SUBMISSION
	document.body.addEventListener("submit", async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		if (e.target.getAttribute('id') === 'logoutForm') {
			e.target.submit();
		} else if (e.target.getAttribute('id') === 'usernameForm' || e.target.getAttribute('id') === 'passwordForm' || e.target.getAttribute('id') === 'avatarForm') {
			const view = new Batprofile();
			await view.submitForm(formData);
		} else if (e.target.getAttribute('id') === 'signinForm') {
			const view = new Signin();
			await view.submitForm(formData);
		} else if (e.target.getAttribute('id') === 'signupForm') {
			const view = new Signup(router);
			await view.submitForm(formData);
		} else if (e.target.getAttribute('id') === 'signin42apiForm') {
			const view = new Signin();
			await view.submitForm42API(formData);
		} else if (e.target.getAttribute('id') === 'MatchForm') {
			const view = new Batpong();
			await view.getMatchResults(formData);
		} else if (e.target.getAttribute('id') === 'otpEnable') {
			const view = new Batprofile();
			await view.submit2FAForm(formData);
		} else if (e.target.getAttribute('id') === 'otpChecksignin') {
			const view = new Signin();
			await view.submitOtpForm(formData);
		}
	});

	// FRIEND REQUESTS
	document.body.addEventListener("click", async (e) => {
		let switchElement = document.getElementById('Switch2FA');
		if (e.target.getAttribute('id') === 'send-friend-request') {
			e.preventDefault();
			const userID = e.target.getAttribute('user-id');
			const view = new Batprofile();
			await view.sendFriendRequest(userID);
		} else if (e.target.getAttribute('id') === 'accept-friend-request') {
			e.preventDefault();
			const requestID = e.target.getAttribute('request-id');
			const view = new Batprofile();
			await view.acceptFriendRequest(requestID);
		} else if (e.target.getAttribute('id') === 'decline-friend-request') {
			e.preventDefault();
			const requestID = e.target.getAttribute('request-id');
			const view = new Batprofile();
			await view.declineFriendRequest(requestID);
		} else if (e.target.getAttribute('id') === 'Switch2FA') {
			const view = new Batprofile();
			await view.switch2FA(switchElement);
		} else if (e.target.getAttribute('id') === 'open-canvas-profil') {
			e.preventDefault();
			const userID = e.target.getAttribute('user-id');
			const view = new Batprofile();
			await view.loadUserProfile(userID);
		}
	});

	router();
});
