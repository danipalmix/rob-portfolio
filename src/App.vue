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
@import url("https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,300..900;1,300..900&display=swap");

#app {
  font-family: 'Nunito', sans-serif;
  color: #393939;
  overflow-x: hidden;
}
</style>
