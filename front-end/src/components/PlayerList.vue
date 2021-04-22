<template>
<div class="wrapper">
  <div class="players">
    <div class="player" v-for="player in players" :key="player.id">
      <div class="info">
        <h3>{{player.name}}</h3>
        <h4>Wins: {{player.wins}}</h4>
        <button class="auto" @click="deletePlayer(player)">Delete Player</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'PlayerList',
  props: {
    players: Array
  },
  methods: {
    deletePlayer(player) {
        this.$root.$data.totalPlayers = this.$root.$data.totalPlayers - 1;       
        let index = this.$root.$data.players.indexOf(player);
        this.$root.$data.players.splice(index, 1);
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

.info h3 {
  font-size: 14px;
  margin: 5px;
}

.info h4 {
  color: #8f7d30;
  font-size: 14px;
  margin: 5px;
}

.info p {
  margin-top: 25px;
  font-size: 10px;
}

button {
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