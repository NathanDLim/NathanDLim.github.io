

class Attack {

	constructor(name, attack, damage) {
		this.name = name
		this.attackBonus = attack
		this.damage = damage
		this.crit - false;
	}
	
	get attack() { return this.attackBonus; }
	get damageDisplay() { return this.damage; }
	get attackName() { return this.name; }
	
	rollAttack() {
		var roll = rollDice(1, 20);
		if (roll === 20) {
			console.log("Got a crit!")
			this.crit = true;
		}
		return roll + this.attackBonus;
	}
	rollDamage() {
		// Parse the string for dice and bonus
		var total = 0;
		var parts = this.damage.split("+");
		for (var p = 0; p < parts.length; p += 1) {
			var part = parts[p].trim()
			if (part.includes("d")) {
				var diceParts = part.split("d")
				if (diceParts.length != 2) {
					console.log("Badly formatted dice");
					return -1;
				}
				var dice_num = parseInt(diceParts[0]);
				var dice = parseInt(diceParts[1]);
				if (this.crit) {
					dice_num *= 2;
				}
				total += rollDice(dice_num, dice);
			} else {
				total += parseInt(part)
			}
		}
		return total;
	}
	isCrit() { return this.crit; }
	clearCrit() { this.crit = false; }
}


class Character {
	name;
	armor = 0;
	initiative = 0;
	passPer = 0;
	passInt = 0;
	spellDC = 0;
	proficiencyBonus = 3;
	attacks = [];
	attributes = {};
	skills = {"Acrobatics":{"stat":"dex", "prof":false},
			  "Animal Handling":{"stat":"wis", "prof":false},
			  "Arcana":{"stat":"int", "prof":false},
			  "Athletics":{"stat":"str", "prof":false},
			  "Deception":{"stat":"cha", "prof":false},
			  "History":{"stat":"int", "prof":false},
			  "Insight":{"stat":"wis", "prof":false},
			  "Intimidation":{"stat":"cha", "prof":false},
			  "Investigation":{"stat":"int", "prof":false},
			  "Medicine":{"stat":"wis", "prof":false},
			  "Nature":{"stat":"int", "prof":false},
			  "Perception":{"stat":"wis", "prof":false},
			  "Persuasion":{"stat":"cha", "prof":false},
			  "Religion":{"stat":"int", "prof":false},
			  "Sleight of Hand":{"stat":"dex", "prof":false},
			  "Stealth":{"stat":"dex", "prof":false},
			  "Survival":{"stat":"wis", "prof":false}};
	
	setAttributes(str, con, dex, intl, wis, cha) {
		this.attributes["str"] = {"value":str,"mod":mod(str), "prof":false}
		this.attributes["con"] = {"value":con,"mod":mod(con), "prof":false}
		this.attributes["dex"] = {"value":dex,"mod":mod(dex), "prof":false}
		this.attributes["int"] = {"value":intl,"mod":mod(intl), "prof":false}
		this.attributes["wis"] = {"value":wis,"mod":mod(wis), "prof":false}
		this.attributes["cha"] = {"value":cha,"mod":mod(cha), "prof":false}
	}
	
	constructor(name){
		this.name = name;
		this.setAttributes(0,0,0,0,0,0);
	}

	get characterName() { return this.name; }
	set armor(val) {this.armor = val;}
	set initiative(val) {this.initiative = val;}
	set passPer(val) {this.passPer = val;}
	set passInt(val) {this.passInt = val;}
	set spellDC(val) {this.spellDC = val;}
	
	setSkillProficiencies(profs) {
		for (var i = 0; i < profs.length; i += 1) {
			if (profs[i] in this.skills) {
				this.skills[profs[i]]["prof"] = true;
			}
		}
		console.log(this.skills)
	}
	
	getAttributeMod(stat){
		if (stat in this.attributes) {
			return this.attributes[stat]["mod"];
		}
		console.log("Error grabbing attribute mod " + stat);
		return -1;
	}
	
	getSkills() {
		return Object.keys(this.skills);
	}
	
	getSkillValue(skill) {
		if (skill in this.skills) {
			var value = this.attributes[this.skills[skill]["stat"]]["mod"]
			if (this.skills[skill]["prof"]) {
				value += this.proficiencyBonus;
			}
			return value;
		}
		return -1;
	}
	
	setSavingThrowProficiencies(profs) {
		for (var i = 0; i < profs.length; i += 1) {
			if (profs[i] in this.attributes) {
				this.attributes[profs[i]]["prof"] = true;
			}
		}
		console.log(this.attributes)
	}
	
	addAttack(val) {this.attacks.push(val);}
	getAttack(index) {
		if (index < this.attacks.length) {
			return this.attacks[index];
		}
		return null;
	}
	getNumAttack() { return this.attacks.length; }
	
	createCharacterHTML(parentNode) {
		var div = document.createElement("div")
		var name = document.createElement("div")
		var nametext = document.createTextNode(this.name)
		name.appendChild(nametext);
		div.appendChild(name);
		
		var ac = document.createElement("div")
		var actext = document.createTextNode("AC: " + this.armor)
		ac.style.float = "left"
		ac.style.padding = "10px"
		ac.appendChild(actext);
		div.appendChild(ac);
		
		ac = document.createElement("div")
		actext = document.createTextNode("Initiative: " + this.initiative)
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		// Attributes and Saving Throws div
		ac = document.createElement("div")
		var stats = document.createElement("div")
		var l = document.createElement("label")
		l.innerHTML = "Attributes"
		l.style.float = "left"
		stats.appendChild(l)
		
		l = document.createElement("label")
		l.innerHTML = "Saving Throws"
		stats.appendChild(l)
		var statBlockDiv = document.createElement("div")
		for (const [key, value] of Object.entries(this.attributes)) {
			var s = document.createElement("div");
			var sl = document.createElement("label");
			sl.innerHTML = capitalize(key);
			sl.style.padding = "5px"
			var sv = document.createElement("label");
			var smod = document.createElement("label");
			var sthrow = document.createElement("label");
			var saveT = value["mod"]
			if (value["prof"] === true) {
				saveT += this.proficiencyBonus
				sl.style.fontWeight = "bold";
			}
			sv.innerHTML = value["value"]
			smod.innerHTML = "(" + value["mod"] + ")"
			sthrow.innerHTML = saveT;
			
			s.appendChild(sl);
			s.appendChild(sv);
			s.appendChild(smod);
			s.appendChild(sthrow);
			stats.appendChild(s);
		}
		ac.appendChild(stats);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		var attackDiv = document.createElement("div")
		l = document.createElement("label")
		l.innerHTML = "Attacks"
		attackDiv.appendChild(l)
		for (var a = 0; a < this.attacks.length; a += 1) {
			var cur_attack = this.attacks[a];
			var attack = document.createElement("div")
			var button = document.createElement("button")
			// Label button so we can retrieve the character and attack number
			button.setAttribute("character", this.name)
			button.setAttribute("attack", a);
			button.style.margin = "5px";
			button.style.backgroundColor = "lightGrey"
			var display = document.createElement("label")
			display.style.padding = "5px";
			
			display.appendChild(document.createTextNode("+" + cur_attack.attack + " " + cur_attack.damageDisplay))
			button.appendChild(document.createTextNode(cur_attack.attackName))
			
			// Attack Listener
			button.addEventListener("click", function() {
				var name = this.getAttribute("character")
				var att_num = this.getAttribute("attack")
				var character;
				for (var c = 0; c < characters.length; c += 1) {
					console.log(name + ", " + characters[c].name);
					if (name.localeCompare(characters[c].name) === 0) {
						character = characters[c];
					}
				}
				console.log(character);
				
				var cur_attack = character.getAttack(att_num)
				// Get result element
				var res = document.querySelectorAll('input[character="' + character.name + '"][attack="' + att_num + '"]')
				var attack_result = "Attack: " + cur_attack.rollAttack() + ", Damage: " + cur_attack.rollDamage()
				res[0].value = attack_result;
				
				
				if (cur_attack.isCrit()) {
					res[0].style.backgroundColor = "black"
					res[0].style.color = "white"
				} else {
					res[0].style.backgroundColor = "white"
					res[0].style.color = "black"
				}
				cur_attack.clearCrit();
			});
			
			var result = document.createElement("input")
			result.setAttribute("character", this.name)
			result.setAttribute("attack", a);
			result.style.padding = "5px";
			
			attack.appendChild(button)
			attack.appendChild(display)
			attack.appendChild(result)
			attackDiv.appendChild(attack)
		}
		attackDiv.style.padding = "10px"
		div.appendChild(attackDiv);
						
		//Skills Div
		ac = document.createElement("div")
		var sk = document.createElement("div")
		l = document.createElement("label")
		l.innerHTML = "Skills"
		sk.appendChild(l)
		for (const [key, value] of Object.entries(this.skills)) {
			var s = document.createElement("div");
			var sl = document.createElement("label");
			sl.innerHTML = key
			sl.style.padding = "5px"
			if (value["prof"] === true) {
				sl.style.fontWeight = "bold";
				sl.style.fontSize = "large";
			}
			var sv = document.createElement("label");
			var saveT = this.getSkillValue(key)
			sv.innerHTML = saveT
			s.appendChild(sl);
			s.appendChild(sv);
			sk.appendChild(s);
		}
		ac.appendChild(sk);
		ac.style.padding = "10px";
		div.appendChild(ac);
		
		parentNode.appendChild(div);
	}
}
