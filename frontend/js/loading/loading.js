if (document.querySelector("#app") == null) {
	var actualRoute = document.location.origin + window.location.pathname + window.location.search
	window.location.replace(actualRoute)
}