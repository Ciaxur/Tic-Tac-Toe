/* 
	Created by: Omar Omar
	Last Modified: Aug 24, 2017
	
	Known Bugs: 
		1. NONE
*/    

/* Variables */
var boxMatrix = 
[
	[null, null, null],
	[null, null, null],
	[null, null, null]
];							// Holds a multi-dimensional array for the boxes

var Game = false;
var Player = false;			// In order to give palyer the go ahead on placement

var PlayerSign;				// Stores which sign they are
var CPUSign;


/* On Load Function */

$(document).ready(function()
{
	/* TweenMin Box Animation */
	var rows = $('.board-row');
	var columnBoxes = $('.box-columns');

	
	TweenLite.from(rows[1], 1, {ease:Power3.easeNone, x:-500, opacity:0});
	TweenLite.from(columnBoxes, 1, {ease:Power4.easeNone, y:-500, opacity:0, delay:0.8});


	/* TweenMin Score Animation */
	var summary = $('.summary');
	var scores = $('.score');

	TweenLite.from(summary, 1 , {y:-15, opacity:0, delay:2});
	TweenLite.from(scores, 1 , {y:-15, opacity:0, delay:2.2});


	/* Settings Menu Animaion */
	displaySettings();


	/* TweenMin Animation END */


	/*  Click Functions */
	columnBoxes.click(function()
	{
		if(Game)											// Checks if Game is enabled
			PlayerPlay($(this), $(this).parent());
	});


	$('.sign-type').click(function()						// Assign sign-types
	{
		if($(this).html() == 'X')
		{
			PlayerSign = 'X';
			CPUSign = 'O';
		}

		else
		{
			PlayerSign = 'O';
			CPUSign = 'X';
		}


		hideSettings();										// Hide settings menu
	});
});


function CPUplay()
{
	/* Obtain random number, check and place X in the matrix where available */
	while(1)
	{
		var x = getRandomNum(0, 2);
		var y = getRandomNum(0, 2);

		
		if(boxMatrix[x][y] == null)
		{
			boxMatrix[x][y] = CPUSign;
			break;
		}
	}

	/* Place X in the right span */
	$('.board-row')[x].getElementsByTagName('span')[y].innerHTML = CPUSign;
}

function PlayerPlay(box, boxParent)
{
	if(!box.children()[0].innerHTML)						// Check if spot is empty
			Player = true;


	if(Player)												// If Player places a valid move
	{
		box.children()[0].innerHTML = PlayerSign;			// Inserts O

		boxMatrix[boxParent.index()][box.index()] = PlayerSign;// Register insert into Matrix


		Player = false;										// Set as false in order to check for valid moves

		if(checkBoard())									// Check board before CPU
			return 1;

		CPUplay();											// CPU's turn

		checkBoard();										// Check board after CPU
	}
}

function checkBoard()
{
	var counter;
	var Vcounter;
	var RDcounter;
	var LDcounter;
	var tieCounter = 0;
	
	
	for(var x=0; x<boxMatrix.length; x++)						// Loops through the array
	{
		counter = 	0;
		Vcounter = 	0;
		RDcounter = 0;
		LDcounter = 0;

		for(var y=0; y<boxMatrix[x].length-1; y++)
		{
			/* Check for Horizontal Wins '--' */
			if(boxMatrix[x][y])
				if(boxMatrix[x][y] == boxMatrix[x][y+1])
					counter++;

			if(counter == 2)
			{
				showWinner(boxMatrix[x][y]);
				return 1;										// Return 1 shows the fucntion found something
			}


			/* Check Vertical Wins '|' */
			if(boxMatrix[y][x])
				if(boxMatrix[y][x] == boxMatrix[y+1][x])
					Vcounter++;

			if(Vcounter == 2)
			{
				showWinner(boxMatrix[y][x]);
				return 1;
			}


			/* Check Diagonal-Right Wins '\' */
			if(boxMatrix[y][y])
				if(boxMatrix[y][y] == boxMatrix[y+1][y+1])
					RDcounter++;

			if(RDcounter == 2)
			{
				showWinner(boxMatrix[y][y]);
				return 1;
			}


			/* Check Diagonal-Left Wins '/' */
			if(boxMatrix[boxMatrix.length-(y+1)][boxMatrix.length-(boxMatrix.length-y)])			// If not NULL
			{
				if(boxMatrix[boxMatrix.length-(y+1)][boxMatrix.length-(boxMatrix.length-y)]   ==   boxMatrix[boxMatrix.length-(y+1)-1][boxMatrix.length-(boxMatrix.length-y)+1])  // Check backwards diagonal
					LDcounter++;

				if(LDcounter == 2)
				{
					showWinner(boxMatrix[boxMatrix.length-(y+1)][boxMatrix.length-(boxMatrix.length-y)]);
					return 1;
				}
			}


			/* Check for a TIE */
			if(boxMatrix[x][y])
				tieCounter++;

			if(y == boxMatrix[x].length-2)
				if(boxMatrix[x][y+1])
					tieCounter++;
		}
	}

	if(tieCounter == 9)				// NOTE: Placed outside in order to check for any last move wins. BUT STILL DOESN'T WORK :(
	{
		showWinner('TIE');
		return 1;
	}
}

function showWinner(sign)
{
	var status 		= $('.status');							// Winner Description
	var buttons		= $('button');

	var playerScore = $('.score')[0];
	var cpuScore 	= $('.score')[1];


	if(sign == CPUSign)										// Set Winner's name
	{
		status.children()[2].innerHTML = 'CPU Wins!';
		cpuScore.innerHTML = parseInt(cpuScore.innerHTML) + 1;	// Add scores by 1
	}
	else if(sign == PlayerSign)
	{
		status.children()[2].innerHTML = 'Player Wins!';
		playerScore.innerHTML = parseInt(playerScore.innerHTML) + 1;
	}
	else
		status.children()[2].innerHTML = "It's a TIE!";


	/* TweenLite Animations */
	TweenLite.fromTo(status, 1, {y:-150, autoAlpha:0}, {y:0, autoAlpha:1, display:'block'});
	TweenLite.fromTo(buttons, 1,  {y:-20, autoAlpha:0}, {y:0, autoAlpha:1, delay:1});


	Game 	= false;											// Disable Game
}

function resetGame(type)
{
	/* Variable defines */
	var boxes 		= $('span');
	var scores 		= $('.score');
	var status 		= $('.status');
	var buttons		= $('button');

	/* Reset Variables */
	boxMatrix = 
	[
		[null, null, null],
		[null, null, null],
		[null, null, null]
	];

	Game = true;
	Player = false;

	/* Remove html from inside span tags */
	boxes.each(function(index, el) { el.innerHTML = ''; });


	if(type == 'Reset')									// Reset the Game
	{
		scores.each(function(index, el) { el.innerHTML = '0'; })
		Game = false;
		displaySettings();
	}


	/* Take away the status screen */
	/* TweenLite Animations */
	TweenLite.to(buttons, 1,  	{ease:Power3.easeNone, y:-20, opacity:0});
	TweenLite.fromTo(status, 1, {ease:Power3.easeNone, y:0, autoAlpha:1, display:'block'}, {y:-150, autoAlpha:0, delay:1});
}

function displaySettings()
{
	/* Variables */
	var settingMenu = $('.settings');
	var signType = $('.sign-type');

	/* Tween Animation for the sign settings */
	settingMenu.css('display', 'block');

	TweenLite.fromTo(settingMenu, 0.5, {autoAlpha:0, y:-50}, {ease:Power1.easeIn, y:0, delay:2, autoAlpha:1});
	TweenLite.fromTo(signType, 0.5, {autoAlpha:0, y:-50}, {ease:Power1.easeIn, y:0, autoAlpha:1, delay:2.3});
}

function hideSettings()
{
	/* Variables */
	var settingMenu = $('.settings');
	var signType = $('.sign-type');

	/* Tween Animation for the sign settings */
	TweenLite.to(signType, 0.5, {ease:Power1.easeIn , autoAlpha:0, y:-50});
	TweenLite.to(settingMenu, 0.5, {ease:Power1.easeIn, autoAlpha:0, y:-50, delay:0.5});

	Game = true;											// Enable Game
}



/* Useful Functions */
function getRandomNum(min, max)						// Returns a random number between min and max ROUNDED
{
	return Math.round(Math.random() * (max - min) + min);
}