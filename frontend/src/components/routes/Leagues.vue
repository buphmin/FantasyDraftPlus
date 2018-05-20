<template>
    <v-layout row wrap class="mt-2">
        <v-flex sm12 md10 offset-md1>
            <h1>Leagues</h1>
        </v-flex>

        <v-flex sm12 md10 offset-md1 >
            <v-list>
                <v-list-tile avatar
                             v-for="league of leagues"
                             :to="{name: 'singleLeague', params: {id: league.id}}"
                             :key="league.id">
                    <v-list-tile-action>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ league.name }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-flex>

    </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';

  @Component
  export default class Leagues extends Vue {
    leagues: any[] = [];
    headers = [
      {
        text: 'League Name',
        value: 'name'
      }
    ];


    async getLeagues() {
      try {
        let response = await this.$store.state.httpClient.get(`${this.$store.state.apiUrl}/leagues`);
        this.leagues = response.data;
      } catch (e) {

      }
    }


    mounted() {
      this.getLeagues();
    }
  }
</script>

<style scoped>

</style>