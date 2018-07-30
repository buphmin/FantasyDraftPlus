<template>
    <v-layout>
            <v-flex md10 offset-md1>
                <div v-if="isAdmin()">
                    can access a
    
                    <v-form id="update_league_player" @submit.prevent="updateLeaguePlayer()">
                        <!--league-->
                        <v-select
                                :items="leagues"
                                item-value="id"
                                item-text="name"
                                label="League"
                                v-model="leagueId"
                        >
    
                        </v-select>
    
    
                        <!--league_players-->
                        <v-autocomplete
                                :disabled="leagueId === null"
                                v-model="leaguePlayer"
                                :items="leaguePlayers"
                                :loading="isLoadingPlayer"
                                :search-input.sync="leaguePlayerSearch"
    
                                item-text="player.name"
                                item-value="id"
                                label="Player"
                                placeholder="Start typing to Search"
                                return-object
                        ></v-autocomplete>

                        <v-select
                                :items="teams"
                                item-value="id"
                                item-text="name"
                                label="Team"
                                v-model="teamId"
                        >

                        </v-select>
    
    
                        <v-text-field
                                v-model="draftOrder"
                                label="Pick Number"
                                type="number">
                        </v-text-field>
    

                        <v-btn color="blue" type="submit">

                        </v-btn>
                    </v-form>
                </div>
                <div v-else>
                    You do no have permission to access this page.
                </div>
            </v-flex>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

@Component
export default class Admin extends Vue {
  leaguePlayer: LeaguePlayer = null;
  isLoadingPlayer: boolean = false;
  leagues: League[] = [];
  leaguePlayers: any[] = [];
  leaguePlayerSearch: any = "";
  leagueId: number = null;
  draftOrder: number = null;
  teamId: number = null;
  teams: Team[] = [];

  @Watch("leaguePlayerSearch")
  async onLeaguePlayerSearch(val) {
    const apiBaseUrl = this.$store.state.apiUrl;

    const response = await this.$store.state.httpClient.get(
      `${apiBaseUrl}/leagues/${this.leagueId}/league-players?name=${val}`
    );

    this.leaguePlayers = response.data;
  }

  isAdmin() {
    if (this.$store.state.user !== null) {
      return this.$store.state.user.email.includes(
        "buphmin@gmail.com",
        "popeseveni@gmail.com"
      );
    }

    return false;
  }

  async updateLeaguePlayer() {
    try {
      const response = await this.$store.state.httpClient.get(
        `/admin/league/${this.leagueId}/${this.leaguePlayer.id}?team=${this.teamId}&pickNumber=${this.draftOrder}`
      );
    } catch(e) {
      console.log(e);
    }
  }

  async getTeams() {
    try {
      let response = await this.$store.state.httpClient.get(
        `${this.$store.state.apiUrl}/teams`
      );
      this.teams = response;
    } catch (e) {}
  }

  async getLeagues() {
    try {
      let response = await this.$store.state.httpClient.get(
        `${this.$store.state.apiUrl}/leagues`
      );
      this.leagues = response.data;
    } catch (e) {}
  }

  mounted() {
    this.getLeagues();
    this.getTeams();
  }
}
</script>

<style scoped>
</style>
