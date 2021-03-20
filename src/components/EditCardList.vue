<template>
<div class="wrapper">
  <div class="cards">
    <div class="card" v-for="card in cards" :key="card.id">
      <div class="info" v-bind:class="card.color">
        <h3>{{capitalizeFirstLetter(card.color)}}</h3>
        <h2>{{card.icon}}</h2>
        <p>Qty: <button class="auto" @click="reduceQuantity(card)">-</button>
        {{card.quantity}}
        <button class="auto" @click="increaseQuantity(card)">+</button></p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'CardList',
  props: {
    cards: Array
  },
  methods: {
    reduceQuantity(card) {
        this.$root.$data.totalCards = this.$root.$data.totalCards - 1;
        let index = this.$root.$data.cards.indexOf(card);
        if (this.$root.$data.cards[index].quantity > 1) {
            this.$root.$data.cards[index].quantity = this.$root.$data.cards[index].quantity - 1;
        }
        else {
            this.$root.$data.cards.splice(index, 1);
        }
        this.$root.$data.getMaxPlayers();
    },
    increaseQuantity(card) {
        this.$root.$data.totalCards = this.$root.$data.totalCards + 1;
        let index = this.$root.$data.cards.indexOf(card);
        this.$root.$data.cards[index].quantity = this.$root.$data.cards[index].quantity + 1;
        this.$root.$data.getMaxPlayers();
    },
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family:Arial, Helvetica, sans-serif
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

.info h2 {
  margin: 5px;
}

.info h3 {
  font-size: 14px;
  margin: 5px;
}

.info p {
  margin-top: 25px;
  font-size: 10px;
}

button {
  height: 20px;
  background: #3b3b3b;
  color: white;
  border: none;
  border-radius: 5px;
}

.auto {
  margin-left: auto;
}
</style>