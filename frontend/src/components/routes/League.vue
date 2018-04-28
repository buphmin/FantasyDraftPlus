<template>
    <v-layout class="mt-2">
        <v-flex md10 offset-md1>
            <h2>{{ league.name }}</h2>

            <v-tabs
                    v-model="active"
                    color="blue darken-3"
                    dark
                    slider-color="orange"
            >
                <v-tab ripple>Teams</v-tab>
                <v-tab ripple>Players</v-tab>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <v-list>
                                <v-list-tile avatar v-for="team of league.teams" :key="team.id" @click="">
                                    <v-list-tile-action>
                                    </v-list-tile-action>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <router-link :to="{name: 'team', params: {id: team.id}}">{{ team.name }}</router-link>

                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                </v-list-tile>
                            </v-list>

                        </v-card-text>
                    </v-card>
                </v-tab-item>
                <v-tab-item>
                    <v-card flat>
                        <v-card-text>
                            <v-card-title>
                                <v-spacer></v-spacer>
                                <v-text-field
                                        append-icon="search"
                                        label="Search"
                                        single-line
                                        hide-details
                                        v-model="search"
                                ></v-text-field>
                            </v-card-title>
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
                                    <td>{{ getTeamName(props.item) }}</td>
                                    <td class="">
                                        <v-btn @click="addPlayer(props.item.id)" color="blue">Add</v-btn>
                                    </td>

                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-tab-item>
            </v-tabs>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator'

  @Component
  export default class League extends Vue {
    league: any = {};
    teamId: number|null = null;
    active = null
    leaguePlayers = []
    search: string = ''
    pagination: any = {}
    loading: boolean = false
    totalLeaguePlayers: number = 0
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
    ]

    @Watch('pagination', {deep: true})
    onPaginationChange () {
      this.getLeaguePlayers()
    }

    @Watch('search')
    onSearchChange () {
      this.getLeaguePlayers()
    }

    getTeamName (leaguePlayer: any) {
      if (leaguePlayer.team) {
        return leaguePlayer.team.name
      }

      return null
    }

    async getLeague () {
      let params: any = this.$route.params

      try {
        let response = await this.$store.state.httpClient.get(`${this.$store.state.apiUrl}/leagues/${params.id}`)
        this.league = response

        for(let team of this.league.teams) {
          if(team.user_id == this.$store.state.userId) {
            this.teamId = team.id;
          }
        }
      } catch (e) {

      }
    }

    async getLeaguePlayers () {
      let params: any = this.$route.params

      try {
        this.loading = true
        let response = await this.$store.state.httpClient.get(
          `${this.$store.state.apiUrl}/leagues/${params.id}/league-players?page=${this.pagination.page}&limit=${this.pagination.rowsPerPage}&name=${this.search}&order=${this.pagination.sortBy}&descending=${this.pagination.descending}`
        )
        this.loading = false
        this.leaguePlayers = response.data
        this.totalLeaguePlayers = response.total

      } catch (e) {

      }
    }


    async addPlayer(leaguePlayerId: number) {
      try {
        await this.$store.state
          .httpClient.put(
            `${this.$store.state.apiUrl}/leagues/${this.league.id}/league-players/${leaguePlayerId}?team=${this.teamId}`
        )

        this.getLeaguePlayers();
      } catch (e) {
        console.log('addplayererror', e);
      }
    }

    mounted () {
      this.getLeague();
      this.getLeaguePlayers();
    }
  }
</script>

<style scoped>

</style>