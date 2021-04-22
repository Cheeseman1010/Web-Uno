<template>
<div class="wrapper">
  <h2> Add/Remove Players: </h2>
  <p>Here you can add and remove players that can be in games.</p>
  <!--<p>You can currently have a max of {{this.$root.$data.maxPlayers}} players.</p>-->
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

  <div v-if="this.allPlayersList.length != 0">
    <div class="players">
    <div class="player" v-for="player in allPlayers" :key="player.id">
      <div class="info">
        <h3>{{player.name}}</h3>
        <h4>Wins: {{player.wins}}</h4>
        <button class="auto" @click="deletePlayer(player)">Delete Player</button>
      </div>
    </div>
    </div>
  </div>
  <div v-else>
      <h3> No players </h3>
  </div>
  <div class='footer'>
    <a href='https://github.com/Cheeseman1010/Web-Uno'>Github Link</a>   |   
    Web Uno (14ish hours)
  </div>
</div>
</template>

<script>
import axios from 'axios';
//import PlayerList from "../components/PlayerList.vue"
export default {
  name: 'Browse',
  components: {
  //  PlayerList
  },
  data() {
    return {
      playerName: '',
      errorMessage: '',
      allPlayersList: []
    }
  },
  mounted() {
    axios.get("http://localhost:3000/api/players").then(res => {this.allPlayersList = res.data});
  },
  async created() {
    /*try {
      let response = await axios.get('http://localhost:3000/api/users');
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }*/
  },
  computed: {
    allPlayers() {
      return this.allPlayersList;
    }
  },
  methods: {
    async addPlayer() {
      let response = await axios.get("http://localhost:3000/api/players");
      let responseData = response.data;
      console.log(responseData);

      let idsArray = [];
      for(let i=0; i < responseData.length; i++) {
        idsArray.push(responseData[i].id);
      }
      let playerId = 1;
      if (idsArray.length != 0) playerId = Math.max(...idsArray) + 1;

      //Add player
      let newPlayer = {
        id: playerId,
        name: this.playerName,
        wins: 0,
        hand: [],
        inGame: false
      }
      let nameFilter = responseData.filter(a => a.name === newPlayer.name);
      if (nameFilter.length == 0) {
        await axios.post("http://localhost:3000/api/players", newPlayer);
        this.playerName = "";
        this.allPlayersList.push(newPlayer);
      }
      else {
        this.errorMessage = "A player already exists with this name.";
      }
    },
    clearError() {
        this.errorMessage = '';
    },
    async deletePlayer(player) {
        await axios.delete("http://localhost:3000/api/players/"+player.id);      
        let index = this.allPlayersList.indexOf(player);
        this.allPlayersList.splice(index, 1);
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

.info {
  background: #c2c2c2;
  padding: 10px 10px;
  height: 100px;
  text-align: center;
}

.info > h3 {
  font-size: 14px;
  margin: 5px;
}

.info > h4 {
  color: #8f7d30;
  font-size: 14px;
  margin: 5px;
}

.info > p {
  margin-top: 25px;
  font-size: 10px;
}

.info > button {
  height: 25px;
  background: #360000;
  color: rgb(197, 57, 57);
  border: none;
  border-radius: 5px;
}

.auto {
  margin-left: auto;
}
</style>