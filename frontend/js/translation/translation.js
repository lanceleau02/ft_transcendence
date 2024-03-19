document.addEventListener('DOMContentLoaded', () => {
	let lang = document.querySelector(".lang"),
		link = document.querySelector("a"),
		english = document.querySelector(".english"),
		french = document.querySelector(".french"),
		spanish = document.querySelector(".spanish");

	// Get all elements with the class 'lang-item'
	const langItems = document.querySelectorAll('.lang-item');

	// Loop through each lang-item element and attach a click event listener
	langItems.forEach(langItem => {
		langItem.addEventListener('click', () => {
			// Remove all "active-lang" classes
			langItems.forEach(langItem => {
				langItem.classList.remove("active-lang");
			});

			// Add the correct language
			langItem.classList.add("active-lang");
			document.querySelector('#selectedImg').src = langItem.querySelector('img')?.src;

			if (langItem.getAttribute("id") === 'en') {
				english.innerHTML = '<img class="lang-icon" src="static/img/english.png">	English';
				french.innerHTML = '<img class="lang-icon" src="static/img/french.png">	French';
				spanish.innerHTML = '<img class="lang-icon" src="static/img/spanish.png">	Spanish';
			} else if (langItem.getAttribute("id") === 'fr') {
				english.innerHTML = '<img class="lang-icon" src="static/img/english.png">	Anglais';
				french.innerHTML = '<img class="lang-icon" src="static/img/french.png">	Français';
				spanish.innerHTML = '<img class="lang-icon" src="static/img/spanish.png">	Espagnol';
			} else if (langItem.getAttribute("id") === 'es') {
				english.innerHTML = '<img class="lang-icon" src="static/img/english.png">	Inglés';
				french.innerHTML = '<img class="lang-icon" src="static/img/french.png">	Francés';
				spanish.innerHTML = '<img class="lang-icon" src="static/img/spanish.png">	Español';
			}
		});
	});
});

const translations = {
	en: {
		english: "English",
		french: "French",
		spanish: "Spanish",
		tournament_name: "TOURNAMENT NAME",
		player_stats: "PLAYER STATS",
		played_games: "PLAYED GAMES",
		win_ratio: "WIN RATIO",
		match_history: "MATCH HISTORY",
		victory: "VICTORY",
		defeat: "DEFEAT",
		graphic_view: "GRAPHIC VIEW",
		username: "USERNAME",
		change_username: "CHANGE USERNAME...",
		current_username: "Your current username is ",
		update_button: "Update",
		email_address: "EMAIL ADDRESS",
		password: "PASSWORD",
		change_password: "CHANGE PASSWORD...",
		profile_pic: "PROFILE PIC",
		change_profile_pic: "CHANGE PROFILE PIC...",
		friends_list: "FRIENDS LIST",
		no_friends: "No friends yet.",
		add_friend: "ADD A FRIEND",
		search_friend: "Search a friend...",
		sign_in_button: "Sign in",
		not_a_member: "Not a member yet?",
		sign_up_now: "Sign up now!",
		sign_up_button: "Sign up"
	},
	fr: {
		english: "Anglais",
		french: "Français",
		spanish: "Espagnol",
		tournament_name: "NOM DE TOURNOI",
		player_stats: "STATS DU JOUEUR",
		played_games: "PARTIES JOUÉES",
		win_ratio: "RATIO DE VICTOIRE",
		match_history: "HISTORIQUE DES PARTIES",
		victory: "VICTOIRE",
		defeat: "DÉFAITE",
		graphic_view: "VUE GRAPHIQUE",
		username: "PSEUDO",
		change_username: "CHANGER LE PSEUDO...",
		current_username: "Ton pseudo actuel est ",
		update_button: "Mettre à jour",
		email_address: "ADRESSE MAIL",
		password: "MOT DE PASSE",
		change_password: "CHANGER LE MOT DE PASSE...",
		profile_pic: "PHOTO DE PROFIL",
		change_profile_pic: "CHANGER LA PHOTO DE PROFIL...",
		friends_list: "LISTE D'AMIS",
		no_friends: "Pas encore d'amis.",
		add_friend: "AJOUTER UN AMI",
		search_friend: "Chercher un ami...",
		sign_in_button: "Se connecter",
		not_a_member: "Pas encore membre ?",
		sign_up_now: "Créer un compte.",
		sign_up_button: "S'enregistrer"
	},
	es: {
		english: "Inglés",
		french: "Francés",
		spanish: "Español",
		tournament_name: "NOMBRE DEL TORNEO",
		player_stats: "ESTADÍSTICAS DEL JUGADOR",
		played_games: "JUEGOS JUGADOS",
		win_ratio: "RATIO DE VICTORIA",
		match_history: "HISTORIAL DE PARTIDOS",
		victory: "VICTORIA",
		defeat: "DERROTA",
		graphic_view: "VISTA GRÁFICA",
		username: "NOMBRE DE USUARIO",
		change_username: "CAMBIAR NOMBRE DE USUARIO...",
		current_username: "Tu nombre de usuario actual es ",
		update_button: "Actualizar",
		email_address: "DIRECCIÓN DE CORREO ELECTRÓNICO",
		password: "CONTRASEÑA",
		change_password: "CAMBIAR CONTRASEÑA...",
		profile_pic: "FOTO DE PERFIL",
		change_profile_pic: "CAMBIAR FOTO DE PERFIL...",
		friends_list: "LISTA DE AMIGOS",
		no_friends: "Aún no tienes amigos.",
		add_friend: "AGREGAR UN AMIGO",
		search_friend: "Buscar un amigo...",
		sign_in_button: "Iniciar sesión",
		not_a_member: "¿Todavía no eres miembro?",
		sign_up_now: "¡Regístrate ahora!",
		sign_up_button: "Registrarse"
	}
};
