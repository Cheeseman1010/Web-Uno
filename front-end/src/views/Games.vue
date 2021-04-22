<template>
<div class="wrapper">
  <h2>Games Page</h2>
  <p>I had this really cool idea where you could play with others, each with their own computer.
    Turns out that's really complicated and something you should look into after you get auth stuff working.</p>
  <p>You can still play locally though!</p>
  <h2> Open Games: </h2>
  <div>
    <div class="sets">
      <div class="set" v-for="game in openGames" :key="game.id">
        <div class="gameEntry">
          <h3>{{game.gameName}}</h3>
          <p>Max Players: {{getMaxPlayersForGame(game)}}</p>
          <p>Current Players: {{getPlayersForGame(game).length}}</p>
          <p>Using "{{getCardSetForGame(game).name}}" cards</p>
          <p>Starting Hand Size: {{getRuleSetForGame(game).startingHandSize}}</p>
          <p>Multi-Draw? {{getRuleSetForGame(game).drawUntilYouCanPlay}}</p>
          <p v-if="getPlayersForGame(game).length < getMaxPlayersForGame(game)">
              <button class="auto" @click="joinGame(game)">Join Game</button>
          </p>
        </div>
      </div>
      <div class="info">
          <h3>Create New Game</h3>
          <p><button class="auto" @click="setUpNewGame()">Create New</button></p>
      </div>
    </div>
  </div>

  <div v-if="creatingNewGame == true">
    <div class="gameSetup">
        <div class="gameFields">
            <div class="gameOption">
                <h3>Select Your Set of Cards:</h3>
                <select v-model="cardSet" @change="getCardSet()">
                  <template v-for="set in allCardSets">
                    <option v-bind:key="set.id">{{set.name}}</option>
                  </template>
                </select>
            </div>
            <div class="gameOption">
              <h3>Select Your Set of Rules:</h3>
                <select v-model="ruleSet" @change="getRuleSet()">
                  <template v-for="set in allRuleSets">
                    <option v-bind:key="set.id">{{set.name}}</option>
                  </template>
                </select>
            </div>
            <div class="gameOption">
              <h3>Game Name:</h3>
              <input v-model="gameName" placeholder="Set name here">
            </div>
        </div>
        <div class="gamePlayers">
            <h3>Players: {{this.currentPlayers.length}}/{{maxPlayersBasedOnSettings}}</h3>
            <p id="chosenPlayers"></p>
            <button class="auto" @click="startGame()">Start Game</button>
            <h3 v-if="this.errorMessage != ''">{{errorMessage}}</h3>
            <button v-if="this.errorMessage != ''" v-on:click="clearError()">Clear Error</button>
            <div class="players">
                <div class="player" v-for="player in allPlayers" :key="player.id">
                    <div class="info" v-if="player.inGame == false">
                        <h3>{{player.name}}</h3>
                        <h4>Wins: {{player.wins}}</h4>
                        <div v-if="player.isActive == false || player.isActive == null">
                          <p><button class="auto" @click="addPlayer(player)">Add to Game</button></p>
                        </div>
                        <div v-else>
                          <p><button class="auto" @click="removePlayer(player)">Remove from Game</button></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
  <div class='footer'>
    <a href='https://github.com/Cheeseman1010/Web-Uno'>Github Link</a>   |   
    Web Uno (14ish hours)
  </div>
</div>
</template>

<script>
import axios from 'axios';
//import CardList from "../components/EditCardList.vue"
export default {
  name: 'Cards',
  components: {
    //CardList
  },
  data() {
    return {
      openGamesList: [],
      allPlayersList: [],
      allCardSets: [],
      allRuleSets: [],
      errorMessage: '',
      creatingNewGame: false,
      currentPlayers: [],
      currentGameOptions: {
        //settings
          currentCardSet: null,
          currentCardSetName: "",
          currentRuleSet: null,
        //players
          selectedPlayers: [],
          maxPlayers: 0,
      },
      cardSet: {},
      ruleSet: {},
      gameName: '',
    }
  },
  async created() {
    /*try {
      let response = await axios.get('http://localhost:3000/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }*/
  },
  mounted() {
    axios.get("http://localhost:3000/api/games").then(res => {this.openGamesList = res.data});
    axios.get("http://localhost:3000/api/players").then(res => {this.allPlayersList = res.data});
    axios.get("http://localhost:3000/api/cardSets").then(res => {this.allCardSets = res.data});
    axios.get("http://localhost:3000/api/ruleSets").then(res => {this.allRuleSets = res.data});
  },
  computed: {
    openGames() {
        return this.openGamesList;
    },
    allPlayers() {
        return this.allPlayersList;
    },
    currentGameSetup() {
        return this.currentGameOptions;
    },
    maxPlayersBasedOnSettings() {
        if (this.currentGameOptions.currentCardSet == null ||
        this.currentGameOptions.currentRuleSet == null) {
          return 0;
        } 
        else {
          // Get total cards, divide in half.
          let maxPlay = Math.floor(this.currentGameOptions.currentCardSet[0].cards.length / 2);
          // Divide by starting card number
          maxPlay = Math.floor(maxPlay / this.currentGameOptions.currentRuleSet[0].startingHandSize);
          return maxPlay;
        }
    }
  },
  methods: {
    clearError() {
        this.errorMessage = '';
    },
    setUpNewGame() {
        this.creatingNewGame = true;
    },
    getMaxPlayersBasedOnSettings() {
        if (this.currentGameOptions.currentCardSet == null ||
        this.currentGameOptions.currentRuleSet == null) this.currentGameOptions.maxPlayers = 0;
        else {
          // Get total cards, divide in half.
          let maxPlay = Math.floor(this.currentGameOptions.currentCardSet[0].cards.length / 2);
          // Divide by starting card number
          maxPlay = Math.floor(maxPlay / this.currentGameOptions.currentRuleSet[0].startingHandSize);
          this.currentGameOptions.maxPlayers = maxPlay;
        }
    },
    addPlayer(player) {
        player.isActive = true;
        this.currentPlayers.push(player);
        this.getMaxPlayersBasedOnSettings();
    },
    removePlayer(player) {
        player.isActive = false;
        let index = this.currentPlayers.find(a => a.name == player.name);
        this.currentPlayers.splice(index, 1);
        this.getMaxPlayersBasedOnSettings();
    },
    hasPlayerBeenAdded(player) {
      console.log(player.name + " checking add");
        let result = this.currentPlayers.find(a => a.name == player.name);
        console.log(result);
        if (result == null) return false;
        else return true;
    },
    getCardSet() {
        console.log("getCardSet");
        this.currentGameOptions.currentCardSet = this.allCardSets.filter(
          a => a.name == this.cardSet);
    },
    getRuleSet() {
        console.log("getRuleSet");
        this.currentGameOptions.currentRuleSet = this.allRuleSets.filter(
          a => a.name == this.ruleSet);
    },
    getActivePlayerIds() {
        let ids = [];
        this.currentPlayers.forEach(element => ids.push(element.id));
        return ids;
    },
    getUnusedGameId() {
        let idsArray = [];
        for(let i=0; i < this.openGamesList.length; i++) {
          idsArray.push(this.openGamesList[i].id);
        }
        let gameId = 1;
        if (idsArray.length != 0) gameId = Math.max(...idsArray) + 1;
        return gameId;
    },
    async startGame() {
        if (this.currentPlayers.length > this.currentGameOptions.maxPlayers) {
            this.errorMessage = "You currently have more players than the rules allow. Either add more cards, or changes the game rules.";
        }
        else if (this.currentPlayers.length == 0) {
            this.errorMessage = "You can't play a game with no players, you silly goose. Go add some.";
        }
        else {
          this.$root.$data.inGame = true;
          //Create new game and push to DB
          let newGame = {
              gameName: this.gameName,
              playerIds: this.getActivePlayerIds(),
              cardSetId: this.currentGameOptions.currentCardSet[0].id,
              ruleSetId: this.currentGameOptions.currentRuleSet[0].id,
              acceptingPlayers: false,
              id: this.getUnusedGameId(),
          };
          console.log(this.getUnusedGameId());
          console.log(newGame.id);
          await axios.post("http://localhost:3000/api/games", newGame);
          this.$router.push({name: 'Game', params: { gameId: newGame.id }});
        }
    },
    //open game functions
    getMaxPlayersForGame(game) {
        let gameCardSet = this.getCardSetForGame(game);
        let gameRuleSet = this.getRuleSetForGame(game);
        // Get total cards, divide in half.
        let maxPlay = Math.floor(gameCardSet.cards.length / 2);
        // Divide by starting card number
        maxPlay = Math.floor(maxPlay / gameRuleSet.startingHandSize);
        return maxPlay;
    },
    getPlayersForGame(game) {
        let gamePlayers = [];
        for (let i = 0; i < game.playerIds.length; i++) {
            gamePlayers.push(this.allPlayersList.find(a => a.id == game.playerIds[i]));
        }
        return gamePlayers;
    },
    getCardSetForGame(game) {
        return this.allCardSets.find(a => a.id == game.cardSetId);
    },
    getRuleSetForGame(game) {
        return this.allRuleSets.find(a => a.id == game.ruleSetId);
    },
    joinGame(game) {
      if (game != null) console.log("the not having unused vars error can be really annoying some times.")
      console.log("not implemented");
    }
  }
}
</script>

<style scoped>
.wrapper {
    width: 650px;
    margin: auto;
}

.buttonSwitches {
  display: flex;
  align-items: center;
  justify-content: center;
}

.buttonSwitches > button {
  margin: 10px;
  margin-bottom: 0px;
  font-size: 14px;
}

h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:Arial, Helvetica, sans-serif
}

h3 {
  font-style: normal;
  display: flex;
  align-items: center;
  justify-content: left;
  font-family:Arial, Helvetica, sans-serif;
  margin-bottom: 5px;
}

p {
  font-style: italic;  
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:Arial, Helvetica, sans-serif;
}

.addCard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 5px;
  margin-bottom: 10px;
}

.addCardField p {
  font-style: normal;  
  display: flex;
  align-items: center;
  justify-content: left;
  font-family:Arial, Helvetica, sans-serif;
  margin: 5px;
}

button {
  height: 20px;
  background: #3b3b3b;
  color: white;
  border: none;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: left;
  margin-bottom: 5px;
  margin-top: 5px;
}



.cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-column-gap: 5px;
  margin-bottom: 50px;
}

.card {
  margin: 10px;
  width: 100px;
}

.info {
  background: #c2c2c2;
  padding: 10px 10px;
  height: 120px;
  text-align: center;
}

.info > h2 {
  margin: 5px;
}

.info > h3 {
  justify-content: center;
  font-size: 14px;
  margin: 5px;
}

.info > h4 {
  color: #8f7d30;
  font-size: 14px;
  margin: 5px;
  font-family:Arial, Helvetica, sans-serif;
}

.info > p {
  margin-top: 25px;
  font-size: 10px;
  font-style: normal;
}

.info > p > button {
  height: 20px;
  background: #3b3b3b;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 5px;
  margin-bottom: 0px;
  margin-top: 0px;
}

.sets {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 5px;
  margin-bottom: 50px;
}

.set {
  margin: 10px;
  width: 200px;
}

.players {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 5px;
  margin-bottom: 50px;
}

.player {
  margin: 10px;
  width: 200px;
}


.gameEntry {
  background: #c2c2c2;
  padding: 10px 10px;
  height: 250px;
  text-align: left;
}

.gameEntry > h2 {
  margin: 5px;
}

.gameEntry > h3 {
  justify-content: center;
  font-size: 14px;
  margin: 5px;
}

.gameEntry > h4 {
  color: #8f7d30;
  font-size: 14px;
  margin: 5px;
  font-family:Arial, Helvetica, sans-serif;
}

.gameEntry > p {
  margin-top: 5px;
  font-size: 14px;
  font-style: normal;
}

.gameEntry > p > button {
  height: 20px;
  background: #3b3b3b;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 5px;
  margin-bottom: 0px;
  margin-top: 0px;
}

</style>