import { Player } from "./Player.js";

export class Tournament {
	constructor(players) {
		this.matches = [];
		this.qualified = [];
		this.simple_match = players.length == 2;
		for (var i = 0; i < players.length - 1; i = i + 2)
			this.matches.push(new Match(players[i], players[i + 1]));
		if (players.length % 2)
			this.qualified.push(players[players.length - 1]);
		this.curr_match = 0;
	}
	get_current_match() {
		if (this.curr_match >= this.matches.length)
			return null;
		return this.matches[this.curr_match];
	}
	get_next_match() {
		if (this.curr_match + 1 >= this.matches.length)
			return null;
		return this.matches[this.curr_match + 1];
	}
	send_result(i) {
		var match = this.get_current_match();
		if (!match)
			return ;
		if (i == 1) {
			this.qualified.push(match.p1);
			console.log("added qualified " + match.p1.alias)
		}
		else {
			this.qualified.push(match.p2);
			console.log("added qualified " + match.p2.alias)
		}
		// if (!this.get_next_match()) {
			console.log("qualified players : " + this.qualified.length);
			if (this.qualified.length == 2)
				this.matches.push(new Match(this.qualified[0], this.qualified[1]));
			else {
				this.curr_match++;
				return ;
			}
			this.qualified = [];
		// }
		console.log("nb of matches : " + this.matches.length);
		this.curr_match++;
	}
}

export class Match {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}
}