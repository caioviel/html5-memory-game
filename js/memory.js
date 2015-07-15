function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


function MemoryGame(mainDivId, imagesArray, rows, repetitions) {
	console.log("MemoryGame.constructor()")

	this.mainDivId = mainDivId;
	this.imagesArray = imagesArray;
	if (!repetitions) {
		this.repetitions = 2
	} else {
		this.repetitions = repetitions;
	}

	if (!rows) {
		//var totalCards = this.repetitions * imageArray.length;
		//	var tryRows = 2;
		this.rows = 2;
	} else {
		this.rows = rows;
	}

	this.firstCardOpenned = undefined;
	this.secondCardOpenned = undefined;
	
};

MemoryGame.prototype.start = function() {
	this.mountTable();
	this.bindEvents();
};

MemoryGame.prototype.mountTable = function() {
	console.log("MemoryGame.createTable()");

	var totalCards = this.repetitions * this.imagesArray.length;
	var elementsByRow = totalCards / this.rows;
	this.positions = new Array(this.rows);
	for (var i = 0; i < this.rows; i++) {
		this.positions[i] = Array(elementsByRow);
		for (var j = 0; j < elementsByRow; j++) {
			var position = new CardPosition(this.mainDivId, i, j);
			this.positions[i][j] = position;
		}
	}
	console.log(this.positions);

	for (var i = 0; i < totalCards; i++) {
		var inserted = false;

		while (!inserted) {
			var indexI = getRandomInt(0, this.rows);
			var indexJ = getRandomInt(0, elementsByRow);
			var position = this.positions[indexI][indexJ];
			var cardKey = Math.floor(i/this.repetitions);

			if (position.card == undefined) {
				position.card  = new Card(position,
									this.imagesArray[cardKey],
									cardKey);
				inserted = true;
			}
		}
	}
};

MemoryGame.prototype.bindEvents = function() {
	$(document).on('click','.card_container', $.proxy(
		function(event) {
			this.openCard($(event.currentTarget).data("cardObject"));

		}, this));
};

MemoryGame.prototype.openCard = function(card) {
	console.log("MemoryGame.openCard()")

	if (this.firstCardOpenned == card) {
		return; //Double click on the same card
	}

	if (this.firstCardOpenned == undefined) {
		this.firstCardOpenned = card;
		card.open();
	} else if (this.secondCardOpenned == undefined) {
		this.secondCardOpenned = card;
		card.open();

		if (this.firstCardOpenned.key == this.secondCardOpenned.key) {
			this.rightMove();
		} else {
			this.wrongMove();
		}
	}
};

MemoryGame.prototype.rightMove = function() {
	console.log("MemoryGame.rightMove()");

	setTimeout($.proxy (
		function() {
			this.firstCardOpenned.hide();
			this.secondCardOpenned.hide();
		}, this), 
	1000);

	setTimeout($.proxy (
		function() {
			this.firstCardOpenned.close();
			this.secondCardOpenned.close();
			this.firstCardOpenned = undefined;
			this.secondCardOpenned = undefined;
		}, this), 
	1100);

};

MemoryGame.prototype.wrongMove = function() {
	console.log("MemoryGame.wrongMove()");

	setTimeout($.proxy (
		function() {
			this.firstCardOpenned.close();
			this.secondCardOpenned.close();
			this.firstCardOpenned = undefined;
			this.secondCardOpenned = undefined;
		}, this), 
	1000);
};

function CardPosition(mainDivId, i,j, angle) {
	console.log("CardPosition.constructor()")

	this.mainDivId = mainDivId;
	this.i = i;
	this.j = j;
	this.card = undefined;

	this.create();
};

CardPosition.prototype.create = function() {
	console.log("CardPosition.create()")
	this.divId = "pos_" + this.i + "x" + this.j;
	var innerHTML = "<div id='" + this.divId + "' class='card_container'></div>"
	this.divId = "#" + this.divId;

	$(this.mainDivId).append(innerHTML);
};

function Card(position, image, key) {
	console.log("Card.constructor()")

	this.position = position;
	this.image = image;
	this.key = key;

	this.create();
};

Card.prototype.create = function() {
	console.log("Card.create()")

	var innerHTML = "<div class='card' data-card='" + this.key + "'>\
		<div class='card-front card-face'></div>\
		<div class='card-back card-face'>\
			<img src='" + this.image + "' class='card-image'/>\
		</div>\
	</div>";

	$(this.position.divId).append(innerHTML);
	$(this.position.divId).data("cardObject", this);
};

Card.prototype.open = function() {
	console.log("Card.open()")

	$(this.position.divId).children('.card').addClass('active');
};

Card.prototype.hide = function() {
	console.log("Card.open()")

	$(this.position.divId).children('.card').css({
			'opacity':'0', 
			'cursor':'default'
		});
};

Card.prototype.close = function() {
	console.log("Card.open()")

	$(this.position.divId).children('.card').removeClass('active');
};