<template>
<div id="app">
  <div v-if="this.$root.$data.inGame == false" id="menu">
    <div id="title">
      <router-link to="/">
        <h1>Web Uno</h1>
      </router-link>
    </div>
    <div id="pages">
      <router-link to="/">
        <div class="menu-item cards">
          <p>Play a Game</p>
        </div>
      </router-link>
      <router-link to="/cards">
        <div class="menu-item cards">
          <p>Card Options</p>
        </div>
      </router-link>
      <router-link to="/players">
        <div class="menu-item players">
          <p>Player Options</p>
        </div>
      </router-link>
      <router-link to="/rules">
        <div class="menu-item rules">
          <p>Custom Rules</p>
        </div>
      </router-link>
    </div>
  </div>
  <router-view />
</div>
</template>

<style>
* {
  box-sizing: border-box;
}

body {
  margin: 50px 100px;
  background-color: #e6e5cf;

}

#menu {
  margin-bottom: 10px;
}

#menu a {
  color: #B84901;
  text-decoration: none;
  font-family:Arial, Helvetica, sans-serif
}

#pages {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 5px;
  grid-template-areas: "none brand side";
  margin-bottom: 10px;
}

#pages a {
  color: #B84901;
}

.footer {
    margin-top: 25px;
    position: relative;
    bottom: 10px;
    justify-content: center;
    right: 0;
    left: 0;
    margin-right: auto;
    margin-left: auto;
    width: 300px;
    font-size:small;
    color: #838E83;
    height: 50px;
    text-align: center;
    font-family:Arial, Helvetica, sans-serif
}

.red {
  background: #c51919 !important;
  color: #ececec;
}

.orange {
  background: #c58919 !important;
  color: #ececec;
}

.yellow {
  background: #c5c219 !important;
  color: #ececec;
}

.green {
  background: #1fc519 !important;
  color: #ececec;
}

.blue {
  background: #1925c5 !important;
  color: #ececec;
}

.purple {
  background: #7219c5 !important;
  color: #ececec;
}

.black {
  background: #313131 !important;
  color: #ececec;
}

.white {
  background: #e0e0e0 !important;
  color: #000000;
}

.pink {
  background: #b119c5 !important;
  color: #ececec;
}

.brown {
  background: #4e3e07 !important;
  color: #ececec;
}

.indigo {
  background: #3919c5 !important;
  color: #ececec;
}

.violet {
  background: #8019c5 !important;
  color: #ececec;
}

.cyan {
  background: #04a3b8 !important;
  color: #ececec;
}

.lime {
  background: #5eac05 !important;
  color: #ececec;
}

</style>
