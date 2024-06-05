document.addEventListener('DOMContentLoaded', () => {
    let english = document.querySelector(".english"),
        french = document.querySelector(".french"),
        spanish = document.querySelector(".spanish");

    const langItems = document.querySelectorAll('.lang-item');

    langItems.forEach(langItem => {
        langItem.addEventListener('click', () => {
            langItems.forEach(langItem => {
                langItem.classList.remove("active-lang");
            });

            langItem.classList.add("active-lang");
            document.querySelector('#selectedImg').src = langItem.querySelector('img')?.src;

            if (langItem.getAttribute("id") === 'en') {
                english.innerHTML = '<img class="lang-icon" src="/static/img/english.png"> English';
                french.innerHTML = '<img class="lang-icon" src="/static/img/french.png"> French';
                spanish.innerHTML = '<img class="lang-icon" src="/static/img/spanish.png"> Spanish';
            } else if (langItem.getAttribute("id") === 'fr') {
                english.innerHTML = '<img class="lang-icon" src="/static/img/english.png"> Anglais';
                french.innerHTML = '<img class="lang-icon" src="/static/img/french.png"> Français';
                spanish.innerHTML = '<img class="lang-icon" src="/static/img/spanish.png"> Espagnol';
            } else if (langItem.getAttribute("id") === 'es') {
                english.innerHTML = '<img class="lang-icon" src="/static/img/english.png"> Inglés';
                french.innerHTML = '<img class="lang-icon" src="/static/img/french.png"> Francés';
                spanish.innerHTML = '<img class="lang-icon" src="/static/img/spanish.png"> Español';
            }

            // Send chosen language to sever
            const language = langItem.getAttribute("id");
            fetch('/update_language/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: new URLSearchParams({
                    'language': language
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Language updated successfully');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    });
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

