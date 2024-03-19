document.addEventListener('DOMContentLoaded', () => {
	let english = document.querySelector(".english"),
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
