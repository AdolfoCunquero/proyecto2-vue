<template>
  <v-layout>
      
    
  <v-navigation-drawer permanent app clipped v-if="show_category_list">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="text-h6 text-left">
          Bienvenido
        </v-list-item-title>
        <v-list-item-subtitle class="text-left">
          Cliente
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list
      dense
      nav
    >
      <v-list-item
        v-for="item in categories"
        :key="item.category_id"
        link
        v-model="category_selected"
        class="text-left"
        @click="selctCategory(item.category_id)"
      >
        <v-list-item-icon>
          <v-icon>{{ icons.mdiChevronRight  }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.category_name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
   
     

  <v-app-bar color="primary"  app clipped-left dark>
    <v-app-bar-nav-icon @click="show_category_list = !show_category_list"></v-app-bar-nav-icon>
    <v-toolbar-title style="color:white;" >Tecno Global</v-toolbar-title>

    <v-spacer></v-spacer>

      <!-- <v-btn icon tile>
        <v-icon>{{icons.mdiAccount}}</v-icon>
        Login
      </v-btn> -->
    <div class="float-right">  
      <v-btn
      color="indigo"
      @click="login"
      small
      >
        <v-icon left>
          {{icons.mdiAccount}}
        </v-icon>
        Login
      </v-btn>
    </div>
  </v-app-bar>

    <!-- Sizes your content based upon application components -->
      <v-main class="pl-0 pt-0">
      
        <!-- Provides the application the proper gutter -->
        <v-container fluid>

           <v-layout align-start>

             <v-flex>
               <v-row>
                 <v-col cols="12" sm="12" md="6">
                   <div class="text-h4 text-left">
                     Nuestros Productos
                   </div>
                 </v-col>
                  <v-col cols="12" sm="12" md="4">
                    <v-text-field @keydown.enter="buscar_producto" class="text-xs-center" v-model="search_product"  label="Busqueda" :append-icon="icons.mdiMagnify" single-line  hide-details></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="2">
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      @click="buscar_producto"
                    >
                      Buscar
                    </v-btn>
                  </v-col>
                </v-row>
                


                 <v-row class="text-center" v-if="products.length == 0 && overlay == false">
                  <v-col cols="12" md="12" sm="12">
                    <v-img
                      :src="require('../assets/no-results.png')"
                      class="my-3"
                      contain
                      height="340"
                    />
                  </v-col>
                  <v-col cols="12" md="6" offset="3" sm="12">
                      <v-alert
                        text
                        dense
                        color="deep-orange"
                        border="left"
                        icon="mdi-alert">
                        Productos no encontrados
                      </v-alert>
                   </v-col>
                </v-row>


              <v-row>
                <v-col cols="12" sm="12" md="4"  v-for="(item,i) in products" :key="i">
                  <v-card
                    :loading="loading"
                    class="mx-auto my-4"
                    max-width="380"
                    height="100%"
                    style="margin-bottom:75px;"
                    
                  >
                    <template slot="progress">
                      <v-progress-linear
                        color="deep-purple"
                        height="10"
                        indeterminate
                      ></v-progress-linear>
                    </template>

                    <v-img
                      max-height="300"
                      width="325" 
                      align="center"
                      :lazy-src="require('../assets/background-white.png')"
                      :src="item.image_path"
                      loading="lazy"
                      class="text-center"
                      
                    >
                    
                    <template v-slot:placeholder>
                      <v-row
                        class="fill-height ma-0"
                        align="center"
                        justify="center"
                      >
                        <v-progress-circular
                          indeterminate
                          color="grey"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                    
                    </v-img>

                    <v-card-title>{{item.article_name}}</v-card-title>

                    <v-card-text style="margin-bottom:75px;">
                      <v-row
                        align="center"
                        class="mx-0"
                      >
                      </v-row>
                      <div>{{item.description}}</div>
                    </v-card-text>
                    
                    
                    <div style="position:absolute; bottom:0; width:100%">
                      <v-divider class="mx-4"></v-divider>
                      <v-card-text>
                        <v-row>
                          <v-col style="padding-bottom:0px;" cols="12" md="12" sm="12">
                            <v-chip-group
                            >
                              <v-chip class="mx-auto default">Tecno Precio: {{item.price}}</v-chip>
                            </v-chip-group>
                          </v-col>
                        </v-row>
                        <v-row>
                          <v-col cols="12" md="12" sm="12">
                            <!-- <v-btn
                              color="primary "
                              @click="reserve"
                              small
                            >
                              Añadir al carrito
                            </v-btn> -->
                            <v-alert 
                              v-if="item.stock > 0"
                              text
                              dense
                              color="success"
                              icon="mdi-cart-arrow-right"
                              border="left">
                              Tenemos existencias: {{item.stock}}
                            </v-alert>
                            <v-alert
                              v-else
                              text
                              dense
                              color="deep-orange"
                              border="left"
                              icon="mdi-alert">
                              Temporalmente agotado
                            </v-alert>
                          </v-col>
                        </v-row>
                      
                      </v-card-text>
                    </div>
                    

                    <v-card-actions>
                      
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
             </v-flex>
           </v-layout>
        </v-container>
      </v-main>

      <v-footer app>
        <!-- -->
      </v-footer>
      

      <v-overlay :value="overlay">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
  


  </v-layout>
  
</template>


<script>

import axios from 'axios'
import { mdiCheckBold, mdiChevronRight,mdiAccount  } from '@mdi/js';


export default {
  data: () => ({
    search_product:'',
    overlay:false,
    show_category_list:true,
    loading: false,
    category_selected:0,
    selection: 0,
    products :[],
    categories:[],
    drawer: true,
    mini: false,
    items: [
        { title: 'Dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Photos', icon: 'mdi-image' },
        { title: 'About', icon: 'mdi-help-box' },
      ],
    right: null,
    icons:{
      mdiCheckBold,
      mdiChevronRight,
      mdiAccount
    }
  }),

  methods: {
    buscar_producto:function(){
      
      let $this = this;
      this.overlay = true;
      if(this.search_product == ""){
        this.load_products(0);
      }else{
        axios.get("searchArticle/"+this.search_product).then((response)=>{
            $this.products = response.data
            $this.products.forEach(function(item){
              item.image_path = axios.defaults.baseURL+"images/"+item.image_path;
              item.isLoad = false;
            })
            $this.overlay = false;
        })
      }
      
    },
    selctCategory:function(category_id){
      this.load_products(category_id);
    },
    image_loaded: function(item){
      item.isLoad = true;
      console.log('carga imagen');
    },
    load_categories:function(){
      let $this = this;
      axios.get('categoryActive').then(function(response){
        
        $this.categories = response.data;
        $this.categories.unshift({
          "category_name":"Todas las categorias",
          "category_id": 0
        })
      })
    },
    load_products:function(category_id){
      let $this = this;
      this.overlay = true;
      axios.get("articleActive/"+category_id.toString()).then((response)=>{
          $this.products = response.data
          $this.products.forEach(function(item){
            item.image_path = axios.defaults.baseURL+"images/"+item.image_path;
            item.isLoad = false;
          })
          $this.overlay = false;
      })
    },
    login:function () {
      this.$router.push('/login');
    },
  },
  created:function(){
    this.load_categories();
    this.load_products(0);
  }
}
</script>