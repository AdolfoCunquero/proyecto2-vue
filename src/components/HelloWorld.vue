<template>
  <v-container>
   
    <v-row class="text-center">
      <v-col cols="4">
        <v-img
          :src="require('../assets/php.svg')"
          class="my-3"
          contain
          height="125"
        />
      </v-col>
      <v-col cols="4">
        <v-img
          :src="require('../assets/laravel.png')"
          class="my-3"
          contain
          height="150"
        />
      </v-col>
      <v-col cols="4">
        <v-img
          :src="require('../assets/mysql.png')"
          class="my-3"
          contain
          height="150"
        />
      </v-col>

    </v-row>

    <v-row class="text-center">
      <v-col cols="4">
        <v-img
          :src="require('../assets/heroku.png')"
          class="my-3"
          contain
          height="150"
        />
      </v-col>
      <v-col cols="4">
        <v-img
          :src="require('../assets/vue.png')"
          class="my-3"
          contain
          height="150"
        />
      </v-col>
      <v-col cols="4">
        <v-img
          :src="require('../assets/s3.png')"
          class="my-3"
          contain
          height="150"
        />
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
