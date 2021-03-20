<template>
<div class="wrapper">
  <h2> Add/Remove Players: </h2>
  <p>Here you can add and remove players that will be in the game.</p>
  <p>You can currently have a max of {{this.$root.$data.maxPlayers}} players.</p>
  <h4 v-if="this.errorMessage != ''">{{errorMessage}}</h4>
  <h3>Create New Player:</h3>
  <div class="addPlayer">
    <div class="addPlayerField">
        <p>Player Name:</p>
        <input v-model="playerName" placeholder="Ex: I dunno, pick a name">
    </div>
  </div>
  <button v-on:click="addPlayer()">Submit</button>
  <button v-if="this.errorMessage != ''" v-on:click="clearError()">Clear Error</button>

  <div v-if="this.$root.$data.totalPlayers != 0">
    <PlayerList :players="allPlayers" />
  </div>
  <div v-else>
      <h3> No players </h3>
  </div>
  <div class='footer'>
    <a href='https://github.com/Cheeseman1010/Web-Uno'>Github Link</a>   |   
    Web Uno
  </div>
</div>
</template>

<script>
import PlayerList from "../components/PlayerList.vue"
export default {
  name: 'Browse',
  components: {
    PlayerList
  },
  data() {
    return {
        playerName: '',
        errorMessage: ''
    }
  },
  computed: {
    allPlayers() {
      return this.$root.$data.players;
    }
  },
  methods: {
    addPlayer() {
        //Add player
        if (this.$root.$data.totalPlayers < this.$root.$data.maxPlayers) {
            let newPlayer = {
                id: this.$root.$data.playerIndex,
                name: this.playerName,
                wins: 0,
                hand: []
            }
            let nameFilter = this.$root.$data.players.filter(a => a.name === newPlayer.name);
            if (nameFilter.length == 0) {
                this.$root.$data.players.push(newPlayer);
                this.$root.$data.playerIndex = this.$root.$data.playerIndex + 1; 
                this.$root.$data.totalPlayers = this.$root.$data.totalPlayers + 1;
                this.playerName = "";
            }
            else {
                this.errorMessage = "A player already exists with this name.";
            }
        }
        else {
            this.errorMessage = "You cannot add any more players. Either edit your rules around startingCardNumber, or add more cards.";
        }
    },
    clearError() {
        this.errorMessage = '';
    }
  }
}
</script>

<style scoped>
.wrapper {
    width: 650px;
    margin: auto;
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

h4 {
  color: #aa0000;
  font-style: italic;
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
  font-family:Arial, Helvetica, sans-serif
}

.addPlayer {
  display: grid;
  grid-template-columns: 1fr;
  grid-column-gap: 5px;
  margin-bottom: 10px;
}

.addPlayerField p {
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
}
</style>