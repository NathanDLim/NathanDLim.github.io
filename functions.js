function displayDiceRoll(dice) {
	var result = rollDice(1, dice);
	var display = document.getElementById("diceDisplay");
	display.innerHTML = result;
}

					
function mod(stat) {
	return Math.floor((stat - 10) / 2);
}

function capitalize(s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

	
function logOutput(log) {
	var textarea = document.getElementById("diceResults");
	textarea.value += log + "\n"
	textarea.scrollTop = textarea.scrollHeight;
}

var twister = new MersenneTwister();

// Return the parsed dice in the following format
// [num_dice, dice, num_dice, dice, ... , modifier]
// Will always be an odd number of elements in the array
// Cannot deal with negatives at the moment
function parseDice(inputString) {
	// Parse the string for dice and mod
	var mod = 0;
	var result = [];
	var parts = inputString.split("+");
	for (var p = 0; p < parts.length; p += 1) {
		var part = parts[p].trim()
		if (part.includes("d")) {
			var diceParts = part.split("d")
			if (diceParts.length != 2) {
				console.log("Badly formatted dice");
				return [];
			}
			var dice_num = parseInt(diceParts[0]);
			var dice = parseInt(diceParts[1]);
			result.push(dice_num)
			result.push(dice)
		} else {
			mod += parseInt(part)
		}
	}
	result.push(mod);
	console.log(result)
	return result;
}

function rollDice(num, max) {
	var total = 0;
	var log = "Rolled " + num + "d" + max + ": ";
	for (var i = 0; i < num; i = i + 1) {
		var roll = Math.floor(twister.random() * max) + 1;
		log += " " + roll;
		total += roll;
	}
	logOutput(log);
	return total;
}

function customDiceRoll() {
	var customDice = document.getElementById("diceInput");
	var display = document.getElementById("diceDisplay")
	var parsedRoll = parseDice(customDice.value)
	
	var total = 0;
	
	while(parsedRoll.length > 0) {
		if (parsedRoll.length >= 2) {
			var num_dice = parsedRoll.shift();
			var dice = parsedRoll.shift();
			console.log("rolling " + num_dice + "d" + dice);
			total += rollDice(num_dice, dice);
		} else {
			total += parsedRoll.shift();
		}
	}
	display.innerHTML = total;

}

// Character list global variable
var characters = [];

function init() {
	/*******************************************
	 * Oregano Character
	 *******************************************/
	var temp_c = new Character("Oregano");
	temp_c.setAttributes(18, 22, 7, 11, 8, 13);
	temp_c.hp = 45;
	temp_c.setSavingThrowProficiencies(["str","con"])
	temp_c.armor = 18;
	temp_c.initiative = temp_c.getAttributeMod("dex");
	
	temp_c.setSkillProficiencies(["Athletics", "Arcana", "Sleight of Hand"]);
	temp_c.passPer = temp_c.getSkillValue("Perception") + 10;
	temp_c.passInt = temp_c.getSkillValue("Insight") + 10;
	
	
	temp_c.addAttack(new Attack("longsword", 8, "1d8+6"));
	temp_c.addAttack(new Attack("hatchet", 6, "1d6+4"));
	characters.push(temp_c)
	
	/*******************************************
	 * Signe Character
	 *******************************************/
	temp_c = new Character("Signe");
	temp_c.setAttributes(18, 12, 18, 11, 14, 13);
	temp_c.hp = 34;
	temp_c.setSavingThrowProficiencies(["str","con"])
	temp_c.armor = 16;
	temp_c.initiative = temp_c.getAttributeMod("dex");
	temp_c.setSpellStat("wis");
	
	temp_c.setSkillProficiencies(["Athletics", "Arcana", "Stealth"]);
	temp_c.passPer = temp_c.getSkillValue("Perception") + 10;
	temp_c.passInt = temp_c.getSkillValue("Insight") + 10;
	
	temp_c.addAttack(new Attack("Longbow Normal", 9, "1d8+7"));
	temp_c.addAttack(new Attack("Longbow Already Damaged", 9, "1d8+1d6+7"));
	temp_c.addAttack(new Attack("hatchet", 6, "1d6+4"));
	characters.push(temp_c)
	
	/*******************************************
	 * Zahra Character
	 *******************************************/
	temp_c = new Character("Zahra");
	temp_c.setAttributes(12, 14, 18, 11, 8, 13);
	temp_c.hp = 41;
	temp_c.setSavingThrowProficiencies(["dex","wis"])
	temp_c.armor = 14;
	temp_c.initiative = temp_c.getAttributeMod("dex");
	
	temp_c.setSkillProficiencies(["Sleight of Hand", "Arcana", "Stealth", "Perception"]);
	temp_c.passPer = temp_c.getSkillValue("Perception") + 10;
	temp_c.passInt = temp_c.getSkillValue("Insight") + 10;
	
	temp_c.addAttack(new Attack("Monk", 7, "1d8+5"));
	temp_c.addAttack(new Attack("Shortbow", 6, "1d6+4"));
	characters.push(temp_c)
	
	var charOptions = document.getElementById("characterOptions");
	for (var c = 0; c < characters.length; c += 1) {
		var curr_char = characters[c];
		var button = document.createElement("button")
		button.appendChild(document.createTextNode(curr_char.name));
		button.style.float = "left";
		button.style.margin = "5px"
		button.addEventListener("click", function() {
			var charDiv = document.getElementById("Character");
			var parent = charDiv.parentNode;
			charDiv.remove(charDiv)
			charDiv = document.createElement("div")
			charDiv.setAttribute("id", "Character");
			parent.appendChild(charDiv);
			
			for (var c = 0; c < characters.length; c += 1) {
				if (this.innerHTML.localeCompare(characters[c].name) === 0){
					characters[c].createCharacterHTML(charDiv);
					break;
				}
			}
		});
		charOptions.appendChild(button);
	}
	
	// All Character summary
	var button = document.createElement("button")
	button.appendChild(document.createTextNode("Summary"));
	button.style.margin = "5px"
	button.addEventListener("click", function() {
		var charDiv = document.getElementById("Character");
		var parent = charDiv.parentNode;
		charDiv.remove(charDiv)
		charDiv = document.createElement("div")
		charDiv.setAttribute("id", "Character");
		parent.appendChild(charDiv);
		
		for (var c = 0; c < characters.length; c += 1) {
			characters[c].createCharacterSummaryHTML(charDiv);
		}
	});
	charOptions.appendChild(button);
	
}