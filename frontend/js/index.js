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
	
	// SPA NAVIGATION
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
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
		/* } else if (e.target.getAttribute('id') === 'signin42apiForm') {
			await submitFormSignin42api(formData); */
		}
	});

	// FRIEND REQUESTS
	document.body.addEventListener("click", async (e) => {
		const view = new Batprofile();
		if (e.target.getAttribute('id') === 'send-friend-request') {
			e.preventDefault();
			const userID = e.target.getAttribute('user-id');
			await view.sendFriendRequest(userID);
		} else if (e.target.getAttribute('id') === 'accept-friend-request') {
			e.preventDefault();
			const requestID = e.target.getAttribute('request-id');
			await view.acceptFriendRequest(requestID);
		} else if (e.target.getAttribute('id') === 'decline-friend-request') {
			e.preventDefault();
			const requestID = e.target.getAttribute('request-id');
			await view.declineFriendRequest(requestID);
		}
	});

	router();
});
