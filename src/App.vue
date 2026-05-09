<template>
  <v-app>
    <v-main>
      <rob-portfolio></rob-portfolio>
    </v-main>
  </v-app>
</template>

<script>
import RobPortfolio from "@/components/rob-portfolio.vue";

export default {
  name: 'App',
  components: {
    RobPortfolio,
  },
  data: () => ({
    //
  }),
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=RocknRoll+One&display=swap");

#app {
  font-family: 'RocknRoll One', sans-serif;
  overflow-x: hidden;
}
</style>
