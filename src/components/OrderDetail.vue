<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="order_detail"
        :search="search"
        sort-by="order"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Detalle Ventas</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field class="text-xs-center" v-model="search"  label="Busqueda" :append-icon="icons.mdiMagnify " single-line  hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="700px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2 ml-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Agregar producto a venta
                </v-btn>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="$router.push('/sales')"
                >
                  Regresar
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row >
                      <v-col cols="12" sm="12" md="12" class="p-0">
                        <v-select
                          :items="aviable_products"
                          label="Producto"
                          v-model="editedItem.article_id"
                          item-text="article_name"
                          item-value="article_id"
                        >
                          <template v-slot:item="{ item, attrs, on }">
                            <v-list-item
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-list-item-title
                                :id="attrs['aria-labelledby']"
                                v-text="item.article_name"
                                class="text-left"
                              ></v-list-item-title>
                            </v-list-item>
                          </template>
                        </v-select>
                      </v-col>
                      <v-col cols="12" sm="12" md="12" class="p-0">
                        <v-text-field
                          v-model="editedItem.unit_price"
                          label="Precio Unitario"
                        ></v-text-field>
                      </v-col>
                       <v-col cols="12" sm="12" md="12" class="p-0">
                        <v-text-field
                          v-model="editedItem.quantity"
                          label="Cantidad"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="4" class="p-0">
                       <v-checkbox
                        v-model="editedItem.is_active"
                        label="Activo"
                      ></v-checkbox>
                      </v-col>
                    </v-row>
                    
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="save"> Guardar </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Estas seguro de eliminar este producto</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancelar</v-btn
                  >
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >Aceptar</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
        </template>
        <template v-slot:no-data>
          <v-btn  @click="initialize"> No hay datos disponibles </v-btn>
        </template>
      </v-data-table>
    </v-flex>
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
import {
  mdiMagnify 
} from '@mdi/js'

export default {
  data() {
    return {
      order_id : this.$route.params.order_id,
      menu: false,
      search:'',
      overlay:false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Codigo Articulo",
          align: "left",
          sortable: true,
          value: "article_id",
        },
        {
          text: "Nombre Articulo",
          align: "left",
          sortable: true,
          value: "article_name",
        },
        {
          text: "Precio Unitario",
          align: "left",
          sortable: true,
          value: "unit_price",
        },
        {
          text: "Cantidad",
          align: "left",
          sortable: true,
          value: "quantity",
        },
        { text: "Estado", value: "text_active" },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      order_detail: [],
      editedIndex: -1,
      editedItem: {
        article_id:0,
        order_id:0,
        quantity:0,
        unit_price:0,
        is_active:1
      },
      defaultItem: {
        article_id:0,
        order_id:0,
        quantity:0,
        unit_price:0,
        is_active:1
      },
      icons:{
        mdiMagnify ,
      },
      aviable_products:[]
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar producto a venta" : "Editar producto de venta";
    },
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  created() {
    this.initialize();
    this.get_products();
  },
  methods: {
    get_products: function(){
      let $this = this;
      axios.get('articleActive/0').then(function(response){
        $this.aviable_products = response.data;
        // $this.aviable_products.forEach(function(item){
        //       item.article_name = item.first_name + " " + item.last_name;
        // })
      })
    },
    get_status_text(status){
      if(status == true || status  ==1){
        return 'Activo'
      }else{
        return 'Inactivo'
      }
    },
    initialize() {
        let $this = this;
        this.overlay = true;
        
        axios.get("orderDetail/"+this.order_id.toString()).then((response)=>{
            $this.order_detail = response.data
            $this.order_detail.forEach(function(item){
              item.text_active = $this.get_status_text(item.is_active)
            })
            $this.overlay = false;
        })
    },

    editItem(item) {
      this.editedIndex = this.order_detail.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.order_detail.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.overlay = true;
      let $this = this;
      let deleted_item = this.order_detail[this.editedIndex]
      let edited_index = this.editedIndex

      axios.delete("orderDetail/"+deleted_item.order_detail_id).then(()=>{
          $this.order_detail.splice(edited_index, 1);
          console.log(JSON.stringify($this.order_detail[edited_index]))
          $this.overlay = false;
      })
      this.closeDelete();
      
    },

    close() {
      this.dialog = false;
      this.file=null;
      this.url=null;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      this.overlay = true;
      this.editedItem.order_id = this.order_id;
      if (this.editedIndex > -1) {
        let $this = this;

        axios.put("orderDetail/"+this.editedItem.order_detail_id ,this.editedItem).then(()=>{
            $this.initialize();
        })

      } else {
        let $this = this;
        console.log(this.editedItem)
        axios.post("orderDetail",this.editedItem).then(()=>{
            $this.initialize();
        })
        
      }
      this.close();
    },
  },
};
</script>

<style scoped>
.p-0{
  padding:0px 15px 0px 15px !important;
}
</style>