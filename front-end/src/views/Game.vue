<template>
<div>
  <div v-if="this.$root.$data.isWin == false">
    <GameArea />
  </div>
  <div v-else>
      <h3> Game finish </h3>
  </div>
  <div class='footer'>
    <a href='https://github.com/Cheeseman1010/Web-Uno'>Github Link</a>   |   
    Web Uno
  </div>
</div>
</template>

<script>
import GameArea from "../components/GameArea.vue"
export default {
  name: 'Browse',
  components: {
    GameArea
  },
  data() {
    return {
        playerName: '',
        errorMessage: ''
    }
  },
  computed: {
  },
  methods: {
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