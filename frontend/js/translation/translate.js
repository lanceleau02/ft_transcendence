export function Translate() { 
	// Initialization
	this.init = function(attribute, lng) {
		this.attribute = attribute;
		this.lng = lng;	
	}
	// Translate 
	this.process = function() {
		let _self = this;
		var xrhFile = new XMLHttpRequest();
		// Load content data 
		console.log(document.URL)
		xrhFile.open("GET", "languages/" + this.lng + ".json", false);
		xrhFile.onreadystatechange = function () {
			if (xrhFile.readyState === 4) {
				if (xrhFile.status === 200 || xrhFile.status == 0) {
					var LngObject = JSON.parse(xrhFile.responseText);
					var allDom = document.getElementsByTagName("*");
					for (var i = 0; i < allDom.length; i++) {
						var elem = allDom[i];
						var key = elem.getAttribute(_self.attribute);
						if (key != null) {
							elem.innerHTML = LngObject[key];
						}
					}
				}
			}
		}
		xrhFile.send();
	}
}

window.onload = function() {
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
}