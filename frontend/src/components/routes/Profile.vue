<template>
    <v-layout>
        <v-flex md10 offset-md1>
            <h1>
                Profile
            </h1>

            <v-alert type="success" v-model="showInfo" dismissible>{{ infoMessage }}</v-alert>
            <v-alert type="error" v-model="showError" dismissible>{{ errorMessage }}</v-alert>

            <h2>Reset Password</h2>
            <v-form @submit.prevent="resetPassword()">
                <v-text-field
                        v-validate="'required|max:10'"
                        v-model="password"
                        :error-messages="errors.collect('password')"
                        label="Password"
                        type="password"
                        name="password"
                        required
                ></v-text-field>
                <v-text-field
                        v-validate="'required|confirmed:password'"
                        v-model="passwordMatch"
                        :error-messages="errors.collect('passwordMatch')"
                        label="Confirm Password"
                        type="password"
                        name="passwordMatch"
                        data-vv-as="password"
                        required
                ></v-text-field>

                <v-btn color="blue" type="submit">Submit Reset</v-btn>
            </v-form>

            <h2>
                Draft Notification Emails
            </h2>

            
            <v-form @submit.prevent="updateEmailStatus()">
                <v-switch
                        v-model="sendEmails"
                        label="Send me emails notifying me that it is my turn to draft?">
                </v-switch>

                <v-btn color="blue" type="submit">Submit</v-btn>
            </v-form>


        </v-flex>
    </v-layout>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component
export default class Profile extends Vue {
  infoMessage: string = "";
  showInfo: boolean = false;
  errorMessage: string = '';
  showError: boolean = false;
  password: string = "";
  passwordMatch: string = "";
  sendEmails: boolean = this.$store.state.user.send_emails;

  async updateEmailStatus(): Promise<void> {
    this.showError = false;
    const baseUrl: string = this.$store.state.apiUrl;

    try {
      await this.$store.state.httpClient.post(
        `${baseUrl}/users/update-emails`,
        {
          body: JSON.stringify({
            sendEmails: this.sendEmails
          })
        }
      );

      let user = this.$store.state.user;
      user.send_emails = this.sendEmails;

      this.$store.commit('setUser', user);

      this.showInfo = true;
      this.infoMessage = 'Updated email notification status';
    } catch(e) {
      this.showError = true;
      this.errorMessage = 'Error updating email notifications';
    }
  }

  async resetPassword() {
    this.showError = false;
    const isValid: boolean = await this.$validator.validateAll();
    const baseUrl: string = this.$store.state.apiUrl;

    try {
      if(isValid) {
        await this.$store.state.httpClient.post(
          `${baseUrl}/users/reset-password`,
          {
            body: JSON.stringify({
              password: this.password
            })
          }
        );

        this.infoMessage = "Password updated.";
        this.showInfo = true;

      }
    } catch(e) {
        this.showInfo = false;
        this.errorMessage = "Error updating password";
        this.showError = true;
    }
  }
}
</script>

<style scoped>
</style>
