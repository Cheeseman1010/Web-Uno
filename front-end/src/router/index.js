import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Cards from '../views/Cards.vue'
import Players from '../views/Players.vue'
import Rules from '../views/Rules.vue'
import Game from '../views/Game.vue'
import Games from '../views/Games.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cards',
    name: 'Cards',
    component: Cards
  },
  {
    path: '/players',
    name: 'Players',
    component: Players
  },
  {
    path: '/rules',
    name: 'Rules',
    component: Rules
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/games',
    name: 'Games',
    component: Games
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
