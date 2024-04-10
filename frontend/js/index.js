import Batpong from "./views/Batpong.js";
import Batcave from "./views/Batcave.js";
import Batprofile from "./views/Batprofile.js";
import Signin from "./views/Signin.js";
import Signup from "./views/Signup.js";
import { translation } from "./translation/translation.js";

const navigateTo = async (url) => {
    history.pushState(null, null, url);
    await router(); // Ensure router is awaited to fully render the new page
};

const router = async () => {
	const routes = [
		{ path: "/", view: Batpong },
		{ path: "/batcave/", view: Batcave },
		{ path: "/batprofile/", view: Batprofile },
		{ path: "/signin/", view: Signin },
		{ path: "/signup/", view: Signup },
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
	translation();
};

window.addEventListener("popstate", router);

/* document.addEventListener("DOMContentLoaded", () => {
	document.body.addEventListener("click", e => {
		if (e.target.matches("[data-link]")) {
			e.preventDefault();
			navigateTo(e.target.href);
		}
	});

	router();
}); */

// Ajout d'une fonction pour soumettre le formulaire via AJAX dans index.js
const submitForm = async (formData) => {
    try {
        const response = await fetch('/batprofile/', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Failed to submit form');
        }

        const data = await response.json();

        // Mettez à jour l'interface utilisateur en fonction de la réponse
        if (data.success) {
            // Par exemple, affichez un message de succès ou mettez à jour une partie de la page
            // document.getElementById('successMessage').textContent = 'Form submitted successfully';
            // Rediriger vers une autre page si nécessaire
            // window.location.href = '/path/to/success/page';
			const updatedContentElement = document.getElementById('username');
            // updatedContentElement.innerHTML = data.updatedContent; // Supposons que le serveur renvoie le contenu mis à jour
			updatedContentElement.innerHTML = '<div class="name" id="username">{{ user.username }}</div>';
			} else {
            // Gérez les erreurs de validation ou autres
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};

// Modification du gestionnaire d'événements pour soumettre le formulaire via AJAX
document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("submit", async (e) => {
        e.preventDefault(); // Empêcher le comportement de soumission de formulaire par défaut
        const formData = new FormData(e.target);
        await submitForm(formData);
    });

    router();
});
