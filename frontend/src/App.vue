<template>

  <div id="app">
    <v-app>
      <v-content>
        <v-container fluid>
          <v-toolbar color="blue">
            <v-toolbar-side-icon></v-toolbar-side-icon>
            <v-toolbar-title>Title</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items class="hidden-sm-and-down">
              <v-btn flat>Link One</v-btn>
              <v-btn flat :to="{name: 'leagues'}">Leagues</v-btn>
              <v-btn flat :to="{name: 'login'}">Login</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <router-view></router-view>
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
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style lang="scss">

</style>
