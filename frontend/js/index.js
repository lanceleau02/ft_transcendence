import Batpong from "./views/Batpong.js";
import Batcave from "./views/Batcave.js";
import Batprofile from "./views/Batprofile.js";
import Signin from "./views/Signin.js";
import Signup from "./views/Signup.js";
import { Translate } from "./translation/translate.js"

const navigateTo = url => {
	history.pushState(null, null, url);
	router();
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
	//const response = await view.getHtml();
	document.querySelector("#app").innerHTML = await view.getHtml();
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

function translate(lng, tagAttr) {
	var translate = new Translate();
	translate.init(tagAttr, lng);
	translate.process();
	if (lng == 'en') {
		$("#enTranslator").css('color', '#f4623a');
		$("#frTranslator").css('color', '#f4623a');
		$("#esTranslator").css('color', '#f4623a');
	} else if (lng == 'fr') {
		$("#frTranslator").css('color', '#f4623a');
		$("#enTranslator").css('color', '#f4623a');
		$("#esTranslator").css('color', '#f4623a');
	} else if (lng == 'es') {
		$("#esTranslator").css('color', '#f4623a');
		$("#enTranslator").css('color', '#f4623a');
		$("#frTranslator").css('color', '#f4623a');
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Get all elements with the class 'lang-item'
	const langItems = document.querySelectorAll('.lang-item');

	// Loop through each lang-item element and attach a click event listener
	langItems.forEach(langItem => {
		langItem.addEventListener('click', () => {
			// Remove all "active-lang" classes
			langItems.forEach(langItem => { langItem.classList.remove("active-lang");});

			// Add the correct language
			langItem.classList.add("active-lang");
			document.querySelector('#selectedImg').src = langItem.querySelector('img')?.src;

			// Select the correct language
			if (langItem.id === 'lang-en') {
				translate('en', 'lng-tag');
			} else if (langItem.id === 'lang-fr') {
				translate('fr', 'lng-tag');
			} else if (langItem.id === 'lang-es') {
				translate('es', 'lng-tag');
			}
		});
	});
});
