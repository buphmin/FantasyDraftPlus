<template>
    <v-layout class="mt-2">

        <v-flex md10 offset-md1 v-if="team">
            <h1>{{ team.name }}</h1>
            <v-divider></v-divider>
            <draft-confirmation-dialog v-model.sync="modalOpen" v-bind:confirmation-message="confirmationMessage"
                                       v-bind:callback="dropPlayer"
                                       v-bind:callback-options="dropPlayerOptions"></draft-confirmation-dialog>
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
                    <td>
                        <!--<v-btn v-if="team.user_id ==  $store.state.userId" v-on:click="dropPlayer(props.item.id)" color="red">-->
                        <!--Drop-->
                        <!--</v-btn>-->
                        <v-btn v-if="parseInt(team.user_id) ===  parseInt($store.state.userId)"
                               v-on:click="updateConfirmationMessage(props.item); dropPlayerOptions = {leaguePlayerId: props.item.id}; modalOpen = true"
                               color="orange">
                            Drop
                        </v-btn>
                    </td>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import DraftConfirmationDialog from '../../utilities/DraftConfirmationDialog.vue';

  interface DropPlayerOptions {
    leaguePlayerId: number|null;
  }

  @Component({
    components: {
      DraftConfirmationDialog
    }
  })
  export default class Team extends Vue {

    modalOpen: boolean = false;
    team: any = null;
    leaguePlayers = [];
    confirmationMessage: string = '';
    dropPlayerOptions: DropPlayerOptions = {
      leaguePlayerId: null
    };

    headers = [
      {
        text: 'Name',
        value: 'playerName',
        sortable: true
      },
      {
        text: 'Positions',
        value: 'position',
        sortable: true
      },
      {
        text: 'NFL Team',
        value: 'nflTeam',
        align: 'left',
        sortable: true
      },
      {
        text: 'Drop Player',
        value: '',

      }
      // {
      //   text: 'Team',
      //   value: 'teamName'
      // }

    ];

    getTeamName(leaguePlayer: any) {
      if (leaguePlayer.team) {
        return leaguePlayer.team.name
      }

      return null
    }

    updateConfirmationMessage(leaguePlayer: any) {
      this.confirmationMessage = `Drop ${leaguePlayer.player.name}?`;
    }

    async getTeam() {
      let params: any = this.$route.params;

      try {
        let response = await this.$store.state.httpClient.get(`${this.$store.state.apiUrl}/teams/${params.id}`);
        this.team = response;
        const playerResponse = await this.$store.state.httpClient.get(
          `${this.$store.state.apiUrl}/leagues/${params.leagueId}/league-players?page=1&limit=200&order=position&descending=false&team=${params.id}`
        )

        this.leaguePlayers = playerResponse.data;


      } catch (e) {
        console.log(e);
      }
    }

    async dropPlayer({leaguePlayerId}: { leaguePlayerId: number }) {
      // const leaguePlayerId = options.leaguePlayerId;
      let params: any = this.$route.params;

      try {
        await this.$store.state.httpClient.put(
          `${this.$store.state.apiUrl}/leagues/${params.leagueId}/league-players/${leaguePlayerId}`
        );
        const response = await this.$store.state.httpClient.get(
          `${this.$store.state.apiUrl}/leagues/${params.leagueId}/league-players?page=1&limit=200&order=position&descending=false&team=${params.id}`
        );
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