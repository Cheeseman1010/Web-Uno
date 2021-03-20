<template>
<div class="wrapper">
  <h2> Edit Rules: </h2>
  <p>Here you can edit a few aspects about the game.</p>
  <div class="rules">
    <div class="ruleField">
        <p>Starting Hand Size: Currently {{this.$root.$data.startingCardNum}}</p>
        <input v-model="handSize" placeholder="new value here">
    </div>
    <div class="ruleField">
        <p>Draw Cards Until You Can Play: Currently {{this.$root.$data.drawUntilMatch}}</p>
        <input v-model="drawUntil" id="until" type="checkbox">
        <label for="until">Draw Until Match</label>
    </div>
  </div>
  <button v-on:click="saveChanges(handSize, drawUntil)">Submit Changes</button>
  <div class='footer'>
    <a href='https://github.com/Cheeseman1010/Web-Uno'>Github Link</a>   |   
    Web Uno
  </div>
</div>
</template>

<script>
export default {
  name: 'Browse',
  computed: {
    console: () => console,
  },
  data() {
    return {
      handSize: '',
      drawUntil: ''
    }
  },
  methods: {
    saveChanges(intHandSize, boolDrawUntil) {
        if (intHandSize != "") {
            this.$root.$data.startingCardNum = parseInt(intHandSize);
            this.$root.$data.getMaxPlayers();
        }
        // I don't like these if/else statements, but just setting it equal to boolDrawUntil was giving issues.
        if (boolDrawUntil == false) {
            this.$root.$data.drawUntilMatch = false;
        }
        else {
            this.$root.$data.drawUntilMatch = true;
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

.rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 5px;
  margin-bottom: 10px;
}

.ruleField {
  font-style: normal;  
  display: inline;
  justify-content: left;
  font-family:Arial, Helvetica, sans-serif;
  margin: 5px;
}

.ruleField > p {
    align-items: left;
    justify-content: left;
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