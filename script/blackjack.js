function Card(suit, name, value) {
    this.suit = suit;
    this.name = name;
    this.value = value;
    this.faceup = true;
    
    this.imageSRC = function() {
        if (this.faceup) {
            return `img/${this.name}_of_${this.suit}.png`;
        } else {
            return "img/card_back.svg";
        }
    };
    
    this.drawCardImage = function() {
        if (this.faceup) {
            return `<img class="card" src="${this.imageSRC()}" alt="${this.name} of ${this.suit}">`;
        } else {
            return `<img class="card" src="${this.imageSRC()}" alt="Unrevealed card">`;
        }
        
    };
}

function Deck() {
    this.suits = ["hearts", "spades", "diamonds", "clubs"];
    this.names = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
    this.cards = [];
    var that = this;
    
    // initialize deck with 52 cards
    this.suits.forEach(function(suit) {
        that.names.forEach(function(name, value) {
            if (!isNaN(name)) {
                that.cards.push(new Card(suit, name, value+1));
            } else if (name == "ace") {
                that.cards.push(new Card(suit, name, 11));
                that.cards[that.cards.length-1].aceIsOne = function() {
                    this.value = 1;
                    return;
                };
            } else {
                that.cards.push(new Card(suit, name, 10));
            }
        });
    });
    
    this.shuffle = function() {
        for (var i = 0, l = that.cards.length; i < 1000; i++) {
            let card1Index = Math.floor(Math.random() * l);
            let card2Index = Math.floor(Math.random() * l);
            let temp = that.cards[card1Index];
            that.cards[card1Index] = that.cards[card2Index];
            that.cards[card2Index] = temp;
        }
        return;
    };
    
    this.isEmpty = function() {
        return !this.cards.length;
    };
}

function Hand(id) {
    this.id = id;
    this.cards = [];
    this.value = 0;
    this.wins = 0;
    this.bust = false;
    var that = this;
    
    this.drawCard = function(deck, faceup = true) {
        if (deck.isEmpty()) {
            // modal about deck being empty, start new game?
            console.log("deck empty");
        }
        // get card
        let card = deck.cards.splice(that.cards.length - 1, 1)[0];
        if (this.id == "dealer" && this.cards.length == 0) {
            card.faceup = false;
        }
        // add card to hand
        that.cards.push(card);
        // add card to displayed hand on table
        $(`#${that.id}-hand`).append(card.drawCardImage());
        return;
    };
    
    this.checkBust = function() {
        if (that.value > 21) {
            let ace11InHand = that.cards.findIndex(c => c.name == "ace" && c.value == 11);
            if (ace11InHand + 1) {
                that.cards[ace11InHand].aceIsOne();
                that.calculatePoints();
                return that.checkBust();
            }
            $("#messages").text(`${that.id.toUpperCase()} BUSTS!`);
            $(`#${that.id}-points`).css("color", "#F00");
            that.bust = true;
            return true;
        }
        return false;
    };
    
    this.calculatePoints = function() {
        let shownPoints = that.cards.map(function(card) {
            if (card.faceup) {
                return card.value;
            } else {
                return 0;
            }
        });
        that.value = shownPoints.reduce(function(sum, cur) {
            return sum + cur;
        }, 0);
        // update displayed hand total with new total
        $(`#${that.id}-points`).text(that.value);
        that.checkBust();
        return;
    };
}

$(document).ready(function() {
    // initialize game
    var deck = new Deck();
    deck.shuffle();
    var dealer = new Hand("dealer");
    var player = new Hand("player");
    var playersTurn = true;
    $("#hit-button").dither();
    $("#stand-button").dither();
    $("#deal-button").undither();
    [player, dealer].forEach(function(e) {
        $(`#${e.id}-wins`).text(`${e.wins}`);
    });
    
    var handWon = function(winner) {
        winner.wins++;
        $("#hit-button").dither();
        $("#stand-button").dither();
        $("#deal-button").undither();
    };
    
    var dealerWon = function() {
        return (playersTurn && player.bust) || dealer.value == 21 || (!playersTurn && !dealer.bust && dealer.value > player.value);
    };
    
    var playerWon = function() {
        return dealer.bust || player.value == 21 || (!playersTurn && dealer.value >= 17 && player.value > dealer.value);
    };
    
    var checkForWinner = function() {
        let winner = false;
        if (dealerWon()) {
            winner = dealer;
        } else if (playerWon()) {
            winner = player;
        } else if (!playersTurn && player.value == dealer.value) {
            $('#messages').text("DRAW");
            $("#hit-button").dither();
            $("#stand-button").dither();
            $("#deal-button").undither();
            return true;
        } else {
            return winner;
        }
        $('#messages').text(`${winner.id.toUpperCase()} WON!`);
        handWon(winner);
        $(`#${winner.id}-wins`).text(`${winner.wins}`);
        return;
    };
    
    // clear hands and deal a hand of two cards each to player and dealer
    $('#deal-button').click(function() {
        // reset table for next hand
        $(".hand").empty();
        $(".points").css("color", "");
        $(".points").empty();
        $("#messages").empty();
        playersTurn = true;
        $("#hit-button").undither();
        $("#stand-button").undither();
        $("#deal-button").dither();
        
        [player, dealer].forEach(function(e) {
            // clear hand
            e.cards = [];
            e.bust = false;
            // deal two cards
            for(var i = 0; i < 2; i++) {
                e.drawCard(deck);
            }
            e.calculatePoints();
        });
        checkForWinner();
    });
    
    // hit - deal one card to player
    $('#hit-button').click(function() {
        player.drawCard(deck);
        player.calculatePoints();
        checkForWinner();
    });
    
    $('#stand-button').click(function() {
        playersTurn = false;
        // put code to replace first card image with revealed card here
        dealer.cards[0].faceup = true;
        $('#dealer-hand img:first-child').attr("src", dealer.cards[0].imageSRC());
        while((dealer.value <= player.value) && dealer.value < 17) {
            dealer.drawCard(deck);
            dealer.calculatePoints();
            // if(checkForWinner()) return;
        }
        checkForWinner();
    });
})