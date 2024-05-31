export class Player {
	constructor(alias, batarang, is_logged) {
		this.alias = alias;
		this.batarang = batarang;
		this.is_logged = is_logged;
		this.eliminated = false;
	}
}