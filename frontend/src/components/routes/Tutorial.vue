<template>
    <v-layout>
        <v-flex md10 offset-md1>
            <h1>Tutorial</h1>

            <p>
                Welcome to fantasy draft plus! This website is designed to allow drafting of fantasy football players. Fantasy draft plus
                is designed to be mobile friendly and should feel fast on modern devices. Fantasy draft plus should work on most modern
                browsers, but has only been fully tested in Chrome and Firefox.
            </p>
            <p>
                Key features
            </p>
            <ul>
                <li>
                    Automated notifications when it is your turn to pick.
                </li>
                <li>
                    Live updates to the player page and draft order page under each league. This means you will not need to refresh the page.
                    To see who if anyone has been selected before you.
                </li>
            </ul>

            <p>
                To use fantasy draft plus you must be create an account and login. Once logged (and you have been added to leagues) you may then
                go to a league page by clicking either "Leagues" in the navbar or under the user menu (as denoted by your email) by
                clicking "My Leagues."
            </p>
            <p>
                From there you may click on a league to go to that league page. There you will be greeted with 3 different tabs:
                Players, Teams, and Draft Order.
                You may notice a popup at the top of the screen saying "Connected to Server" in green or "Disconnected from Server"
                in red. Typically you will be
                connected, meaning that the page will automatically update the players and draft order whenever someone makes a pick.
            </p>
            <p>
                To add a player simply click the add button in the same row as the player and a confirmation will popup.
                Once you confirm the player will be added
                to your team and a notification will be sent to the next team informing them of their pick. You will not
                be able to add a player if it is not your turn
                to pick, or the process of adding that player would put your team above the position cap for that position.
            </p>

            <p>
                To drop a player simply find your team under the Teams tab and hit drop in the list of players, then confirm.
            </p>

            <p>
                If you are having any difficulties with the Fantasy Draft Plus or encounter any bugs please contact
                your league manager and you may also use the contact us link in the footer to email for help or to report
                a bug.
            </p>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Watch } from 'vue-property-decorator';

  @Component
  export default class Tutorial extends Vue {

  }
</script>

<style scoped>

</style>