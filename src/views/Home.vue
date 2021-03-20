<template>
  <div>
    <h2> About Web Uno: </h2>
    <p>Web Uno is a web-ified version of Uno with all the skips, reverses, and draw +X's you could want.
      What makes it stand out though is the ability to add your own cards using the "Card Options" feature, allowing for limitless
      color and value possibilities.
      They still behave like normal cards however, for instance Orange Dogs can only be played on other orange or dog cards.
    </p>
    <p>The editing doesn't end at the cards, you can also change up the rules using the exclusive "Custom Rules" feature on
      the site to fine tune (some) settings to find the perfect Uno game for you.
    </p>
    <h4 v-if="this.errorMessage != ''">{{errorMessage}}</h4>
    <button v-on:click="startGame()">Start Game</button>
    <button v-if="this.errorMessage != ''" v-on:click="clearError()">Clear Error</button>
    <div class='footer'>
    <a href='https://github.com/Cheeseman1010/Web-Uno'>Github Link</a>   |   
    Web Uno
  </div>
  </div>
</template>

<script>
export default {
  name: 'Browse',
  data() {
    return {
        errorMessage: ''
    }
  },
  methods: {
    clearError() {
        this.errorMessage = '';
    },
    startGame() {
      //Do checks here
      //Max Player check
      if (this.$root.$data.totalPlayers <= this.$root.$data.maxPlayers) {
        //Other checks?
        if (this.$root.$data.totalPlayers != 0) {
          this.$root.$data.inGame = true;
          this.$router.push("game");
        }
        else {
          this.errorMessage = "You can't play a game with no players, you silly goose. Go add some.";
        }
      }
      else {
        this.errorMessage = "You currently have more players than the rules allow. Either add more cards, or changes the game rules.";
      }
    }
  }
}
</script>

<style scoped>
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

button {
  height: 30px;
  font-size: 14px;
  background: #073f00;
  color: rgb(32, 216, 0);
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: left;
}
</style>
