<template>
<div>
    <div class="gameArea">
        <div class="playerQueue">
            <div class="queueEntry">
                <h4>Next Player is:</h4>
            </div>
            <div class="queueEntry" v-for="player in this.playerQueue" :key="player.id">
                <p><span class="name">{{player.name}}</span> -- {{player.hand.length}} Cards</p>
            </div>
        </div>

        <div class="piles">
            <div class="cardPiles">
                <div class="activePile">
                    <div class="card" v-bind:class="this.activeCard.color">
                        <h3>{{this.capitalizeFirstLetter(activeCard.color)}}</h3>
                        <h2>{{activeCard.icon}}</h2>
                    </div>
                </div>
                <div class="drawPile">
                    <div class="card" v-on:click="drawNewCard()">
                        <h3>Draw Pile</h3>
                        <h2>Draw</h2>
                    </div>
                </div>
            </div>
        </div>

        <div class="notificationAreas">
            <div class="winArea otherArea" v-if="this.betweenTurns == true && this.isGameFinished == true">
                <h4 class="centerChildren">{{activePlayer.name}} wins the game!</h4>
                <button class="centerChildren" v-on:click="tearDownGame()">Click to Finish</button>
            </div>

            <div class="betweenTurnArea errorArea" v-if="this.betweenTurns == true && this.isGameFinished == false">
                <h4 class="centerChildren">{{playerQueue[0].name}}'s turn</h4>
                <button class="centerChildren" v-on:click="advanceTurn()">Click to Continue</button>
            </div>

            <div class="playerArea" v-if="this.betweenTurns == false">
                <div class="playerInfo">
                    <h3>{{this.activePlayer.name}}</h3>
                </div>
                <div class="activeCard" v-if="this.activePlayerActiveCard != null">
                    <div class="card" v-bind:class="this.activePlayerActiveCard.color">
                        <h3>{{capitalizeFirstLetter(activePlayerActiveCard.color)}}</h3>
                        <h2>{{activePlayerActiveCard.icon}}</h2>
                    </div>
                </div>
                <div class="activeButtons" v-if="this.activePlayerActiveCard != null">
                    <button v-on:click="playCard(activePlayerActiveCard)">Play this Card</button>
                </div>
            </div>

            <div class="errorArea" v-if="this.errorMessage != ''">
                <h4 class="centerChildren">{{this.errorMessage}}</h4>
                <div class="centerChildren" v-if="this.endEarly == false">
                    <button v-on:click="clearError()">Clear Message</button>
                </div>
                <div class="centerChildren" v-if="this.endEarly == true">
                    <button v-on:click="tearDownGame()">Quit Game</button>
                </div>
            </div>
        </div>

        <div class="cardArea" v-if="this.betweenTurns == false">
            <div class="playerCards">
                <div class="cards" v-for="card in this.activePlayer.hand" :key="card.id">
                    <div class="card" v-bind:class="card.color" v-on:click="setCardAsActive(card)">
                        <h3>{{capitalizeFirstLetter(card.color)}}</h3>
                        <h2>{{card.icon}}</h2>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
  created() {
        this.console.log("Setting up...");
        this.setUpForGame();
        this.console.log("Finished setting up!");
  },
  name: 'Browse',
  data() {
    return {
        playerQueue: [],
        drawPile: [],
        discardPile: [],
        activeCard: null, //this is a card object
        activePlayer: null, //this is a player object
        activePlayerActiveCard: null,
        newIdMaker: 1,
        gameIsSetUp: false,
        betweenTurns: false,
        isGameFinished: false,
        endEarly: false,
        errorMessage: '',
        //DB objects
        allPlayersList: [],
        allCardSets: [],
        allRuleSets: [],
        allCards: [],
        //Game objects
        gameObject: null,
        gamePlayers: null, //this.$root.$data.players
        gameStartingHand: 0, //this.$root.$data.startingCardNum
        multiDraw: false, //this.$root.$data.drawUntilMatch
    }
  },
  mounted() {
  },
  computed: {
    console: () => console,
  },
  methods: {
    async setUpForGame() {
        if (this.gameIsSetUp == false) {
            //Get the game
            await axios.get("http://localhost:3000/api/games").then(res => {this.gameObject = res.data.find(
                a => a.id == this.$route.params.gameId)});
            await axios.get("http://localhost:3000/api/players").then(res => {this.allPlayersList = res.data});
            await axios.get("http://localhost:3000/api/cardSets").then(res => {this.allCardSets = res.data});
            await axios.get("http://localhost:3000/api/ruleSets").then(res => {this.allRuleSets = res.data});
            await axios.get("http://localhost:3000/api/cards").then(res => {this.allCards = res.data});

            //Set up the game assets
            let allCards = this.allCardSets.find(a => a.id == this.gameObject.cardSetId);
            allCards = allCards.cards;
            console.log(allCards);
            this.gamePlayers = this.getGamePlayers();
            this.setGameSettingsFromRuleSet();

            //Set up draw pile
            allCards.forEach(card => {
                for (let i = 0; i < card.qty; i++) {
                    this.drawPile.push(this.convertCardsToNonQuantityFormat(card));
                }
            });

            

            //Set up player queue
            this.playerQueue.push.apply(this.playerQueue, this.gamePlayers);

            //Draw cards for each player
            let handSize = this.gameStartingHand;
            this.playerQueue.forEach(player => {
                for (let cardsDrawn = 0; cardsDrawn < handSize; cardsDrawn++) {
                    player.hand.push(this.drawRandomCard());
                }
            });

            //Set up the active objects
            this.activeCard = this.drawRandomCard();
            this.activePlayer = this.cycleThroughPlayers();
            console.log(this.activePlayer);
            this.gameIsSetUp = true;
        }
    },
    getGamePlayers() {
        let playersArray = [];
        for (let i = 0; i < this.gameObject.playerIds.length; i++) {
            playersArray.push(this.allPlayersList.find(a => a.id == this.gameObject.playerIds[i]));
        }
        return playersArray;
    },
    setGameSettingsFromRuleSet() {
        let ruleSet = this.allRuleSets.find(a => a.id == this.gameObject.ruleSetId);
        this.gameStartingHand = ruleSet.startingHandSize;
        this.multiDraw = ruleSet.drawUntilYouCanPlay;
    },
    drawRandomCard() {
        console.log(this.drawPile.length);
        console.log(this.discardPile.length);
        if (this.drawPile.length == 0 && this.discardPile.length == 0) {
            this.errorMessage = "We've run out of cards to draw. Whoops!";
            this.endEarly = true;
        }
        else if (this.drawPile.length == 0) {
            console.log("Shuffling...");
            this.drawPile.push.apply(this.drawPile, this.discardPile);
            this.discardPile = [];
        }
        console.log("Drawing Card");
        let randomValue = Math.floor(Math.random() * this.drawPile.length);
        let drawnCard = this.drawPile[randomValue];
        this.drawPile.splice(randomValue, 1); // remove from the draw pile
        console.log("Drew Card");
        return drawnCard;
    },
    cycleThroughPlayers() {
        let frontPlayer = this.playerQueue.splice(0,1);
        this.playerQueue = this.playerQueue.concat(frontPlayer);
        return frontPlayer[0];
    },
    convertCardsToNonQuantityFormat(oldCard) {
        let cardDetails = this.allCards.find(a => a.id == oldCard.cardId);
        console.log(cardDetails);
        let newCard = {
            id: this.newIdMaker,
            color: cardDetails.color,
            icon: cardDetails.symbol
        }
        this.newIdMaker = this.newIdMaker + 1;
        return newCard;
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    setCardAsActive(card) {
        this.activePlayerActiveCard = card;
        console.log(this.activePlayerActiveCard);
    },
    playCard(card) {
        if (this.activeCard.color == card.color || this.activeCard.icon == card.icon) {
            //add activeCard to the discard pile
            this.discardPile.push(this.activeCard);
            //set activeCard to card
            this.activeCard = card;
            //remove card from player's hand
            let index = this.activePlayer.hand.indexOf(card);
            this.activePlayer.hand.splice(index, 1);

            //TODO: CHECK TO SEE IF WE NEED TO END THE GAME HERE
            console.log(this.activePlayer.hand.length);
            if (this.activePlayer.hand.length == 0) {
                this.executeWinSequence();
            }

            //Check for custom card events
            if (this.isGameFinished == false) {
                this.checkForCustomEvents(card);
            }

            this.betweenTurns = true;
        }
        else {
            this.errorMessage = "Card color and/or icon do not match.";
        }
    },
    checkForCustomEvents(card) {
        if (card.icon == "Skip") {
            this.activePlayer = this.cycleThroughPlayers();
        }
        if (card.icon == "Back") {
            this.playerQueue.reverse();
            this.activePlayer = this.cycleThroughPlayers();
        }
        if (card.icon.includes("+")) {
            let icon = card.icon;
            let drawThisManyString = icon.slice(1);
            let drawThisMany = parseInt(drawThisManyString);
            for (let i = 0; i < drawThisMany; i++) {
                this.playerQueue[0].hand.push(this.drawRandomCard());
            }
        }

    },
    clearError() {
        this.errorMessage = '';
    },
    advanceTurn() {
        this.activePlayer = this.cycleThroughPlayers();
        this.activePlayerActiveCard = null;
        this.betweenTurns = false;
    },
    drawNewCard() {
        this.activePlayer.hand.push(this.drawRandomCard());
        if (this.multiDraw == false) {
            this.betweenTurns = true;
        }
    },
    executeWinSequence() {
        this.betweenTurns = true;
        this.isGameFinished = true;
        this.activePlayer.wins = this.activePlayer.wins + 1;
    },
    async tearDownGame() {
        this.playerQueue = [];
        this.drawPile = [];
        this.discardPile = [];
        this.activeCard = null; //this is a card object
        this.activePlayer = null; //this is a player object
        this.activePlayerActiveCard = null;
        this.newIdMaker = 1;
        this.gameIsSetUp = false;
        this.betweenTurns = false;
        this.isGameFinished = false;
        this.errorMessage = '';

        await axios.delete("http://localhost:3000/api/games/"+this.gameObject.id);
        this.$root.$data.inGame = false;
        this.$router.go(-1);
    }
  }
}
</script>

<style scoped>
.gameArea {
  display: inline;
  align-items: center;
  justify-content: center;
  font-family:Arial, Helvetica, sans-serif;
  width: auto;
}

.playerQueue {
    position: relative;
    float: right;
    background-color: #686868;
    width: 200px;
    padding: 5px;
    border-radius: 10px;
    margin-right: -50px;
}

.queueEntry {
    background-color: #a0a0a0;
    margin-top: 10px;
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 10px;
}

.name {
    font-weight:400;
    font-size: 18px;
}

.piles {
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 5px;
  margin-bottom: 50px;
}

.cardPiles {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 0px;
    margin-bottom: 50px;
    width: 250px;
    margin: auto;
}

.playerCards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 0px;
  margin-bottom: 50px;
}

.notificationAreas {
    display: grid;
    grid-template-columns: 1fr;
    grid-column-gap: 0px;
    margin-bottom: 50px;
    width: 450px;
    margin: auto;
    background-color:#b9b8a5;
}

.playerArea {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: 0px;
    margin-bottom: 50px;
    width: 450px;
    margin: auto;
    background-color:#b9b8a5;
    text-align: center;
}

.errorArea {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 0px;
    margin-bottom: 50px;
    width: 450px;
    margin: auto;
    background-color:#b9b8a5;
    align-content: center;
}

.centerChildren {
    margin: auto;
    padding-left: 10px;
    padding-right: 10px;
}

.betweenTurnArea {
    padding: 10px;
}

.playerInfo {
    margin: auto;
}

.cardPiles {
    display: grid;
}

.card {
  margin: 5px;
  width: 100px;
}

.card {
  background: #c2c2c2;
  padding: 10px 10px;
  height: 120px;
  text-align: center;
}

.card h2 {
  margin: 5px;
}

.card h3 {
  font-size: 14px;
  margin: 5px;
}

.card p {
  margin-top: 25px;
  font-size: 10px;
}

button {
  height: 35px;
  font-size: 16px;
  background: #3b3b3b;
  color: white;
  border: none;
  border-radius: 5px;
  margin-top: 50px;
  margin-bottom: 10px;
}

.auto {
  margin-left: auto;
}
</style>