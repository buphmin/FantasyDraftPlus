<template>
    <v-layout class="mt-2">
        <v-flex md10 offset-md1 v-if="team">
            <h1>{{ team.name }}</h1>
            <v-divider></v-divider>

            <v-data-table
                    :headers="headers"
                    :items="leaguePlayers"
                    hide-actions
                    class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.player.name }}</td>
                    <td>{{ props.item.player.positions.map(e => e.id).join(', ')}}</td>
                    <td class="">{{ props.item.player.nfl_team }}</td>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';


  @Component
  export default class Team extends Vue {

    team: any = null;
    leaguePlayers = [];
    headers = [
      {
        text: 'Name',
        value: 'playerName'
      },
      {
        text: 'Positions',
        value: 'position'
      },
      {
        text: 'NFL Team',
        value: 'nflTeam',
        align: 'left'
      },
      // {
      //   text: 'Team',
      //   value: 'teamName'
      // }

    ]

    getTeamName (leaguePlayer: any) {
      if (leaguePlayer.team) {
        return leaguePlayer.team.name
      }

      return null
    }

    async getTeam() {
      let params: any = this.$route.params

      try {
        let response = await this.$store.state.httpClient.get(`${this.$store.state.apiUrl}/teams/${params.id}`)
        this.team = response
        response = await this.$store.state.httpClient.get(
          `${this.$store.state.apiUrl}/leagues/${params.id}/league-players?page=1&limit=200&order=position&descending=false&team=${params.id}`
        )
        this.leaguePlayers = response.data;
      } catch (e) {
        console.log(e);
      }
    }

    mounted() {
      this.getTeam();
    }

  }
</script>

<style scoped>

</style>