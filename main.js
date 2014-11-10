
var kimonoAPI =  "https://www.kimonolabs.com/api/all7528q?apikey=uF6U2ZDsF8YUIV2sDAtZgkxDx7H2CQYj";
var kimonodata=[];


var spaceData = {
	ready : false,
	animate : false,
	apiData	: {}
};

var numbersFunction = function(searchTerm){
	$.ajax({
		url: kimonoAPI,
		type: 'GET',
		dataType: 'jsonp',
		error: function(data){
			console.log("We got problems");
			spaceData.apiData = {number: 0};
			spaceData.ready = true;
		},
		success: function(data){
			console.log("WooHoo!");
			kimonodata = data.results.collection1;
			console.log(kimonodata);
			var htmlstring="";
			var funstring="";
			for(var i=0;i<247;i++){
				if (searchTerm==kimonodata[i].CountryName.text){
					console.log(searchTerm);
					console.log(kimonodata[i].CountryName.text);
					Density=kimonodata[i].Density;
					CountryName=kimonodata[i].CountryName.text;
					LearnMoreAboutCountry=kimonodata[i].CountryName.href;
					Population=kimonodata[i].Population;
					Area=kimonodata[i].Area;
					Rank=kimonodata[i].Rank;


					console.log(Density);

				}
			}

			htmlstring+="<p></br></p><h3 style='padding:0px 60px 0px 60px'>"+ CountryName+" is ranked <strong>"+Rank+"</strong> most crowded country in the world.</p>";
			htmlstring+=CountryName+ " has a <strong>population density</strong> of "+Density+". </h3>"+"<p>"+CountryName+ " has a <strong>population</strong> of "+Population+" and a <strong>land area (in square kilometers)</strong> of "+Area+".";
			htmlstring+="<h4> To learn more about "+CountryName+" click "+"<a href='"+LearnMoreAboutCountry+"'>here</a>.</h4><p></br></p>";



			$("#resultsTarget").html('');
			$("#resultsTarget").append(htmlstring);


			var value = parseFloat(Density.replace(",", ""));
			console.log(value);
			var inter = (value/10);
			console.log(inter);
			var babynumber = Math.round(inter);
			console.log(babynumber);
			spaceData.apiData=babynumber;

			

			spaceData.ready = true;
		}
	});
};

$(document).ready(function(){
	console.log("LOADED!!!!");


	$("#search").click(function(){
		console.log("Clicked search");
		$("#resultsTarget").html("");
		var newSearchTerm = $("#query").val();
		console.log(newSearchTerm);
		numbersFunction(newSearchTerm);
	});

	$("#query").keypress(function(e){
		if (e.which == 13){
			$("#search").trigger('click');
		}
	});

});






/*---------------------------------------------
p5 Code
----------------------------------------------*/
//Array to store the objects
var astros = [];
var msg = '';

function setup() {
	console.log("Setup");
	createCanvas(windowWidth, windowHeight/1.5);

	/*
	//ALT APPROACH - use loadJSON
	loadJSON('http://api.open-notify.org/astros.json', loaded);
	*/
}

/*
//Use with ALT setup approach
function loaded(data){
	console.log("Got the data!");
	console.log(data);
	spaceData.apiData = data;
	spaceData.ready = true;
}
*/

function draw() {
	background(51,204,255);
	//Check if the data is ready
	if (spaceData.ready){
		console.log("Data is ready!");
		if (spaceData.apiData === 0){
			//Update msg div
			msg.html("You apparently don't have to swim with anyone!" );
			spaceData.ready = false;
		}
		else{
			astros=[];
			//Loop through total people and create Astronaut objects
			for (var i=0; i<spaceData.apiData; i++) {
				astros[i] = new Astronaut(random(width), random(height), random(20,70), random(70,120), random(-3,3), random(-3,3));
			}
			//Toggle the booleans
			spaceData.ready = false;
			spaceData.animate = true;
			//Update msg div
		}
	}
	//Start animation once objects are intialized
	if (spaceData.animate){
		for (var j=0; j<astros.length; j++) {
			astros[j].update();
			astros[j].display();
		}
	}
}

function mousePressed(){
	for (var i = 0; i < astros.length; i++){
		if (astros[i].hovered){
			astros[i].clicked();
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	console.log(width + " : " + height);
}

//Astronaut Class
function Astronaut(xPos, yPos, xWidth, yHeight, xSpeed, ySpeed){
	console.log("Making astronauts");
	this.x = xPos;
	this.y = yPos;
	this.xWidth = xWidth;
	this.yHeight = yHeight;
	this.xSpeed = xSpeed;
	this.ySpeed = ySpeed;

	//Define colors
	this.r = Math.round(random(255));
	this.g = Math.round(random(255));
	this.b = Math.round(random(255));
	this.c_random = color(this.r, this.g, this.b);
	this.c_hover = color(255,51,204);
	//Set starting color
	this.c = this.c_random;

	//Add a hover boolean
	this.hovered = false;
}

Astronaut.prototype.display = function(){
	//Draw body
	fill(this.c);
	ellipse(this.x, this.y, this.xWidth, this.yHeight);
	//Draw eyes
	fill(255);

};

Astronaut.prototype.update = function(){
	this.x += this.xSpeed;
	this.y += this.ySpeed;
	this.checkEdges();
	this.checkHoverState();
};

Astronaut.prototype.checkEdges = function(){
	var widthBoundsLow = -(this.xWidth/2);
	var widthBoundsHigh = windowWidth + (this.xWidth/2);
	var heightBoundsLow = -(this.yHeight/2);
	var heightBoundsHigh = windowHeight + (this.yHeight/2);

	if (this.xSpeed > 0){
		if (this.x > widthBoundsHigh){
			this.x = widthBoundsLow;
		}
	}
	else {
		if (this.x < widthBoundsLow){
			this.x = widthBoundsHigh;
		}
	}

	if (this.ySpeed > 0){
		if (this.y > heightBoundsHigh){
			this.y = heightBoundsLow;
		}
	}
	else {
		if (this.y < heightBoundsLow){
			this.y = height;
		}
	}
};

Astronaut.prototype.checkHoverState = function(){
	if (mouseX > (this.x - this.xWidth/2 - 10) && mouseX < (this.x + this.xWidth/2 + 10) &&
	mouseY > (this.y - this.yHeight/2 -10) && mouseY < (this.y + this.yHeight/2 + 10)){
		this.c = this.c_hover;
		this.hovered = true;
		return true;
	}
	else{
		this.c = this.c_random;
		this.hovered = false;
		return false;
	}
	/*
	//Alt approach - use the dist() method, works well with ellipses
	var mouseDist = dist(mouseX, mouseY, this.x, this.y);
	if (mouseDist < 100){
		this.c = this.c_hover;
		this.hovered = true;
		return true;
	}
	else{
		this.c = this.c_random;
		this.hovered = false;
		return false;
	}
	*/
};

Astronaut.prototype.clicked = function(){
	this.xSpeed *= -1;
	this.ySpeed *= -1;
};

