<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="6">
        <v-img
          :src="require('../assets/vuetify.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col cols="6">
        <img alt="Vue logo" height="200" src="../assets/vue.png">
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="6">
        <v-img
          :src="require('../assets/laravel.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col cols="6">
        <img alt="Vue logo" height="200" src="../assets/mysql.png">
      </v-col>

    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data: () => ({
     
    }),
  }
</script>
