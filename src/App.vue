<template>
  <div id="app">
    <v-app>
      <v-navigation-drawer app clipped
          v-model="drawer"
          :mini-variant.sync="mini"
          permanent
        >
          <v-list-item class="px-2">
            <v-list-item-avatar>
              <v-img src="https://adolfocunquero.github.io/Proyecto1/img/TecnoGlobal2.png"></v-img>
            </v-list-item-avatar>
    
            <v-list-item-title>Administrador</v-list-item-title>
    
            <v-btn
              icon
              @click.stop="mini = !mini"
            >
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
          </v-list-item>
    
          <v-divider></v-divider>
    
          <v-list >
             <v-list-item-group v-model="item_active" color="primary">
              <v-list-item
                v-for="(item,i) in items"
                :key="i"
                class="text-md-left text-sm-left text-xs-left"
                link
                @click="$router.push(item.route)"
              >
                <v-list-item-icon>
                  <v-icon>{{item.icon}}</v-icon>
                </v-list-item-icon>
      
                <v-list-item-content>
                  <!-- <router-link :to="item.route"><v-list-item-title>{{item.title}}</v-list-item-title></router-link> -->
                  <v-list-item-title>
                    {{ item.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
             </v-list-item-group>
          </v-list>
      </v-navigation-drawer>

      <v-app-bar color="primary" app clipped-left>
        <v-toolbar-title style="color:white;" >Tecno Global</v-toolbar-title>
      </v-app-bar>

    <!-- Sizes your content based upon application components -->
      <v-main>

        <!-- Provides the application the proper gutter -->
        <v-container fluid>

          <!-- If using vue-router -->
          <router-view></router-view>
        </v-container>
      </v-main>

      <v-footer app>
        <!-- -->
      </v-footer>
    </v-app>

  </div>
</template>

<script>

import {
    mdiHome,
    mdiShape,
    mdiPointOfSale,
    mdiLaptop,
  } from '@mdi/js'


export default({
 data(){
   return {
      drawer: true,
      item_active:0,
      items: [
        { title: 'Home', icon: mdiHome, route:'/' },
        //{ title: 'About', icon: mdiHome, route:'/about' },
        { title: 'Categorias', icon: mdiShape, route:'/category' },
        { title: 'Productos', icon: mdiLaptop, route:'/product' },
        { title: 'Ventas', icon: mdiPointOfSale, route:'/category' },
      ],
      mini: false,
      icons:{
        
      }

   }
 }
})
</script>



<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
