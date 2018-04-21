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
    
// ******this is broken?
    // initialize deck with 52 cards
    this.suits.forEach(function(suit) {
        that.names.forEach(function(name, value) {
            that.cards.push(new Card(suit, name, value+1));
        });
    });
    
    this.shuffle = function() {
        for (var i = 0, l = that.cards.length; i < 1000; i++) {
            let card1Index = Math.floor(Math.random() * (l + 1));
            let card2Index = Math.floor(Math.random() * (l + 1));
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
    
    this.calculatePoints = function() {
        let total = that.cards.reduce(function(sum, cur) {
            return sum + cur.value;
        }, 0);
        // update hand total with new card value
        $(`#${that.id}-points`).text(total);
        return;
    };
}

$(document).ready(function() {
    // initialize game
    var deck = new Deck();
    console.log(deck.cards);
    deck.shuffle();
    console.log("shuffled", deck.cards);
    var dealer = new Hand("dealer");
    var player = new Hand("player");
    
    // clear hands and deal a hand of two cards each to player and dealer
    $('#deal-button').click(function() {
        $(".hand").empty();
        [player, dealer].forEach(function(e) {
            // clear hand
            e.cards = [];
            // deal two cards
            for(var i = 0; i < 2; i++) {
                e.drawCard(deck);
            }
            e.calculatePoints();
        });
    });
    
    // hit - deal one card to player
    $('#hit-button').click(function() {
        player.drawCard(deck);
        player.calculatePoints();
    });
})