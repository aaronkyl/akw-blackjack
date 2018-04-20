function Card(suit, name, value) {
    this.suit = suit;
    this.name = name;
    this.value = value;
    
    this.drawCardImage = function() {
        return '<img src="${this.name}_of_${this.suit}.png" alt="${this.name} of ${this.suit}">';
    };
}

function Deck() {
    this.suits = ["hearts", "spades", "diamonds", "clubs"];
    this.names = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    this.cards = [];
    var that = this;
    
    // initialize deck with 52 cards
    this.suits.forEach(function(suit) {
        that.names.forEach(function(name, value) {
            that.cards.push(new Card(suit, name, value+1));
        });
    });
    
    this.shuffle = function() {
        for (var i = 0; i < 1000; i++) {
            let card1Index = Math.floor(Math.random() * 53);
            let card2Index = Math.floor(Math.random() * 53);
            let temp = that.cards[card1Index];

            that.cards[card1Index] = that.cards[card2Index];
            that.cards[card2Index] = temp;
        }
    };
}

function Hand(id, deck) {
    this.id = id;
    this.cards = [];
    var that = this;
    
    this.drawCard = function(deck) {
        let cardIndex = Math.floor(Math.random() * 53);
        let card = deck.cards[cardIndex];
        deck.cards.splice(cardIndex, 1);
        that.cards.append(card);
    };
}

$(document).ready(function() {
    var deck = new Deck();
    var dealer = new Hand("dealer", deck);
    var player = new Hand("player", deck);
    
    console.log(dealer);
    console.log(player);
})