<template>

  <div id="app">
    <v-app>
      <v-content>
        <v-container fluid>
          <v-navigation-drawer temporary="" floating absolute
                               v-model="navDrawerOpen" light>
            <v-toolbar flat>
              <v-list>
                <v-list-tile>
                  <v-list-tile-title class="title">
                    Fantasy Draft Plus
                  </v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list dense class="pt-0">
              <v-list-tile v-if="$store.state.userId === null" :to="{name: 'login'}">
                <v-list-tile-content>
                  <v-list-tile-title>
                    Login
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
                <v-list-tile v-if="$store.state.userId === null" :to="{name: 'signup'}">
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Sign Up
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-group
                        v-if="$store.state.user !== null"
                        no-action>
                    <v-list-tile slot="activator">
                        <v-list-tile-content>
                            <v-list-tile-title>
                                <span>{{ $store.state.user.email }}</span>
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile :to="{name: 'leagues'}">
                        <v-list-tile-content>
                            <v-list-tile-title>
                                My Leagues
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile @click="signOut()">
                        <v-list-tile-title>Sign Out</v-list-tile-title>
                    </v-list-tile>
                </v-list-group>
                <v-list-tile v-if="$store.state.userId !== null" :to="{name: 'allLeagues'}">
                    <v-list-tile-content>
                        <v-list-tile-title>
                            Leagues
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
          </v-navigation-drawer>
          <v-toolbar color="blue darken-3" dark>
            <!--<v-toolbar-side-icon></v-toolbar-side-icon>-->
            <v-toolbar-title>Fantasy Draft Plus</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-side-icon class="hidden-md-and-up" @click.stop="navDrawerOpen = !navDrawerOpen"></v-toolbar-side-icon>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn v-if="$store.state.userId === null" flat :to="{name: 'login'}">Login</v-btn>
              <v-btn v-if="$store.state.userId === null" flat :to="{name: 'signup'}"><v-icon dark>person_add</v-icon>  Sign Up</v-btn>
              <v-btn v-if="$store.state.user !== null" flat :to="{name: 'allLeagues'}">Leagues</v-btn>
            </v-toolbar-items>
              <v-menu :nudge-width="100" v-if="$store.state.user !== null" class="hidden-sm-and-down">
                  <v-toolbar-title slot="activator" style="font-size: 14px">
                      <span>{{ $store.state.user.email.toUpperCase() }}</span>
                      <v-icon >arrow_drop_down</v-icon>
                  </v-toolbar-title>
                  <v-list>
                      <v-list-tile :to="{name: 'profile'}">
                          <v-list-tile-content>
                              <v-list-tile-title>
                                  My Profile
                              </v-list-tile-title>
                          </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile :to="{name: 'leagues'}">
                          <v-list-tile-content>
                              <v-list-tile-title>
                                  My Leagues
                              </v-list-tile-title>
                          </v-list-tile-content>
                      </v-list-tile>
                      <v-list-tile @click="signOut()">
                          <v-list-tile-title>Sign Out</v-list-tile-title>
                      </v-list-tile>
                  </v-list>
              </v-menu>
          </v-toolbar>
          <router-view></router-view>
            <v-footer height="auto" class="blue darken-3" :absolute="true">
                <v-layout row wrap justify-center>

                    <a href="mailto:info@fantasydraftplus.net">
                        <v-btn color="white" flat>Contact Us</v-btn>
                    </a>
                    <!--</v-btn>-->
                    <v-flex xs12 py-3 text-xs-center white--text>
                        &copy;2018 — <strong>Fantasy Draft Plus</strong>
                    </v-flex>
                </v-layout>
            </v-footer>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      navDrawerOpen: false,
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    signOut() {
      this.$store.commit('signOut');
      localStorage.clear();
      this.$router.push({name: 'login'});
    }
  }
}
</script>

<style>

</style>
