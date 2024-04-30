export async function wait2get(id) {
	// Try to get the element a first time
	var element = document.getElementById(id);

	// Loop while it's not loaded
	while (element == null) {
		await new Promise(r => setTimeout(r, 100));
		element = document.getElementById(id);
	}
	return element;
}
