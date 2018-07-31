<template>
    <v-layout>
        <v-flex md10 offset-md1>
            <v-form v-model="valid" @submit.prevent="signUp()">
                <v-text-field
                        label="Email"
                        v-model="email"
                        v-validate="'required|email'"
                        data-vv-name="email"
                        :error-messages="errors.collect('email')"
                        required
                ></v-text-field>
                <v-text-field
                        label="Password"
                        v-model="password"
                        v-validate="'required'"
                        data-vv-name="password"
                        :error-messages="errors.collect('password')"
                        required
                        type="password"
                ></v-text-field>
                <v-text-field
                        label="Invite Code"
                        v-model="inviteCode"
                        v-validate="'required'"
                        data-vv-name="Invite Code"
                        :error-messages="errors.collect('Invite Code')"
                        required
                        type="password"
                ></v-text-field>

                <v-btn type="submit" :disabled="!valid">Login</v-btn>
            </v-form>
            <v-alert type="error" v-show="errorMessage !== ''">{{ errorMessage }}</v-alert>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class SignUp extends Vue {
  valid: boolean = false;
  email: string = "";
  password: string = "";
  inviteCode: string = "";
  errorMessage: string = "";

  async signUp() {
    try {
      this.errorMessage = '';
      let isValid = await this.$validator.validateAll();

      if (isValid) {
        const response = await this.$store.state.httpClient.post(`${this.$store.state.apiUrl}/users`, {
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            inviteCode: this.inviteCode
          })
        });

        window.localStorage.setItem('token', response.token);
        this.$store.commit('setToken', response.token);
        let userId = await this.$store.state.httpClient.get(`${this.$store.state.apiUrl}/getUserId`);
        this.$store.commit('setUserId', userId);
        const user = await this.$store.state.httpClient.get(`${this.$store.state.apiUrl}/users/${userId}`);
        this.$store.commit('setUser', user);
        this.$router.push('leagues');

      }
    } catch(e) {
      this.errorMessage =  e;
    }
  }


  async login() {
    let response = await this.$store.state.httpClient.post(
      `${this.$store.state.apiUrl}/login`,
      {
        body: JSON.stringify({
          email: this.email,
          password: this.password
        })
      }
    );

    window.localStorage.setItem("token", response.token);
    this.$store.commit("setToken", response.token);
    let userId = await this.$store.state.httpClient.get(
      `${this.$store.state.apiUrl}/getUserId`
    );
    this.$store.commit("setUserId", userId);
    const user = await this.$store.state.httpClient.get(
      `${this.$store.state.apiUrl}/users/${userId}`
    );
    this.$store.commit("setUser", user);
    this.$router.push("home");
  }
}
</script>

<style scoped>
</style>
