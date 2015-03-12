// Original game from:
// http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
// Slight modifications by Gregorio Robles <grex@gsyc.urjc.es>
// to meet the criteria of a canvas class for DAT @ Univ. Rey Juan Carlos

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// princess image
var princessReady = false;
var princessImage = new Image();
princessImage.onload = function () {
	princessReady = true;
};
princessImage.src = "images/princess.png";

// Stone image
var stoneReady = false;
var stoneImage = new Image();
stoneImage.onload = function () {
	stoneReady = true;
};
stoneImage.src = "images/stone.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var princess = {};
var stone = {};
var monster = {};
// var princessesCaught = localStorage.getItem("princessStorage");
var princessesCaught = 0;
var level = 1;
var hardLevel = 10;
var cont = 0;
var gameOver = true;
if(princessesCaught == null){
	princessesCaught = 0;
}
	

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a princess
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the princess somewhere on the screen randomly
	princess.x = 32 +(Math.random() * (canvas.width - 96));
	princess.y = 32 +(Math.random() * (canvas.height - 96));

	if(gameOver || (
		hero.x <= (monster.x + 10)
		&& monster.x <= (hero.x + 10)
		&& hero.y <= (monster.y + 10)
		&& monster.y <= (hero.y + 22)
		)){
		monster.x = 32 +(Math.random() * (canvas.width - 96)); // todo lo de dentro del if gameOver lo meto en una funcion aparte, mejor
		monster.y = 32 +(Math.random() * (canvas.height - 96));
		if (
		monster.x <= (princess.x + 16)
		&& princess.x <= (monster.x + 16)
		&& monster.y <= (princess.y + 16)
		&& princess.y <= (monster.y + 32)
		&& stone.x <= (monster.x + 16)
		&& monster.x <= (stone.x + 16)
		&& stone.y <= (monster.y + 16)
		&& monster.y <= (stone.y + 32)
		&& monster.x <= (hero.x + 16)
		&& hero.x <= (monster.x + 16)
		&& monster.y <= (hero.y + 16)
		&& hero.y <= (monster.y + 32)
		) {
			monster.x = 32 +(Math.random() * (canvas.width - 96));
			monster.y = 32 +(Math.random() * (canvas.height - 96));
		}
		gameOver = false;
	}

	stone.x = 32 +(Math.random() * (canvas.width - 96));
	stone.y = 32 +(Math.random() * (canvas.height - 96));

	if (
		stone.x <= (princess.x + 16)
		&& princess.x <= (stone.x + 16)
		&& stone.y <= (princess.y + 16)
		&& princess.y <= (stone.y + 32)
	) {
		stone.x = 32 +(Math.random() * (canvas.width - 96));
		stone.y = 32 +(Math.random() * (canvas.height - 96));

	}
};

// Update game objects
var update = function (modifier) {
	if (38 in keysDown) { // Player holding up
		if(hero.y <= 26 || (stone.y <= (hero.y + 32)
			&& hero.x <= (stone.x + 32) 
			&& stone.x <=(hero.x +32)
			&& hero.y <= (stone.y + 42))){
			hero.y += 2;
		}else{
			hero.y -= hero.speed * modifier;
		}
		
	}
	if (40 in keysDown) { // Player holding down
		if(hero.y >= 416 || (stone.y <= (hero.y + 32)
			&& hero.x <= (stone.x + 32) 
			&& stone.x <=(hero.x +32)
			&& hero.y <= (stone.y + 42))){
			hero.y -= 2;
		}else{
			hero.y += hero.speed * modifier;
		}
	}
	if (37 in keysDown) { // Player holding left
		if(hero.x <= 26 || (stone.y <= (hero.y + 32)
			&& hero.x <= (stone.x + 32) 
			&& stone.x <=(hero.x +32)
			&& hero.y <= (stone.y + 42))){
			hero.x += 2;
		}else{
			hero.x -= hero.speed * modifier;
		}
		
	}
	if (39 in keysDown) { // Player holding right
		if(hero.x >= 454 || (stone.y <= (hero.y + 32)
			&& hero.x <= (stone.x + 32) 
			&& stone.x <=(hero.x +32)
			&& hero.y <= (stone.y + 42))){
			hero.x -= 2;
		}else{
			hero.x += hero.speed * modifier;
		}	
	}

	// Are they touching?
	if (
		hero.x <= (princess.x + 16)
		&& princess.x <= (hero.x + 16)
		&& hero.y <= (princess.y + 16)
		&& princess.y <= (hero.y + 32)
	) {
		++princessesCaught;
		//localStorage.setItem("princessStorage", princessesCaught);
		if(princessesCaught == 10){
			level++;
			hardLevel--;
			princessesCaught = 0;
		}
		reset();
	}

	if (
		hero.x <= (monster.x + 10)
		&& monster.x <= (hero.x + 10)
		&& hero.y <= (monster.y + 10)
		&& monster.y <= (hero.y + 22)
	) {
		princessesCaught = 0;
		alert("Game Over");
		gameOver = true;
		window.location.reload();
	}	
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (princessReady) {
		ctx.drawImage(princessImage, princess.x, princess.y);
	}

	if(stoneReady) {
		ctx.drawImage(stoneImage, stone.x, stone.y);
	}

	if(monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Princesses caught: " + princessesCaught, 32, 32);
	ctx.fillText("Level: " + level, 32, 58);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	cont++;

	if(cont%hardLevel == 0){
		if((monster.x - hero.x) > 0){
				monster.x = monster.x - 1;
			}else{
				monster.x = monster.x + 1;
			}

			if((monster.y - hero.y) > 0){
				monster.y = monster.y - 1;
			}else{
				monster.y = monster.y + 1;
		}
	}

	update(delta / 1000);
	render();

	then = now;
};

// Let's play this game!
reset();
var then = Date.now();
//The setInterval() method will wait a specified number of milliseconds, and then execute a specified function, and it will continue to execute the function, once at every given time-interval.
//Syntax: setInterval("javascript function",milliseconds);
setInterval(main, 1); // Execute as fast as possible
