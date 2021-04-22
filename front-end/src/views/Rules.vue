<template>
<div class="wrapper">
  <h2> Edit Rules: </h2>
  <p>Here you can edit a few aspects about the game.</p>

  <div class="sets">
    <div class="set" v-for="set in allSets" :key="set.id">
      <div class="info">
        <h2>{{set.name}}</h2>
          <p><button class="auto" @click="setCurrentSet(set)">Edit</button></p>
        </div>
    </div>
    <div class="info">
      <h2>+</h2>
      <p><button class="auto" @click="setUpForNewSet()">Create New</button></p>
    </div>
  </div>
  <div class="addRule">
    <div class="addRuleField">
        <p>Set Name:</p>
        <input v-model="setName" placeholder="Set name here">
        <button v-on:click="saveSet(setName)">Save</button>
        <button v-on:click="deleteSet(setName)">Delete</button>
    </div>
  </div>

  <div v-if="displayRules == true">
    <div class="rules">
      <div class="ruleField">
        <p>Starting Hand Size: Currently {{currentHandSize}}</p>
        <input v-model="handSize" placeholder="new value here">
      </div>
      <div class="ruleField">
        <p>Draw Cards Until You Can Play: Currently {{currentDrawingOption}}</p>
        <input v-model="drawUntil" id="until" type="checkbox">
        <label for="until">Draw Until Match</label>
      </div>
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
export default {
  name: 'Browse',
  data() {
    return {
      handSize: '',
      drawUntil: '',
      displayRules: false,
      setName: '',
      setId: 0,
      startingHandSize: 0,
      drawingUntilMatch: false,
      totalSetsList: [],
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
    axios.get("http://localhost:3000/api/ruleSets").then(res => {this.totalSetsList = res.data});
  },
  computed: {
    allSets() {
        return this.totalSetsList;
    },
    currentHandSize() {
        return this.startingHandSize;
    },
    currentDrawingOption() {
        return this.drawingUntilMatch;
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
    },
    async saveSet() {
      if (this.setId == 0) {
        //create new
        let response = await axios.get("http://localhost:3000/api/ruleSets");
        let responseData = response.data;
        let idsArray = [];
        for(let i=0; i < responseData.length; i++) {
          idsArray.push(responseData[i].id);
        }
        this.setId = Math.max(...idsArray) + 1;

        this.startingHandSize = this.handSize;
        this.drawingUntilMatch = this.drawUntil;

        let newSet = await this.saveNewRuleSetToDataBase();
        this.totalSetsList.push(newSet);
        this.displayRules = false;
        this.setName = "";
      }
      else {
        this.startingHandSize = this.handSize;
        this.drawingUntilMatch = this.drawUntil;
        
        let existingSet = await this.saveRuleSetToDataBase();
        console.log("saving existing set");

        // replace the existing set with the new version
        let foundIndex = this.totalSetsList.findIndex(a => a.id == this.setId);
        let tempList = this.totalSetsList;
        tempList[foundIndex] = existingSet;

        // refresh sets
        this.totalSetsList.splice(0, this.totalSetsList.length, ...tempList);
        this.displayRules = false;
        this.setName = "";
      }
    },
    async deleteSet() {
      // you can't delete something that doesn't exist
      if (this.setId != 0) {
        await axios.delete("http://localhost:3000/api/ruleSets/"+this.setId);
        let foundIndex = this.totalSetsList.findIndex(a => a.id == this.setId);
        this.totalSetsList.splice(foundIndex, 1);
        this.displayRules = false;
        this.setName = "";
      }
    },
    async setCurrentSet(set) {
      // set visiblity
      this.displayRules = true;
      // get all cards
      this.setName = set.name;
      this.setId = set.id;
      this.startingHandSize = set.startingHandSize;
      this.drawingUntilMatch = set.drawUntilYouCanPlay;
    },
    async setUpForNewSet() {
      // set visiblity
      this.displayRules = true;
      // get all cards
      this.setName = '';
      this.setId = 0;
      this.startingHandSize = 5;
      this.drawingUntilMatch = false;
    },
    async saveRuleSetToDataBase() {
      console.log(this.startingHandSize)
        let ruleSetRequest = {
          startingHandSize: this.startingHandSize,
          drawUntilYouCanPlay: this.drawingUntilMatch,
          id: this.setId,
          name: this.setName
        }
        await axios.put("http://localhost:3000/api/ruleSets/"+this.setId, ruleSetRequest);
        return ruleSetRequest;
    },
    async saveNewRuleSetToDataBase() {
        let ruleSetRequest = {
          startingHandSize: this.startingHandSize,
          drawUntilYouCanPlay: this.drawingUntilMatch,
          id: this.setId,
          name: this.setName
        }
        await axios.post("http://localhost:3000/api/ruleSets", ruleSetRequest);
        return ruleSetRequest;
    },
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

.addRule {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 5px;
  margin-bottom: 10px;
}

.addRuleField p {
  font-style: normal;  
  display: flex;
  align-items: center;
  justify-content: left;
  font-family:Arial, Helvetica, sans-serif;
  margin: 5px;
}
</style>