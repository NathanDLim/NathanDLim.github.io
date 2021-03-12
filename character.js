

class Attack {

	constructor(name, attack, damage) {
		this.name = name
		this.attackBonus = attack
		this.damage = damage
		this.crit = false;
		this.critFail = false;
	}
	
	get attack() { return this.attackBonus; }
	get damageDisplay() { return this.damage; }
	get attackName() { return this.name; }
	
	rollAttack() {
		var roll = rollDice(1, 20);
		if (roll === 20) {
			console.log("Got a crit!")
			this.crit = true;
		} else if (roll === 1) {
			console.log("Got a crit FAIL!")
			this.critFail = true;
		}
		return roll + this.attackBonus;
	}
	
	rollDamage() {
		// Parse the string for dice and bonus
		var parsedRoll = parseDice(this.damage)
		var total = 0;
		while(parsedRoll.length > 0) {
			if (parsedRoll.length >= 2) {
				var num_dice = parsedRoll.shift();
				var dice = parsedRoll.shift();
				if (this.crit) {
					num_dice *= 2;
				}
				total += rollDice(num_dice, dice);
			} else {
				total += parsedRoll.shift();
			}
		}
		return total;
	}
	
	isCrit() { return this.crit; }
	isCritFail() { return this.critFail; }
	clearCrit() {
		this.crit = false;
		this.critFail = false;
	}
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
	
	setSpellStat(stat) {
		if (stat in this.attributes) {
			this.spellDC = 8 + this.proficiencyBonus + this.attributes[stat]["mod"]
		}
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
		ac.style.float = "left"
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		ac = document.createElement("div")
		actext = document.createTextNode("Spell DC: " + this.spellDC)
		ac.style.float = "left"
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		ac = document.createElement("div")
		actext = document.createTextNode("Passive Perception: " + this.passPer)
		ac.style.float = "left"
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		ac = document.createElement("div")
		actext = document.createTextNode("Passive Insight: " + this.passInt)
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		// Attributes and Saving Throws div
		ac = document.createElement("div")
		var stats = document.createElement("div")
		var l = document.createElement("label")
		l.innerHTML = "Attributes"
		l.style.float = "left"
		l.style.paddingLeft = "10px"
		l.style.paddingRight = "30px"
		stats.appendChild(l)
		
		l = document.createElement("label")
		l.innerHTML = "Saving Throws"
		stats.appendChild(l)
		var statBlockDiv = document.createElement("div")
		statBlockDiv.className = "stat-grid-container";
		for (const [key, value] of Object.entries(this.attributes)) {
			var sl = document.createElement("label");
			sl.innerHTML = capitalize(key);
			sl.style.padding = "5px"
			var sv = document.createElement("label");
			sv.className = "stat-grid";
			var smod = document.createElement("label");
			smod.className = "stat-grid";
			var sthrow = document.createElement("label");
			sthrow.className = "stat-grid";
			var saveT = value["mod"]
			if (value["prof"] === true) {
				saveT += this.proficiencyBonus
				sl.style.fontWeight = "bold";
			}
			sv.innerHTML = value["value"]
			smod.innerHTML = "(" + value["mod"] + ")"
			sthrow.innerHTML = saveT;
			
			statBlockDiv.appendChild(sl);
			statBlockDiv.appendChild(sv);
			statBlockDiv.appendChild(smod);
			statBlockDiv.appendChild(sthrow);
		}
		stats.appendChild(statBlockDiv)
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
				
				var cur_attack = character.getAttack(att_num)
				// Get result element
				var res = document.querySelectorAll('input[character="' + character.name + '"][attack="' + att_num + '"]')
				var attack_result = "Attack: " + cur_attack.rollAttack() + ", Damage: " + cur_attack.rollDamage()
				res[0].value = attack_result;
				
				
				if (cur_attack.isCrit()) {
					res[0].style.backgroundColor = "black"
					res[0].style.color = "white"
				} else if (cur_attack.isCritFail()) {
					res[0].style.backgroundColor = "red"
					res[0].style.color = "black"
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
	
	createCharacterSummaryHTML(parentNode) {
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
		ac.style.float = "left"
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		ac = document.createElement("div")
		actext = document.createTextNode("Spell DC: " + this.spellDC)
		ac.style.float = "left"
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		ac = document.createElement("div")
		actext = document.createTextNode("Passive Perception: " + this.passPer)
		ac.style.float = "left"
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		
		ac = document.createElement("div")
		actext = document.createTextNode("Passive Insight: " + this.passInt)
		ac.appendChild(actext);
		ac.style.padding = "10px"
		div.appendChild(ac);
		parentNode.appendChild(div);
	}
	
	
}

