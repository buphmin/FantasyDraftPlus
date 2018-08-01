import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import VeeValidate from 'vee-validate';
import {HttpClient} from './utilities/HttpClient';

import Home from './components/routes/Home.vue'
import Login from './components/routes/Login.vue';
import Leagues from './components/routes/Leagues.vue';
import League from './components/routes/League.vue';
import Team from './components/routes/Team.vue';
import SignUp from './components/routes/SignUp.vue';
import AllLeagues from './components/routes/AllLeagues.vue';
import Profile from './components/routes/Profile.vue';
import Admin from './components/routes/Admin.vue';
import Tutorial from './components/routes/Tutorial.vue';

import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader


Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VeeValidate); // good to go.

const routes = [
  {path: '/', component: Home, name: 'home'},
  {path: '/login', component: Login, name: 'login'},
  {path: '/league/:id', component: League, name: 'singleLeague'},
  {path: '/leagues', component: Leagues, name: 'leagues'},
  {path: '/all-leagues', component: AllLeagues, name: 'allLeagues'},
  {path: '/league/:leagueId/team/:id', component: Team, name: 'team'},
  {path: '/sign-up', component: SignUp, name: 'signup'},
  {path: '/profile', component: Profile, name: 'profile'},
  {path: '/admin', component: Admin, name: 'admin'},
  {path: '/tutorial', component: Tutorial, name: 'tutorial'}
];
const router = new VueRouter({
  routes, // short for routes: routes
  mode: 'history'
});

let token = window.localStorage.getItem('token');

let httpClient = new HttpClient({}, token);

let dev = true;


const store = new Vuex.Store({
  state: {
    httpClient: httpClient,
    apiUrl: dev ? 'http://127.0.0.1:3333' : '/api',
    // apiUrl: '/api',
    userId: null,
    user: null,
  },
  mutations: {
    setToken (state, token) {
      state.httpClient.headers.headers.Authorization = `Bearer ${token}`;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setUser(state, user) {
      state.user = user;
    },
    signOut(state, user) {
      state.user = null;
      state.userId = null;
    }
  }
});


new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,

  async mounted() {
    if(localStorage.getItem('token')) {
      let userId = await store.state.httpClient.get(`${store.state.apiUrl}/getUserId`);
      this.$store.commit('setUserId', userId);
      const user = await store.state.httpClient.get(`${store.state.apiUrl}/users/${userId}`);
      this.$store.commit('setUser', user);
    }
  }
});
