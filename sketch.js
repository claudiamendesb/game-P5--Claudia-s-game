//game project #5
var gameChar_x; 
var gameChar_y; 
var floorPos_y; 
var isLeft;       // Declare variables for movement 
var isRight; 
var isFalling; 
var isJumping;
var isPlummeting; 

var collectables; 

var clouds;
var mountains;
var trees;
var canyon;
var game_score;
var flagpole;
var lives;

function setup() { 
    createCanvas(1024, 576); 
    floorPos_y = height * 3/4; 
	lives = 3;
	startGame();
}

function startGame(){
    // Variable to control the background scrolling.
    scrollPos = 0;
	gameChar_x = width / 20; //where it starts
    gameChar_y = floorPos_y; 

    // Variable to store the real position of the gameChar in the game world.
    gameChar_world_x = gameChar_x - scrollPos;
    
    // Initialize interaction variables to false 
    isLeft = false; 
    isRight = false; 
    isFalling = false; 
    isJumping = false;
    isPlummeting = false; 
    
	game_score = 0

    // Array for multiple collectables
    collectables = [
        {x_pos: 220, y_pos: floorPos_y -10, size: 30, isFound: false},
        {x_pos: 420, y_pos: floorPos_y -10, size: 30, isFound: false},
        {x_pos: 880, y_pos: floorPos_y -10, size: 30, isFound: false}
    ];
	
    // Clouds array
	clouds = [
		{x_pos: 200, y_pos: 100},
		{x_pos: 400, y_pos: 150},
		{x_pos: 800, y_pos: 100},
		{x_pos: 600, y_pos: 50}
	];
	
    // Mountains array
	mountains = [
		{x_pos: 375, y_pos: floorPos_y - 50},
		{x_pos: 300, y_pos: floorPos_y},
		{x_pos: 450, y_pos: floorPos_y}
	];
	
    // Trees array
	trees = [
		{x_pos: 180, y_pos: floorPos_y},
		{x_pos: 570, y_pos: floorPos_y},
		{x_pos: 610, y_pos: floorPos_y}
	];
	
	//canyon
	canyon = [
		{x_pos: 250, y_pos: floorPos_y, width: 80},
		{x_pos: 455, y_pos: floorPos_y, width: 80},
		{x_pos: 780, y_pos: floorPos_y, width: 80}
		
	];
	
	//flagpole
	flagpole = {
		x_pos: 900,
		isReached: false
	};
	
	
} 

function draw() { 
    // Drawing code
    background(175, 238, 238); // Fill the sky blue 

    // Draw clouds.
	drawClouds();

    // Draw mountains.
	drawMountains();
	
    // Draw trees.
	drawTrees();
	
    // Draw the ground
    noStroke(); 
    fill(0, 165, 0); 
    rect(0, floorPos_y, width, height - floorPos_y); // Draw green ground 

    // Draw the canyon
	drawCanyon();

    // Draw collectables
	drawCollectables();
	
	//draw flagpole
	renderFlagpole();
	
	//check is the flagpole is reached
	checkFlagpole();
	
	checkPlayerDie();
	
	drawLives();

    // refactoring game character, conditional for all the possible positions
    stroke(0);
    if (isLeft && isFalling) {
        drawCharacter(gameChar_x, gameChar_y, "left");
    } else if (isRight && isFalling) {
        drawCharacter(gameChar_x, gameChar_y, "right");
    } else if (isFalling) {
        drawCharacter(gameChar_x, gameChar_y, "falling");
    } else if (isLeft) {
        drawCharacter(gameChar_x, gameChar_y, "left");
    } else if (isRight) {
        drawCharacter(gameChar_x, gameChar_y, "right");
    } else {
        drawCharacter(gameChar_x, gameChar_y, "front");
    }

     //Interaction logic for scrolling
    if (isLeft) {
        if (gameChar_x > width * 0.1) {
            gameChar_x -= 5;
        } else {
            scrollPos += 5;
        }
    }
    if (isRight) {
        if (gameChar_x < width * 0.9) {
            gameChar_x += 5;
        } else {
            scrollPos -= 5; // negative for moving against the background
        }
    }
    
    // Handle jumping and falling
    if (isJumping) {
        gameChar_y -= 5; // Move up when jumping
        if (gameChar_y <= floorPos_y - 150) { // Maximum jump height
            isJumping = false;
            isFalling = true;
        }
    } else if (isFalling) {
        if (gameChar_y < floorPos_y) {
            gameChar_y += 5; // Fall down
        } else {
            isFalling = false;
            gameChar_y = floorPos_y;
        }
    }

    // Canyon logic (falling into the canyon)
	isPlummeting = false;
	for (var i = 0; i < canyon.length; i++) {
		if (
			gameChar_world_x > canyon[i].x_pos &&
			gameChar_world_x < canyon[i].x_pos + canyon[i].width &&
			gameChar_y >= floorPos_y
		) {
			isPlummeting = true;
			break;
		}
	}
	if (isPlummeting) {
		gameChar_y += 5; //fall on through the canyon
		if (gameChar_y > height) {
			//resetGameChar();//reset position
			(checkPlayerDie());// lives counting
		}
	}

    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;
	
	fill(255);
	noStroke();
	text('score: ' + game_score, 50, 30);
}

function drawCharacter(x, y, state) {
    // Drawing the character based on state
    stroke(0)
	fill(0); // Head
    ellipse(x, y - 50, 25);
    fill(255); // Eyes
    ellipse(x - 5, y - 52, 8);
    ellipse(x + 5, y - 52, 8);
    fill(0); // Nose and body
    if (state === "left") {
        triangle(x - 12, y - 55, x - 17, y - 50, x - 12, y - 45);
    } else if (state === "right") {
        triangle(x + 12, y - 55, x + 17, y - 50, x + 12, y - 45);
    } else {
        triangle(x - 3, y - 52, x + 3, y - 52, x, y - 48);
    }
    rect(x - 3, y - 40, 6, 30); // Body
    stroke(2);
    strokeWeight(2);
    line(x + 1, y - 38, x - 20, y - 30); // Left arm
    line(x + 1, y - 38, x + 20, y - 30); // Right arm
    noStroke();
    fill(0); // Legs
    rect(x - 2, y - 15, 8, 12);
    rect(x - 10, y - 15, 8, 12);
}

function keyPressed() { 
    // Update interaction variables based on key presses 
    if (key === 'a') { 
        isLeft = true; 
    } else if (key === 'd') { 
        isRight = true; 
    } else if (key === 'w' && !isFalling) { 
        isJumping = true;
    } else if (key === 'r' && lives === 0) {
		lives = 3;
		game_score = 0; 
		flagpole.isReached = false;
		loop();
		startGame();
		   }
} 

function keyReleased() { 
    // Reset interaction variables based on key releases 
    if (key === 'a') { 
        isLeft = false; 
    } else if (key === 'd') { 
        isRight = false; 
    } 
}

function resetGameChar() {
    gameChar_x = width / 20;
    gameChar_y = floorPos_y;
    isPlummeting = false;
    isFalling = false;
    scrollPos = 0;
    gameChar_world_x = gameChar_x - scrollPos;
}

// Cloud drawing function
function drawClouds() {
	for (var i = 0; i < clouds.length; i++) {
		fill(255);
		ellipse(clouds[i].x_pos + scrollPos, clouds[i].y_pos, 95, 95);
		ellipse(clouds[i].x_pos + 25 +scrollPos, clouds[i].y_pos, 100, 100);
		ellipse(clouds[i].x_pos + 65 +scrollPos, clouds[i].y_pos, 95, 95);
	}
}

// Mountain drawing function
function drawMountains() {
	for (var i = 0; i < mountains.length; i++) {
		fill(120);
		triangle(
			mountains[i].x_pos - 100 + scrollPos, mountains[i].y_pos,
			mountains[i].x_pos + scrollPos, mountains[i].y_pos - 232,
			mountains[i].x_pos + 100 + scrollPos, mountains[i].y_pos
		);
		
		fill(220); // Snow on top
		triangle(
			mountains[i].x_pos - 60 + scrollPos, mountains[i].y_pos - 100,
			mountains[i].x_pos + scrollPos, mountains[i].y_pos - 235,
			mountains[i].x_pos + 57 + scrollPos, mountains[i].y_pos - 100
		);
	}
}

// Tree drawing function
function drawTrees() {
	for (var i = 0; i < trees.length; i++) {
		fill(139, 69, 19); // Brown color for the trunk
		rect(trees[i].x_pos - 10 + scrollPos, trees[i].y_pos - 110, 20, 110); // Trunk

		fill(30, 119, 100); // Green color for the leaves
		ellipse(trees[i].x_pos - 25 + scrollPos, trees[i].y_pos - 110, 50, 50); // Left leaf cluster
		ellipse(trees[i].x_pos + 25 + scrollPos, trees[i].y_pos - 110, 50, 50); // Right leaf cluster
		ellipse(trees[i].x_pos + scrollPos, trees[i].y_pos - 132, 50, 60); // Top leaf cluster
	}
}

//collectables
function drawCollectables(){

	  for (var i = 0; i < collectables.length; i++) {
        if (!collectables[i].isFound && 
            dist(gameChar_world_x, gameChar_y, collectables[i].x_pos, collectables[i].y_pos) < 20) {
            collectables[i].isFound = true;
            game_score += 1;
        }
        if (!collectables[i].isFound) {
            stroke(255, 255, 0); 
            fill(255, 165, 0); // Orange 
            ellipse(collectables[i].x_pos +scrollPos, collectables[i].y_pos - 20, collectables[i].size);
        }
				
    }
}

//canyon
function drawCanyon(){
	for (var i = 0; i < canyon.length; i++){
	    fill(139, 69, 19);
    	rect(canyon[i].x_pos + scrollPos, canyon[i].y_pos, canyon[i].width, 200);
	}
}

//render flagpole
function renderFlagpole() {
    stroke(0);
    strokeWeight(5);
    line(flagpole.x_pos + scrollPos, floorPos_y, flagpole.x_pos + scrollPos, floorPos_y - 150); // The pole
	

    if (flagpole.isReached) {
        // Draw the flag at the top of the pole
        fill(255, 0, 0); // Red flag
        rect(flagpole.x_pos + scrollPos, floorPos_y - 150, 50, 30);
    } else {
        // Draw the flag in its default position
        fill(255, 0, 0); // Red flag
        rect(flagpole.x_pos + scrollPos, floorPos_y - 50, 50, 30);
    }
}

// Function to check if the character has reached the flagpole
function checkFlagpole() {
    var d = abs(gameChar_world_x - flagpole.x_pos);
    if (d < 20) {
        flagpole.isReached = true;
    }
}

//lives
function checkPlayerDie(){
	if (gameChar_y > height) { //cheking if the character is below the bottom of the canvas
		lives -= 1 //drecrementing lives
		if (lives > 0) {
			startGame(); //restart game if there is not remaining lives 
		} else {
			//game over
			console.log("GAME OVER");
			noLoop(); //Stops the loop
			fill(150, 0, 0);
			textSize(100);
			textAlign(CENTER);
			text("GAME OVER", width / 2, height / 2);
			textSize(20);
			text("Press 'r' to Restart", width / 2, height / 2 + 40);
		}
	}
}

//draw lifes
function drawLives() {
	for (var i = 0; i < lives; i++) {
		fill(150, 0, 0);
		noStroke();
		ellipse(50 + i * 30, 50, 20, 20);
	}
}

