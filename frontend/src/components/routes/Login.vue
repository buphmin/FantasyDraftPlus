<template>
    <v-layout>
        <v-flex md10 offset-md1>
            <v-form v-model="valid" @submit.prevent="login()">
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


                <v-btn type="submit">Login</v-btn>
            </v-form>
        </v-flex>
    </v-layout>

</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';


  @Component
  export default class Login extends Vue {
    valid: boolean = false
    email: string = '';
    password: string = '';

    async login() {
      let isValid = await this.$validator.validateAll();

      if(isValid) {
        let response = await this.$store.state.httpClient.post(`${this.$store.state.apiUrl}/login`, {
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });

        window.localStorage.setItem('token', response.token);
        this.$store.commit('setToken', response.token);
        this.$router.push('home');
      }

    }
  }
</script>

<style scoped>

</style>