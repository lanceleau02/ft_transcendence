export class Player {
	constructor(alias, color, is_auth) {
		if (alias.length > 12)
			this.alias = alias.substr(0, 9) + "...";
		else
			this.alias = alias;
		this.color = color;
		this.is_auth = is_auth;
	}
}