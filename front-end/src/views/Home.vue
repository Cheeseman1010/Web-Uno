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
      <div v-if="this.$root.$data.user != null">
        <h4 v-if="this.errorMessage != ''">{{errorMessage}}</h4>
        <button v-on:click="startGame()">Go to Games</button>
        <button v-if="this.errorMessage != ''" v-on:click="clearError()">Clear Error</button>
      </div>
      <div v-else>
        <h3>To access games, login or register</h3>
        <button v-on:click="login()">Login</button>
        <button v-on:click="register()">Register</button>
      </div>
    <div class='footer'>
    <a href='https://github.com/Cheeseman1010/Web-Uno'>Github Link</a>   |   
    Web Uno (14ish hours)
  </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  name: 'Browse',
  data() {
    return {
        errorMessage: ''
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
  methods: {
    clearError() {
        this.errorMessage = '';
    },
    startGame() {
      this.$router.push("games");
    },
    async setUpData() {
      let cardResults = await axios.get("http://localhost:3000/api/cards");

      if (cardResults.data.length == 0) {
      try {
      //cards table
      let cardsArray = this.$root.$data.cards;
      for (let i = 0; i < cardsArray.length; i++) {
        let card = {
          color: cardsArray[i].color,
          symbol: cardsArray[i].icon,
          id: cardsArray[i].id
        }
        //Add all cards to cards
        console.log("Adding Card");
        await axios.post("http://localhost:3000/api/cards", card);
      }

      //ruleSets table
      let ruleSet = {
        startingHandSize: this.$root.$data.startingCardNum,
        drawUntilYouCanPlay: this.$root.$data.drawUntilMatch,
        name: "Default Rules",
        id: 1
      }
      //Add the default ruleSet
      console.log("Adding RuleSet");
      await axios.post("http://localhost:3000/api/ruleSets", ruleSet);

      //players table

      //TabCardSets
      let cardArray = [];
      for (let i = 0; i < cardsArray.length; i++) {
        let cardDetails = {
          qty: cardsArray[i].quantity,
          cardId: cardsArray[i].id
        }
        cardArray.push(cardDetails);
      }
      let cardSet = {
        name: "Default Set",
        cards: cardArray,
        id: 1
      }
      //Add the default cardSet
      console.log("Adding CardSet");
      await axios.post("http://localhost:3000/api/cardSets", cardSet);

      //TabGames
      // No data should be here initially

      } catch (error) {
        console.log(error);
      }
    }
    },
    login() {
      this.$router.push("login");
    },
    register() {
      this.$router.push("login");
    }
  },
  beforeMount(){
    this.setUpData()
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
