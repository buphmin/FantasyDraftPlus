<template>
    <v-layout row wrap class="mt-2">
        <v-container fluid>
        <v-snackbar
                :timeout="3000"
                color="success"
                :top="true"
                v-model="showWsServerConnected"
        >
            Connected to server
            <v-tooltip bottom>
                <v-icon slot="activator">info</v-icon>
                <span>
                    This means the page will update itself with live data. No need to reload :)
                </span>
            </v-tooltip>
            <v-btn dark flat @click.native="showWsServerConnected = false">Close</v-btn>
        </v-snackbar>
        <v-snackbar
                :timeout="3000"
                color="error"
                :top="true"
                v-model="showWsServerDisconnected"
        >
            Disconnected from server
            <v-tooltip bottom>
                <v-icon slot="activator">info</v-icon>
                This means you will not receive live updates and will need to refresh page.
            </v-tooltip>
            <v-btn dark flat @click.native="showWsServerDisconnected = false">Close</v-btn>
        </v-snackbar>


        <draft-confirmation-dialog v-model.sync="modalOpen" v-bind:confirmation-message="confirmationMessage"
                                   v-bind:callback="addPlayer"
                                   v-bind:callback-options="addPlayerOptions"></draft-confirmation-dialog>

        <v-snackbar
                :timeout="4000"
                color="red"
                :top="true"
                v-model="hasErrorMessage"
        >
            {{ errorText }}
            <v-btn dark flat @click.native="hasErrorMessage = false">Close</v-btn>
        </v-snackbar>

        <v-flex sm12 md10 offset-md1>
            <h2>{{ league.name }}</h2>
        </v-flex>


        <v-flex sm12 md10 offset-md1>
            <v-card>
                <v-card-text>
                    <v-tabs
                            v-model="active"
                            color="blue darken-3"
                            dark
                            slider-color="orange"
                    >

                        <v-tab ripple>Players</v-tab>
                        <v-tab ripple>Teams</v-tab>
                        <v-tab ripple>Draft Order</v-tab>
                    </v-tabs>

                        <v-tabs-items v-model="active" touchless>
                            <v-tab-item>
                                <v-card flat>
                                    <v-card-text>
                                        <!--<v-card-title>-->
                                            <v-spacer></v-spacer>
                                            <v-text-field
                                                    append-icon="search"
                                                    label="Search"
                                                    single-line
                                                    hide-details
                                                    v-model="search"
                                            ></v-text-field>
                                        <v-divider></v-divider>
                                        <!--</v-card-title>-->
                                        <v-data-table
                                                :headers="headers"
                                                :items="leaguePlayers"
                                                :search="search"
                                                :pagination.sync="pagination"
                                                :total-items="totalLeaguePlayers"
                                                :loading="loading"
                                                :rows-per-page-items="[10, 25, 50]"
                                                class="elevation-1"
                                        >
                                            <template slot="items" slot-scope="props">
                                                <td>{{ props.item.player.name }}</td>
                                                <td>{{ props.item.player.positions.map(e => e.id).join(', ')}}</td>
                                                <td class="">{{ props.item.player.nfl_team }}</td>
                                                <td>
                                                    <router-link v-if="props.item.team_id !== null" v-bind:to="{name: 'team', params: {id: props.item.team_id, leagueId: props.item.league_id}}">{{ getTeamName(props.item) }}</router-link>
                                                </td>
                                                <td class="">
                                                    <v-btn @click="updateConfirmationMessage(props.item); addPlayerOptions = {leaguePlayerId: props.item.id}; modalOpen = true"
                                                           v-if="props.item.team_id === null && teamId !== null"
                                                           color="blue">Add</v-btn>
                                                </td>

                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-tab-item>
                            <v-tab-item>
                                <v-card flat>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-tile avatar
                                                         v-for="team of league.teams"
                                                         :to="{name: 'team', params: {id: team.id, leagueId: team.league_id}}"
                                                         :key="team.id">
                                                <v-list-tile-action>
                                                </v-list-tile-action>
                                                <v-list-tile-content>
                                                    <v-list-tile-title>
                                                        {{ team.name }}
                                                    </v-list-tile-title>
                                                </v-list-tile-content>
                                            </v-list-tile>
                                        </v-list>

                                    </v-card-text>
                                </v-card>
                            </v-tab-item>

                            <v-tab-item>
                                <v-data-table
                                        v-bind:headers="draftOrderHeader"
                                        :items="draftOrderRows"
                                        hide-actions
                                        :disable-initial-sort="true"
                                        class="elevation-1"
                                >
                                    <template slot="items" slot-scope="draftOrder">

                                        <td>
                                            <span v-if="draftOrder.item.leaguePlayer !== null">{{ draftOrder.item.leaguePlayer.player.name}}</span>
                                        </td>
                                        <td>
                                            <span v-if="draftOrder.item.leaguePlayer !== null">{{ draftOrder.item.leaguePlayer.player.positions.map(e => e.id).join(', ')}}</span>
                                        </td>
                                        <td><span v-if="draftOrder.item.leaguePlayer !== null">{{ draftOrder.item.leaguePlayer.player.nfl_team }}</span></td>
                                        <td>
                                            <span v-if="draftOrder.item.team">{{ draftOrder.item.team.name }}</span>
                                        </td>
                                        <td>{{ draftOrder.item.pick_number }}</td>
                                    </template>
                                </v-data-table>
                            </v-tab-item>
                        </v-tabs-items>
                </v-card-text>
            </v-card>

        </v-flex>
        </v-container>
    </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'
  import DraftConfirmationDialog from '../../utilities/DraftConfirmationDialog.vue';
  import * as Ws from '@adonisjs/websocket-client'
  declare var require: any;
  const debounce = require('lodash/debounce');
  // const ws = Ws('ws://localhost:3333', {
  //   reconnectionDelay: 2000,
  //   reconnectionAttempts: 3
  // });


  const ws = Ws('ws://fantasydraftplus.net:3333', {
    reconnectionDelay: 2000,
    reconnectionAttempts: 3
  });


  // ws.on('open', () => {
  //   console.log('websocket connected :)');
  // });
  //
  // ws.on('close', () => {
  //   console.log('websocket closed');
  //   leaguePlayerChannel = ws.subscribe('leaguePlayer');
  // })
  //
  // ws.on('error', () => {
  //   console.log('error something wrong with connection');
  // });
  //
  // let leaguePlayerChannel = ws.subscribe('leaguePlayer');

  interface AddPlayerOptions {
    leaguePlayerId: number|null
  }

  @Component({
    components: {
      DraftConfirmationDialog
    }
  })
  export default class League extends Vue {
    league: any = {};
    errorText: string = '';
    modalOpen: boolean = false;
    hasErrorMessage: boolean = false;
    teamId: number|null = null;
    active = null;
    leaguePlayers = [];
    search: string = '';
    wsServerConnected: boolean = false;
    pagination: any = {};
    loading: boolean = false;
    totalLeaguePlayers: number = 0;
    showWsServerConnected: boolean = false;
    showWsServerDisconnected: boolean = false;
    confirmationMessage: string = '';
    draftOrderRows: any[] = [];
    addPlayerOptions: AddPlayerOptions = {
      leaguePlayerId: null
    };
    draftOrderHeader: any[] = [
      {
        text: 'Name',
        value: 'player.name'
      },
      {
        text: 'Positions',
        value: 'positions'
      },
      {
        text: 'NFL Team',
        value: 'nfl_team'
      },
      {
        text: 'Draft Team',
        value: 'draft'
      },
      {
        text: 'Pick #',
        value: 'pick'
      }
    ];
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
      {
        text: 'Team',
        value: 'teamName'
      },
      {
        text: 'Add',
        value: '',
        sortable: false
      }
    ];

    searchPlayers: any;

    constructor() {
      super();
      this.searchPlayers = debounce(() => {this.getLeaguePlayers()}, 400);
    }

    @Watch('pagination', {deep: true})
    onPaginationChange () {
      this.getLeaguePlayers()
    }

    @Watch('search')
    onSearchChange () {
      this.searchPlayers();
    }

    @Watch('userId')
    onUserId() {
      this.getLeague();
      this.getLeaguePlayers();
    }

    getTeamName (leaguePlayer: any) {
      if (leaguePlayer.team && leaguePlayer.team.name) {
        return leaguePlayer.team.name
      }

      return null
    }

    get userId() {
      return this.$store.state.userId;
    }

    async getLeague () {
      let params: any = this.$route.params;

      try {
        let league = await this.$store.state.httpClient.get(`${this.$store.state.apiUrl}/leagues/${params.id}`);
        this.league = league;

        for(let team of league.teams) {
          if(parseInt(team.user_id) == parseInt(this.$store.state.userId)) {
            this.teamId = team.id;
          }
        }
      } catch (e) {

      }
    }

    async getLeaguePlayers () {
      let params: any = this.$route.params;

      try {
        this.loading = true;
        let response = await this.$store.state.httpClient.get(
          `${this.$store.state.apiUrl}/leagues/${params.id}/league-players?page=${this.pagination.page}&limit=${this.pagination.rowsPerPage}&name=${this.search}&order=${this.pagination.sortBy}&descending=${this.pagination.descending}`
        );
        this.loading = false;
        this.leaguePlayers = response.data;
        this.totalLeaguePlayers = response.total

      } catch (e) {

      }
    }

    async getDraftOrders() {
      let params: any = this.$route.params;

      try{
        this.draftOrderRows = await this.$store.state.httpClient.get(
          `${this.$store.state.apiUrl}/leagues/${params.id}/draft-order`
        )
      } catch (e) {
        const errorObject = JSON.parse(e);
        this.hasErrorMessage = true;
        this.errorText = errorObject.error;
      }
    }


    async addPlayer({leaguePlayerId}: {leaguePlayerId: number}) {
      console.log('adding player', leaguePlayerId, this.teamId);
      try {
        await this.$store.state
          .httpClient.put(
            `${this.$store.state.apiUrl}/leagues/${this.league.id}/league-players/${leaguePlayerId}?team=${this.teamId}`
        );

        // this.getLeaguePlayers();
      } catch (e) {
        const errorObject = JSON.parse(e);
        this.hasErrorMessage = true;
        this.errorText = errorObject.error;
      }
    }

    updateConfirmationMessage(leaguePlayer: any) {
      this.confirmationMessage = `Are you sure you wish to add ${leaguePlayer.player.name}?`;
    }

    beforeDestroy() {
      ws.close();
      console.log('closing');
    }

    mounted () {
      ws.connect();
      console.log('mounted');
      let leaguePlayerChannel;
      ws.on('open', () => {
        this.wsServerConnected = true;
        this.showWsServerDisconnected = false;
        leaguePlayerChannel = ws.subscribe('leaguePlayer');
        const draftOrderChannel = ws.subscribe('draftOrder');

        draftOrderChannel.on('ready', () => {
          this.showWsServerConnected = true;
        });


        leaguePlayerChannel.on('close', () => {
          this.showWsServerDisconnected = true;
        });

        leaguePlayerChannel.on('message', (message) => {
          console.log('got lp refresh');
          this.getLeaguePlayers();
        })


        draftOrderChannel.on('close', () => {
          this.showWsServerDisconnected = true;
        });

        draftOrderChannel.on('message', (message) => {
          console.log('draft message', message, (new Date()).getTime());
          this.draftOrderRows = message;
        })
      });

      ws.on('close', () => {
        this.wsServerConnected = false;
        this.showWsServerDisconnected = true;
        this.showWsServerConnected = false;
      });

      ws.on('error', () => {
        console.log('error something wrong with connection');
      });

      // let leaguePlayerChannel = ws.subscribe('leaguePlayer');


      if(this.$store.state.userId) {
        this.getLeague();
        this.getLeaguePlayers();
      }

      this.getDraftOrders();
    }
  }
</script>

<style scoped>

</style>