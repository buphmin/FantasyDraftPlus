<template>
    <v-layout class="mt-2">
        <v-flex md10 offset-md1>
            <v-data-table
                    :headers="headers"
                    :items="leagues"
                    hide-actions
                    class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td><router-link :append="true" :to="{name: 'singleLeague', params: {id: props.item.id}}">{{ props.item.name }}</router-link></td>
                </template>
            </v-data-table>
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
    ]

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