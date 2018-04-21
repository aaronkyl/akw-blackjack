function Card(suit, name, value) {
    this.suit = suit;
    this.name = name;
    this.value = value;
    
    this.drawCardImage = function() {
        return `<img class="card" src="img/${this.name}_of_${this.suit}.png" alt="${this.name} of ${this.suit}">`;
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
            that.cards.push(new Card(suit, name, value+1));
        });
    });
    console.log(this.cards);
    
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
}

function Hand(id) {
    this.id = id;
    this.cards = [];
    this.value = 0;
    this.bust = false;
    var that = this;
    
    this.drawCard = function(deck) {
        // get card
        let card = deck.cards.splice(that.cards.length - 1, 1)[0];
        // add card to hand
        that.cards.push(card);
        // add card to displayed hand on table
        $(`#${that.id}-hand`).append(card.drawCardImage());
        return;
    };
    
    this.checkBust = function() {
        console.log("checkBust: ", that.value);
        if (that.value > 21) {
            $("#messages").text(`${that.id.toUpperCase()} BUSTS!`);
            $(`#${that.id}-points`).css("color", "#F00");
            console.log("BUST")
            that.bust = true;
        }
        return;
    };
    
    this.calculatePoints = function() {
        that.value = that.cards.reduce(function(sum, cur) {
            return sum + cur.value;
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
    
    var handWon = function() {
        $("#hit-button").dither();
        $("#stand-button").dither();
        $("#deal-button").undither();
    };
    
    var dealerWon = function() {
        return (playersTurn && player.bust) || dealer.value == 21 || (!playersTurn && !dealer.bust && dealer.value > player.value);
    };
    
    var playerWon = function() {
        return dealer.bust || player.value == 21 || (!playersTurn && dealer.value > 17 && player.value > dealer.value);
    };
    
    var checkForWinner = function() {
        let winner = false;
        if (dealerWon()) {
            winner = dealer;
        } else if (playerWon()) {
            winner = player;
        } else {
            return winner;
        }
        $('#messages').text(`${winner.id.toUpperCase()} WON!`);
        handWon();
        return;
    };
    
    // clear hands and deal a hand of two cards each to player and dealer
    $('#deal-button').click(function() {
        $(".hand").empty();
        $(".points").css("color", "");
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
        while(dealer.value < 17 || dealer.value <= player.value) {
            dealer.drawCard(deck);
            dealer.calculatePoints();
            checkForWinner();
        }
    });
})