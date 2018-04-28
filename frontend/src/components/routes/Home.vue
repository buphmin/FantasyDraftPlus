<template>
    <div>
        {{ message }}
    </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';


  @Component
  export default class Home extends Vue {
    message: string = 'Hello';

    async mounted() {

      console.log('test');
    }
  }
</script>
<style scoped>

</style>