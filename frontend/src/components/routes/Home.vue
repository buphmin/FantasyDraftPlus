<template>
    <p>
        Welcome to Fantasy Draft Plus!
    </p>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';


  @Component
  export default class Home extends Vue {
    message: string = 'Hello';
  }
</script>
<style scoped>

</style>