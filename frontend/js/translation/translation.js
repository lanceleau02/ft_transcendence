export function translation() {
	// Get all elements with the class 'lang-item'
	const langItems = document.querySelectorAll('.lang-item');

	// Loop through each lang-item element and attach a click event listener
	const langAct = document.querySelector('.active-lang').id;
	if (translations[langAct]) {
		// Loop through each element in translations[lang]
		let count = 0; // Counter for skipped elements
		for (const key in translations[langAct]) {
			if (translations[langAct].hasOwnProperty(key)) {
				// Skip the first three elements
				if (count < 3) {
					count++;
					continue;
				}
				const element = document.querySelectorAll(`.${key}`);
				if (element) {
					element.forEach(elem => {
						elem.textContent = translations[langAct][key];
					})
				}
			}
		}
	}

	langItems.forEach(langItem => {
		langItem.addEventListener('click', () => {
			const lang = langItem.getAttribute("id");
			if (translations[lang]) {
				// Loop through each element in translations[lang]
				let count = 0; // Counter for skipped elements
				for (const key in translations[lang]) {
					if (translations[lang].hasOwnProperty(key)) {
						// Skip the first three elements
						if (count < 3) {
							count++;
							continue;
						}
						const element = document.querySelectorAll(`.${key}`);
						if (element) {
							element.forEach(elem => {
								elem.textContent = translations[lang][key];
							})
						}
					}
				}
			}
		});
	});
}

const translations = {
	en: {
		english: "English",
		french: "French",
		spanish: "Spanish",
		welcome: "Welcome to the Batpong!",
		game_mode: "Select the game mode of the Pong you want to play.",
		ai_opponent: "AI Opponent",
		tournament: "Tournament",
		play: "Let's play!",
		select_map: "Select the map:",
		default: "Default",
		batcave: "Batcave",
		arkham_asylum: "Arkham Asylum",
		wayne_manor: "Wayne Manor",
		players_customization: "Players customization:",
		add_player: "Add player",
		remove_player: "Remove player",
		player: "Player ",
		color: " color:",
		player1alias: "Player 1 alias:",
		player1color: "Player 1 color:",
		player2alias: "Player 2 alias:",
		player2color: "Player 2 color:",
		blue: "Blue",
		red: "Red",
		green: "Green",
		yellow: "Yellow",
		purple: "Purple",
		tournament_name: "TOURNAMENT NAME",
		player_stats: "PLAYER STATS",
		played_games: "PLAYED GAMES:",
		win_ratio: "WIN RATIO:",
		match_history: "MATCH HISTORY",
		no_match_history: "No match history.",
		victory: "VICTORY",
		defeat: "DEFEAT",
		graphic_view: "GRAPHIC VIEW",
		not_enough_data: "Not enough data.",
		victories_defeats_ratio: "Victories / Defeats Ratio",
		scored_points_history: "Scored Points History",
		username: "USERNAME",
		change_username: "CHANGE USERNAME...",
		current_username: "Your current username is ",
		new_username: "New username",
		update_button: "Update",
		email_address: "EMAIL ADDRESS",
		password: "PASSWORD",
		change_password: "CHANGE PASSWORD...",
		id_old_password: "Current password",
		id_new_password1: "New password",
		id_new_password2: "Confirm new password",
		profile_pic: "PROFILE PIC",
		change_profile_pic: "CHANGE PROFILE PIC...",
		id_avatar: "Select an image:",
		friends_list: "FRIENDS LIST",
		no_friends: "No friends yet.",
		all_users: "ALL USERS",
		no_user: "No user.",
		friend_requests: "FRIEND REQUESTS",
		no_friend_request: "No friend request.",
		id_username: "Username",
		id_password: "Password",
		sign_in: "Sign in",
		sign_in_42: "Sign in with 42",
		not_a_member: "Not a member yet?",
		sign_up_now: "Sign up now!",
		sign_up: "Sign up",
		sign_out: "Sign out"
	},
	fr: {
		english: "Anglais",
		french: "Français",
		spanish: "Espagnol",
		welcome: "Bienvenue sur le Batpong!",
		game_mode: "Sélectionnez le mode de jeu auquel vous voulez jouer.",
		ai_opponent: "Adversaire IA",
		tournament: "Tournoi",
		play: "Jouer !",
		select_map: "Sélectionnez la map:",
		default: "Par défaut",
		batcave: "Batcave",
		arkham_asylum: "Asile Arkham",
		wayne_manor: "Manoir Wayne",
		players_customization: "Personnalisation des joueurs:",
		add_player: "Ajouter un joueur",
		remove_player: "Enlever un joueur",
		player: "Joueur ",
		color: " couleur:",
		player1alias: "Alias joueur 1:",
		player1color: "Joueur 1 couleur:",
		player2alias: "Alias joueur 2:",
		player2color: "Joueur 2 couleur:",
		blue: "Bleu",
		red: "Rouge",
		green: "Vert",
		yellow: "Jaune",
		purple: "Violet",
		tournament_name: "NOM DE TOURNOI",
		player_stats: "STATS DU JOUEUR",
		played_games: "PARTIES JOUÉES:",
		win_ratio: "RATIO DE VICTOIRE:",
		match_history: "HISTORIQUE DES PARTIES",
		no_match_history: "Pas d'historique de match.",
		victory: "VICTOIRE",
		defeat: "DÉFAITE",
		graphic_view: "VUE GRAPHIQUE",
		not_enough_data: "Pas assez de données.",
		victories_defeats_ratio: "Ratio Victoires / Défaites",
		scored_points_history: "Historique des points marqués",
		username: "PSEUDO",
		change_username: "CHANGER LE PSEUDO...",
		current_username: "Ton pseudo actuel est ",
		new_username: "Nouveau pseudo",
		update_button: "Mettre à jour",
		email_address: "ADRESSE MAIL",
		password: "MOT DE PASSE",
		change_password: "CHANGER LE MOT DE PASSE...",
		id_old_password: "Mot de passe actuel",
		id_new_password1: "Nouveau mot de passe",
		id_new_password2: "Confirmer le nouveau mot de passe",
		profile_pic: "PHOTO DE PROFIL",
		change_profile_pic: "CHANGER LA PHOTO DE PROFIL...",
		id_avatar: "Sélectionner une image :",
		friends_list: "LISTE D'AMIS",
		no_friends: "Pas encore d'amis.",
		all_users: "TOUS LES UTILISATEURS",
		no_user: "Aucun utilisateur.",
		friend_requests: "REQUÊTES D'AMI",
		no_friend_request: "Aucune requête d'ami.",
		id_username: "Pseudo",
		id_password: "Mot de passe",
		sign_in: "Se connecter",
		sign_in_42: "Se connecter avec 42",
		not_a_member: "Pas encore membre ?",
		sign_up_now: "Créer un compte.",
		sign_up: "S'enregistrer",
		sign_out: "Se déconnecter"
	},
	es: {
		english: "Inglés",
		french: "Francés",
		spanish: "Español",
		welcome: "¡Bienvenido a Batpong!",
		game_mode: "Seleccione el modo de juego al que quiere jugar.",
		ai_opponent: "Oponente IA",
		tournament: "Torneo",
		play: "¡Jugar!",
		select_map: "Seleccione el mapa:",
		default: "Por defecto",
		batcave: "Batcueva",
		arkham_asylum: "Asilo Arkham",
		wayne_manor: "Mansión Wayne",
		players_customization: "Personalización de los jugadores:",
		add_player: "Añadir un jugador",
		remove_player: "Quitar un jugador",
		player: "Jugador ",
		color: " color:",
		player1alias: "Jugador 1 alias:",
		player1color: "Jugador 1 color:",
		player2alias: "Jugador 2 alias:",
		player2color: "Jugador 2 color:",
		blue: "Azul",
		red: "Rojo",
		green: "Verde",
		yellow: "Amarillo",
		purple: "Violeta",
		tournament_name: "NOMBRE DEL TORNEO",
		player_stats: "ESTADÍSTICAS DEL JUGADOR",
		played_games: "JUEGOS JUGADOS:",
		win_ratio: "RATIO DE VICTORIA:",
		match_history: "HISTORIAL DE PARTIDOS",
		no_match_history: "No hay historial de partidos.",
		victory: "VICTORIA",
		defeat: "DERROTA",
		graphic_view: "VISTA GRÁFICA",
		not_enough_data: "No hay datos suficientes.",
		victories_defeats_ratio: "Ratio Victorias / Derrotas",
		scored_points_history: "Historial de puntos marcados",
		username: "NOMBRE DE USUARIO",
		change_username: "CAMBIAR NOMBRE DE USUARIO...",
		current_username: "Tu nombre de usuario actual es ",
		new_username: "Nuevo nombre de usuario",
		update_button: "Actualizar",
		email_address: "CORREO ELECTRÓNICO",
		password: "CONTRASEÑA",
		change_password: "CAMBIAR CONTRASEÑA...",
		id_old_password: "Contraseña actual",
		id_new_password1: "Nueva contraseña",
		id_new_password2: "Confirmar nueva contraseña",
		profile_pic: "FOTO DE PERFIL",
		change_profile_pic: "CAMBIAR FOTO DE PERFIL...",
		id_avatar: "Seleccione una imagen:",
		friends_list: "LISTA DE AMIGOS",
		no_friends: "Aún no tienes amigos.",
		all_users: "TODOS LOS USUARIOS",
		no_user: "Ningún usuario.",
		friend_requests: "SOLICITUDES DE AMIGO",
		no_friend_request: "No hay solicitud de amistad.",
		id_username: "Nombre de usuario",
		id_password: "Contraseña",
		sign_in: "Iniciar sesión",
		sign_in_42: "Iniciar sesión con 42",
		not_a_member: "¿Todavía no eres miembro?",
		sign_up_now: "¡Regístrate ahora!",
		sign_up: "Registrarse",
		sign_out: "Cerrar sesión"
	}
};
