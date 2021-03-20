<template>
<div class="wrapper">
  <h2> Edit Cards: </h2>
  <p>Here you can add your own cards, edit how many of each card there is in the deck, and remove cards entirely. (Just set the quantity to 0)</p>
  <p>There's also a few special card types you can implement here using these formats:</p>
  <p>Skip Cards: Color: [color] -- Icon: Skip (case sensitive)</p>
  <p>Reverse Cards: Color: [color] -- Icon: Back (case sensitive)</p>
  <p>Draw +X Cards: Color: [color] -- Icon: +[how many you want to draw]</p>
  <p>Note: only use "+" for Draw +X cards</p>
  <h3>Create New Card:</h3>
  <div class="addCard">
    <div class="addCardField">
        <p>Card Color:</p>
        <input v-model="cardColor" placeholder="Ex: red, orange, purple, etc.">
    </div>
    <div class="addCardField">
        <p>Card Icon:</p>
        <input v-model="cardIcon" placeholder="Ex: 7, 15, L, etc.">
    </div>
  </div>
  <button v-on:click="addCard(cardColor, cardIcon)">Submit</button>
  <button v-on:click="removeAllCards()">Clear All</button>

  <div v-if="this.$root.$data.totalCards != 0">
    <CardList :cards="allCards" />
  </div>
  <div v-else>
      <h3> No cards </h3>
  </div>
  <div class='footer'>
    <a href='https://github.com/Cheeseman1010/Web-Uno'>Github Link</a>   |   
    Web Uno
  </div>
</div>
</template>

<script>
import CardList from "../components/EditCardList.vue"
export default {
  name: 'Browse',
  components: {
    CardList
  },
  data() {
    return {
      cardColor: '',
      cardIcon: ''
    }
  },
  computed: {
    allCards() {
      return this.$root.$data.cards;
    }
  },
  methods: {
    addCard(newColor, newIcon) {
        //Add card
        let newCard = {
            id: this.$root.$data.cardIndex,
            color: newColor.toLowerCase(),
            icon: newIcon,
            quantity: 1
        }
        let colorFilter = this.$root.$data.cards.filter(a => a.color === newCard.color);
        if (colorFilter.length > 0) {

            let numberFilter = colorFilter.filter(a => a.icon === newCard.icon);
            if (numberFilter.length > 0) {
                //add to quantity
                let index = this.$root.$data.cards.indexOf(numberFilter[0]);
                this.$root.$data.cards[index].quantity = this.$root.$data.cards[index].quantity + 1;
            }
            else {
                this.$root.$data.cards.push(newCard);
                this.$root.$data.cardIndex = this.$root.$data.cardIndex + 1; 
            }     
        }
        else {
            this.$root.$data.cards.push(newCard);
            this.$root.$data.cardIndex = this.$root.$data.cardIndex + 1; 
        }
        this.$root.$data.totalCards = this.$root.$data.totalCards + 1;
        this.cardColor = "";
        this.cardIcon = "";
        this.$root.$data.getMaxPlayers();
    },
    removeAllCards() {
        this.$root.$data.cards = [];
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

p {
  font-style: italic;  
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:Arial, Helvetica, sans-serif
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
}
</style>