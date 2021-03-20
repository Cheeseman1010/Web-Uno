import Vue from 'vue'
import App from './App.vue'
import router from './router'
import startingCards from './defaultCards.js'

Vue.config.productionTip = false


let data = {
  //players
  players: [],
  totalPlayers: 0,
  maxPlayers: 6,
  playerIndex: 1,
  //cards
  cards: startingCards,
  totalCards: 104,
  cardIndex: 53,
  //rules
  startingCardNum: 7,
  drawUntilMatch: false,
  //game info
  inGame: false,
  isWin: false,
  //functions
  getMaxPlayers() {
    // Get total cards, divide in half.
    let maxPlay = Math.floor(this.totalCards / 2);
    // Divide by starting card number
    maxPlay = Math.floor(maxPlay / this.startingCardNum);
    this.maxPlayers = maxPlay;
  }
}

new Vue({
  router,
  data,
  render: h => h(App)
}).$mount('#app')
