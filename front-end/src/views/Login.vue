<template>
  <div>
    <h2>Login/Registration</h2>
    <p>I know this page isn't pretty, but I guess that's what happens when you mix 
      authentication issues and finals together. One bug is all it takes to ruin a weekend.</p>
    <p>When you register, a player is generated for you to use in games, but authentication
       is a little busted right now, so you'll have to add them manually to your games. You can also 
       delete them. Please don't do that.</p>
    <form class="usersForm">
      <fieldset>
        <legend>Register your User Account:</legend>
        <input placeholder="first name" v-model="firstName">
        <input placeholder="last name" v-model="lastName">
      </fieldset>
      <fieldset>
        <input placeholder="username" v-model="username">
        <input type="password" placeholder="password" v-model="password">
      </fieldset>
      <fieldset>
        <button type="submit" @click.prevent="register">Register</button>
      </fieldset>
    </form>
    <p v-if="registerError" class="error">{{errorMessageRegister}}</p>
    <form class="usersForm">
      <fieldset>
        <legend>Login</legend>
        <input placeholder="username" v-model="usernameLogin">
        <input type="password" placeholder="password" v-model="passwordLogin">
      </fieldset>
      <fieldset>
        <button type="submit" @click.prevent="login">Login</button>
      </fieldset>
    </form>
    <p v-if="loginError" class="error">{{errorMessageLogin}}</p>
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
        firstName: '',
        lastName: '',
        username: '',
        password: '',
        usernameLogin: '',
        passwordLogin: '',
        registerError: false,
        loginError: false,
        errorMessageRegister: '',
        errorMessageLogin: '',
    }
  },
  async created() {
    try {
      let response = await axios.post('http://localhost:3000/api/users/validate', {withCredentals:true});
      this.$root.$data.user = response.data.user;
    } catch (error) {
      this.$root.$data.user = null;
    }
  },
  methods: {
    async login() {
      this.error = '';
      this.errorLogin = '';
      if (!this.usernameLogin || !this.passwordLogin) return;
      try {
        let response = await axios.post('http://localhost:3000/api/users/login', {
          username: this.usernameLogin,
          password: this.passwordLogin,
        },
        {
          //AxiosRequestConfig parameter
          withCredentials: true
        });
        this.$root.$data.user = response.data.user;
      } catch (error) {
        this.errorLogin = "Error: " + error.response.data.message;
        this.$root.$data.user = null;
      }
      //console.log(await axios.post('http://localhost:3000/api/users/validate', {username: this.usernameLogin,
      //    password: this.passwordLogin,}, {withCredentals:true}));
    },
    async register() {
      this.error = '';
      this.errorLogin = '';
      if (!this.firstName || !this.lastName || !this.username || !this.password) return;
      try {
        let response = await axios.post('http://localhost:3000/api/users/register', {
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          password: this.password,
        },
        {
          //AxiosRequestConfig parameter
          withCredentials: true
        });
        this.$root.$data.user = response.data.user;

        //add player for user
        let playerResponse = await axios.get("http://localhost:3000/api/players");
        let responseData = playerResponse.data;
        console.log(responseData);

        let idsArray = [];
        for(let i=0; i < responseData.length; i++) {
          idsArray.push(responseData[i].id);
        }
        let playerId = 1;
        if (idsArray.length != 0) playerId = Math.max(...idsArray) + 1;
        await axios.post("http://localhost:3000/api/players", {
          id: playerId,
          name: this.firstName+" "+this.lastName,
          wins: 0,
          hand: [],
          inGame: false})
      } catch (error) {
        this.error = error.response.data.message;
        this.$root.$data.user = null;
      }
    }
  },
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
  background: #3b3b3b;
  color: rgb(255, 255, 255);
  border: none;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: left;
}
</style>
