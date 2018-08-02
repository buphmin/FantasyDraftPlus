<template>
    <div>
        <v-dialog v-model="value" max-width="500px">
            <v-card>
                <v-card-title>
                    <span>{{ confirmationMessage }}</span>
                </v-card-title>
                <v-card-actions>
                    <v-btn color="green" @click.stop="successCallback(); updateValue(false);">{{ positiveButtonText }}</v-btn>
                    <v-btn color="red" @click.stop="updateValue(false);">{{ negativeButtonText }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component, Prop} from 'vue-property-decorator';

  @Component
  export default class DraftConfirmationDialog extends Vue {
    name: string = 'draft-confirmation-dialog';
    @Prop({default: false})
    value: boolean = false;

    @Prop({default: 'Confirm?'})
    confirmationMessage!: string;

    @Prop({default: 'No'})
    negativeButtonText!: string;

    @Prop({default: 'Yes'})
    positiveButtonText!: string;

    @Prop({type: Function})
    callback: any;

    @Prop()
    callbackOptions: any;

    successCallback() {

      this.callback(this.callbackOptions);
    }

    updateValue(data: boolean) {
      console.log('confirmation clicked', data);
      this.$emit('input', data);
    }
  }
</script>

<style scoped>

</style>