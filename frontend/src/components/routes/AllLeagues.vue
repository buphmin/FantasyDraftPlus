<template>
    <v-layout>
        <v-flex md10 offset-md1>
            <v-data-table
                    :headers="headers"
                    :items="leagues"
                    :search="search"
                    :pagination.sync="pagination"
                    :total-items="totalLeagues"
                    :loading="loading"
                    :rows-per-page-items="[10, 25, 50]"
                    class="elevation-1"
            >
                <template slot="items" slot-scope="props">
                    <td><router-link :to="{name: 'singleLeague', params: { id: props.item.id }}">{{ props.item.name }}</router-link></td>
                    <td>{{ props.item.size }}</td>
                    <td class="">{{ props.item.draft_live == 1}}</td>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component, Watch } from "vue-property-decorator";

  interface League {
    name: string;
    draft_live: boolean;
    created_at: string;
    updated_at:string;
    size: number;
  }

  @Component
  export default class SignUp extends Vue {
    pagination: any = {};
    totalLeagues: number = 0;
    loading: boolean = false;
    leagues: League[] = [];
    search: string = '';
    headers = [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'League Size',
        value: 'size'
      },
      {
        text: 'Draft In Progress',
        value: 'draft_live',
      },
    ];

    @Watch('pagination', {deep: true})
    onPaginationChange () {
      this.getLeagues()
    }

    async getLeagues () {
      try {
        this.loading = true;
        let response = await this.$store.state.httpClient.get(
          `${this.$store.state.apiUrl}/leagues/all?page=${this.pagination.page}&limit=${this.pagination.rowsPerPage}&name=${this.search}&order=${this.pagination.sortBy}&descending=${this.pagination.descending}`
        );
        this.loading = false;
        this.leagues = response.data;
        this.totalLeagues = response.total

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