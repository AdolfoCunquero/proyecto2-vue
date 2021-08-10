<template>
  <v-container>
   
    <v-row class="text-center">
      <v-col cols="12" md="12" sm="12">
        <v-img
          :src="require('../assets/TecnoGlobal.png')"
          class="my-3"
          contain
          height="300"
        />
      </v-col>

    </v-row>

    <v-row class="text-center">
      <v-col cols="12" md="2" sm="12">
        <v-img
          :src="require('../assets/php.svg')"
          class="my-3"
          style="margin-top:25px !important;"
          contain
          height="100"
        />
      </v-col>
      <v-col cols="12" md="2" sm="12">
        <v-img
          :src="require('../assets/laravel.png')"
          class="my-3"
          contain
          height="150"
        />
      </v-col>
       <v-col cols="12" md="2" sm="12">
        <v-img
          :src="require('../assets/mysql.png')"
          class="my-3"
          contain
          height="150"
        />
      </v-col>
      <v-col cols="12" md="2" sm="12">
        <v-img
          :src="require('../assets/vue.png')"
          class="my-3"
          contain
          height="150"
        />
      </v-col>
      <v-col cols="12" md="2" sm="12">
        <v-img
          :src="require('../assets/heroku.png')"
          class="my-3"
          contain
          style="margin-top:25px !important;"
          height="100"
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
