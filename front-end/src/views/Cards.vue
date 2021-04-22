<template>
<div class="wrapper">
  <h2> Card Options: </h2>
  <div class="buttonSwitches">
    <button v-on:click="switchToCardSets()">Edit Card Sets</button>
    <button v-on:click="switchToEditCards()">Edit Existing Cards</button>
  </div>
  <div v-if="editCards">
    <h2> Edit Cards: </h2>
    <p>Here you can add/remove your own cards, simple as that!</p>
    <p>To put the cards together in a deck, use the "Edit Card Sets" button.</p>
    <br>
    <h2>To create special cards use these formats:</h2>
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
    <button v-on:click="addNewCard(cardColor, cardIcon)">Submit</button>
    <!--<button v-on:click="removeAllCards()">Clear All</button>-->

    <div v-if="allCards.length != 0">
      <div class="editCards">
        <div class="cards">
          <div class="card" v-for="card in allCards" :key="card.id">
            <div class="info" v-bind:class="card.color">
              <h3>{{capitalizeFirstLetter(card.color)}}</h3>
              <h2>{{card.symbol}}</h2>
              <p><button class="auto" @click="removeCard(card)">Remove</button></p>
            </div>
          </div>
        </div>
      </div>
      <!-- <CardList v-bind:cards="allCards"/>  Used to be a thing, but was moved due to parent/child issues -->
    </div>
    <div v-else>
      <h3> No cards </h3>
    </div>
  </div>


  <div v-if="this.editCardSets">
    <h2> Edit Card Sets: </h2>
    <p>Here you can put together your own unique combinations of cards to create a deck for games.</p>
    <p>Note: Created decks are available for all users, not just locally.</p>
    <br>
    <h2>To create/edit a card set, just choose one below</h2>
    <p>Once you've selected a set, use the add button on a card to add it to the deck.
       After doing this you can use the plus and minus to increase or decrease the amount of that card in the deck.</p>
    <br>
    <h2>Card Sets:</h2>
    <div class="sets">
      <div class="set" v-for="set in allSets" :key="set.id">
        <div class="info">
          <h2>{{set.name}}</h2>
          <!-- <h3>Number of Cards: {{getSetQuantity(set)}}</h3> -->
          <p><button class="auto" @click="setCurrentSet(set)">Edit</button></p>
        </div>
      </div>
      <div class="info">
          <h2>+</h2>
          <p><button class="auto" @click="setUpForNewSet()">Create New</button></p>
      </div>
    </div>
    <div class="addCard">
      <div class="addCardField">
          <p>Set Name:</p>
          <input v-model="setName" placeholder="Set name here">
          <button v-on:click="saveSet(setName)">Save</button>
          <button v-on:click="deleteSet(setName)">Delete</button>
      </div>
    </div>
    <div v-if="displayCards == true">
      <div class="editCards">
        <div class="cards">
          <div class="card" v-for="card in allCardsForSet" :key="card.id">
            <div class="info" v-bind:class="card.color">
              <h3>{{capitalizeFirstLetter(card.color)}}</h3>
              <h2>{{card.symbol}}</h2>
              <div v-if="card.qty === 0">
                <p><button class="auto" @click="increaseQuantity(card)">Add</button></p>
              </div>
              <div v-else>
                <p><button class="auto" @click="reduceQuantity(card)">-</button>
                 {{card.qty}} 
                <button class="auto" @click="increaseQuantity(card)">+</button></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <CardList v-bind:cards="allCards"/>  Used to be a thing, but was moved due to parent/child issues -->
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
      editCardSets: false,
      editCards: true,
      totalCardsList: [],
      totalSetsList: [],
      currentCardsList: [],
      cardColor: '',
      cardIcon: '',
      setName: '',
      setId: 0,
      displayCards: false,
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
    axios.get("http://localhost:3000/api/cards").then(res => {this.totalCardsList = res.data});
    axios.get("http://localhost:3000/api/cardSets").then(res => {this.totalSetsList = res.data});
  },
  computed: {
    allCards() {
        return this.totalCardsList;
    },
    allSets() {
        return this.totalSetsList;
    },
    allCardsForSet() {
        return this.currentCardsList;
    }
  },
  methods: {
    async addNewCard(newColor, newIcon) {
        let response = await axios.get("http://localhost:3000/api/cards");
        let currentCards = response.data;
        
        //Add card
        let newCard = {
            id: this.$root.$data.totalCards,
            color: newColor.toLowerCase(),
            symbol: newIcon
        }
        
        let colorFilter = currentCards.filter(a => a.color === newCard.color);
        if (colorFilter.length > 0) {

            let numberFilter = colorFilter.filter(a => a.symbol === newCard.symbol);
            if (numberFilter.length > 0) {
                //ignore, since we no longer handle qty here
            }
            else {
                await axios.post("http://localhost:3000/api/cards", newCard);
                this.$root.$data.cardIndex = this.$root.$data.cardIndex + 1; 
            }     
        }
        else {
            await axios.post("http://localhost:3000/api/cards", newCard);
            this.$root.$data.cardIndex = this.$root.$data.cardIndex + 1;
        }

        this.$root.$data.totalCards = this.$root.$data.totalCards + 1;
        this.cardColor = "";
        this.cardIcon = "";
        //TODO: this needs to be reworked --- this.$root.$data.getMaxPlayers();
        //Refresh the card list after adding.
        axios.get("http://localhost:3000/api/cards").then(res => {this.totalCardsList = res.data});
    },
    removeAllCards() {
      console.log("deprecated");
        this.$root.$data.cards = [];
    },
    switchToCardSets() {
        this.editCardSets = true;
        this.editCards = false;
    },
    switchToEditCards() {
        this.editCardSets = false;
        this.editCards = true;
        this.currentCardsList = [];
    },
    //
    // EDIT CARDS METHODS
    //
    async removeCard(card) {
        await axios.delete("http://localhost:3000/api/cards/"+card.id);
        axios.get("http://localhost:3000/api/cards").then(res => {this.totalCardsList = res.data});
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    },
    //
    // EDIT CARDSETS METHODS
    //
    async getSetQuantity(set) {
      let response = await axios.get("http://localhost:3000/api/cardSets");
      let getData = response.data;
      let filteredSet = getData.filter(a => a.name === set.name);
      let totalQty = 0;
      for(let i=0; i < filteredSet.cards.length; i++) {
        totalQty += filteredSet[i].quantity;
      }
      return totalQty;
    },
    async setCurrentSet(set) {
      // set visiblity
      this.displayCards = true;
      // get all cards
      this.setName = set.name;
      this.setId = set.id;
      await axios.get("http://localhost:3000/api/cards").then(res => {this.currentCardsList = res.data});
      for(let i=0; i < this.currentCardsList.length; i++) {
        this.currentCardsList[i].qty = 0;
      }
      console.log(set);
      for(let i=0; i < set.cards.length; i++) {
        let currentId = set.cards[i].cardId;
        console.log(currentId);
        let currentQty = set.cards[i].qty;
        let foundIndex = this.currentCardsList.findIndex(a => a.id == currentId);
        if (foundIndex != -1) {
          this.currentCardsList[foundIndex].qty = currentQty;
          console.log(this.currentCardsList[foundIndex].qty);
        }
        else {
          this.currentCardsList[foundIndex].qty = 0;
        }
      }
      for(let i=0; i < this.currentCardsList.length; i++) {
        if (this.currentCardsList[i].qty == null) {
          this.currentCardsList[i].qty = 0;
        }
      }

      //perform a function that'll cause vue to reload the list
      let filler = {
        color: "filler",
        symbol: "filler",
        qty: 0,
        id: -2
      }
      this.currentCardsList.push(filler);
      this.currentCardsList.pop();
    },
    async setUpForNewSet() {
      // set visiblity
      this.displayCards = true;

      this.setName = "";
      this.setId = 0;
      await axios.get("http://localhost:3000/api/cards").then(res => {this.currentCardsList = res.data});
      for(let i=0; i < this.currentCardsList.length; i++) {
        this.currentCardsList[i].qty = 0;
      }

      //perform a function that'll cause vue to reload the list
      let filler = {
        color: "filler",
        symbol: "filler",
        qty: 0,
        id: -2
      }
      this.currentCardsList.push(filler);
      this.currentCardsList.pop();
    },
    reduceQuantity(card) {
        //this.$root.$data.totalCards = this.$root.$data.totalCards - 1;
        let index = this.currentCardsList.indexOf(card);
        let cardList = this.currentCardsList;
        cardList[index].qty = cardList[index].qty - 1;
        this.currentCardsList.splice(0, this.currentCardsList.length, ...cardList);
    },
    increaseQuantity(card) {
        let index = this.currentCardsList.indexOf(card);
        let cardList = this.currentCardsList;
        cardList[index].qty = cardList[index].qty + 1;
        this.currentCardsList.splice(0, this.currentCardsList.length, ...cardList);
    },
    async saveCardsListToDataBase() {
        let cardsArray = this.createCardsArray();
        let cardSetRequest = {
          cards: cardsArray,
          id: this.setId,
          name: this.setName
        }
        await axios.put("http://localhost:3000/api/cardSets/"+this.setId, cardSetRequest);
        return cardSetRequest;
    },
    async saveNewCardsListToDataBase() {
        let cardsArray = this.createCardsArray();
        let cardSetRequest = {
          cards: cardsArray,
          id: this.setId,
          name: this.setName
        }
        await axios.post("http://localhost:3000/api/cardSets", cardSetRequest);
        return cardSetRequest;
    },
    createCardsArray() {
        let cardsArray = [];
        for(let i=0; i < this.currentCardsList.length; i++) {
          if(this.currentCardsList[i].qty != 0) {
            let card = {
              qty: this.currentCardsList[i].qty,
              cardId: this.currentCardsList[i].id 
            }
            cardsArray.push(card);
            console.log(card);
          }
        }
        return cardsArray;
    },
    async saveSet() {
      if (this.setId == 0) {
        //create new
        let response = await axios.get("http://localhost:3000/api/cardSets");
        let responseData = response.data;
        let idsArray = [];
        for(let i=0; i < responseData.length; i++) {
          idsArray.push(responseData[i].id);
        }
        this.setId = Math.max(...idsArray) + 1;

        let newSet = await this.saveNewCardsListToDataBase();
        this.totalSetsList.push(newSet);
        this.displayCards = false;
        this.setName = "";
      }
      else {
        let existingSet = await this.saveCardsListToDataBase();
        console.log("saving existing set");

        // replace the existing set with the new version
        let foundIndex = this.totalSetsList.findIndex(a => a.id == this.setId);
        let tempList = this.totalSetsList;
        tempList[foundIndex] = existingSet;

        // refresh sets
        this.totalSetsList.splice(0, this.totalSetsList.length, ...tempList);
        this.displayCards = false;
        this.setName = "";
      }
    },
    async deleteSet() {
      // you can't delete something that doesn't exist
      if (this.setId != 0) {
        await axios.delete("http://localhost:3000/api/cardSets/"+this.setId);
        let foundIndex = this.totalSetsList.findIndex(a => a.id == this.setId);
        this.totalSetsList.splice(foundIndex, 1);
        this.displayCards = false;
        this.setName = "";
      }
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
</style>