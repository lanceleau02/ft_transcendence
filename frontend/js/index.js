import Batpong from "./views/Batpong.js";
import Batcave from "./views/Batcave.js";
import Batprofile from "./views/Batprofile.js";
import Signin from "./views/Signin.js";
import Signup from "./views/Signup.js";

const navigateTo = async (url) => {
    history.pushState(null, null, url);
    await router(); // Ensure router is awaited to fully render the new page
};

const router = async () => {
	const routes = [
		{ path: "/", view: Batpong },
		{ path: "/batcave", view: Batcave },
		{ path: "/batprofile", view: Batprofile },
		{ path: "/signin", view: Signin },
		{ path: "/signup", view: Signup },
	];
	
	// Test each route for potential match
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
	await view.executeViewScript();
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});

	router();
});
