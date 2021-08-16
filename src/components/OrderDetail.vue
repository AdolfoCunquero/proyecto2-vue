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
                    <v-form
                      ref="form"
                      v-model="valid_form"
                      
                    >
                      <v-row >
                        <v-col cols="12" sm="12" md="12" class="p-0">
                          <v-autocomplete
                            :items="aviable_products"
                            label="Producto"
                            v-model="editedItem.article_id"
                            item-text="article_name"
                            item-value="article_id"
                            @change="select_product"
                            :rules="[v => !rules.autocomplete_required || !!v || 'Debe seleccionar un producto']"
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
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" class="p-0">
                          <v-text-field
                            v-model="editedItem.quantity"
                            label="Cantidad"
                            :rules="[rules.required, rules.no_zero]"
                            type="number"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" class="p-0">
                          <v-text-field
                            v-model="editedItem.unit_price"
                            label="Precio Unitario"
                            disabled
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" class="p-0">
                          <v-text-field
                            v-model="editedItem.stock"
                            label="Existencia actual"
                            disabled
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <!-- <v-row>
                        <v-col cols="12" sm="12" md="4" class="p-0">
                        <v-checkbox
                          v-model="editedItem.is_active"
                          label="Activo"
                        ></v-checkbox>
                        </v-col>
                      </v-row> -->
                    </v-form>
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
       rules: {
        required: value => value !== "" || 'Campo obligatorio',
        no_zero: value=> value > 0 || 'El campo no puede ser menor o igual a cero',
        autocomplete_required: {
          type: Boolean,
          default: false,
        },
      },
      valid_form: true,
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
        //{ text: "Estado", value: "text_active" },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      order_detail: [],
      editedIndex: -1,
      editedItem: {
        article_id:0,
        order_id:0,
        quantity:0,
        unit_price:0,
        is_active:1,
        stock:0
      },
      defaultItem: {
        article_id:0,
        order_id:0,
        quantity:0,
        unit_price:0,
        is_active:1,
        stock:0
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
        let products = response.data;
        $this.aviable_products = products.filter(item => item.stock > 0)
      }).catch(()=>{
        this.overlay = false;
        this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
      })
    },
    select_product:function(){
      this.editedItem.unit_price = this.aviable_products.find(item => item.article_id == this.editedItem.article_id).price;
      this.editedItem.stock = this.aviable_products.find(item => item.article_id == this.editedItem.article_id).stock;
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
        }).catch(()=>{
          this.overlay = false;
          this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
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
      }).catch(()=>{
        this.overlay = false;
        this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
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
      this.$refs.form.resetValidation();
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      if(this.$refs.form){
        this.$refs.form.resetValidation();
      }
    },

    save() {

      this.$refs.form.validate();
      if(!this.valid_form){
        return;
      }

      if(this.editedItem.quantity > this.aviable_products.find(item => item.article_id == this.editedItem.article_id).stock){
        this.$swal("Agregar producto", "La cantidad de producto no esta disponible", "warning");
        return;
      }

      this.overlay = true;
      this.editedItem.order_id = this.order_id;
      if (this.editedIndex > -1) {
        let $this = this;

        axios.put("orderDetail/"+this.editedItem.order_detail_id ,this.editedItem).then(()=>{
            $this.initialize();
        }).catch(()=>{
          this.overlay = false;
          this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
        })

      } else {
        let $this = this;
        console.log(this.editedItem)
        axios.post("orderDetail",this.editedItem).then(()=>{
            $this.initialize();
        }).catch(()=>{
          this.overlay = false;
          this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
        })
        
      }
      this.close();
      this.$refs.form.resetValidation();
    },
  },
};
</script>

<style scoped>
.p-0{
  padding:0px 15px 0px 15px !important;
}
</style>