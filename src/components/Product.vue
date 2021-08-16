<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="products"
        :search="search"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Productos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field class="text-xs-center" v-model="search"  label="Busqueda" :append-icon="icons.mdiMagnify " single-line  hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="700px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nuevo producto
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
                            :items="aviable_categories"
                            label="Categoria"
                            v-model="editedItem.category_id"
                            item-text="category_name"
                            item-value="category_id"
                            :rules="[v => !rules.autocomplete_required || !!v || 'Debe seleccionar una categoria']"
                          >
                            <template v-slot:item="{ item, attrs, on }">
                              <v-list-item
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-list-item-title
                                  :id="attrs['aria-labelledby']"
                                  v-text="item.category_name"
                                  class="text-left"
                                ></v-list-item-title>
                              </v-list-item>
                            </template>
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="p-0">
                          <v-text-field
                            v-model="editedItem.article_name"
                            label="Nombre producto"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="12" class="p-0">
                          <v-text-field
                            v-model="editedItem.description"
                            label="Descripcion"
                            :rules="[rules.required]"
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="4" class="p-0">
                          <v-text-field
                          type="number"
                            v-model="editedItem.price"
                            label="Precio"
                            :rules="[rules.required, rules.no_zero]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" class="p-0">
                          <v-text-field
                            type="number"
                            v-model="editedItem.stock"
                            label="Existencia"
                            aria-autocomplete="false"
                            :rules="[rules.required,rules.no_negative]"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="12" md="4" class="p-0">
                        <v-checkbox
                          v-model="editedItem.is_active"
                          label="Activo"
                        ></v-checkbox>
                        </v-col>
                      </v-row>
                      <v-row>
                          <v-col cols="12" sm="12" md="8" class="p-0">
                              <v-file-input
                                  
                                  type="file"
                                  accept="image/png, image/jpeg, image/bmp"
                                  placeholder="Selecciona una imagen"
                                  prepend-icon="mdi-camera"
                                  label="Selecciona una imagen"
                                  v-model="file"
                                  ref="file"
                                  id="file"
                                  @change="handleFileUpload()"
                              ></v-file-input>
                              <!-- <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/> -->
                          </v-col>
                          <v-col cols="12" sm="12" md="4" class="p-0">
                              <v-img max-height="150" max-width="150" :src="editedItem.image_path"></v-img>
                          </v-col>
                      </v-row>
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
      file:null,
      rules: {
        required: value => value !== "" || 'Campo obligatorio',
        image_required: value => !!value  || 'Debe seleccionar una imagen',
        no_zero: value=> value > 0 || 'El campo no puede ser menor o igual a cero',
        no_negative: value => value >= 0 || 'El campo no puede ser negativo',
        value:value => !value || value.size < 2000000 || 'La imagen no puede ser mayor a 2 MB!',
        autocomplete_required: {
          type: Boolean,
          default: false,
        },
      },
      valid_form: true,
      search:'',
      overlay:false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Nombre producto",
          align: "left",
          sortable: true,
          value: "article_name",
        },
        {
          text: "Descripcion",
          align: "left",
          sortable: true,
          value: "description",
        },
        {
          text: "Precio",
          align: "left",
          sortable: true,
          value: "price",
        },
        {
          text: "Existencia",
          align: "left",
          sortable: true,
          value: "stock",
        },
        { text: "Estado", value: "text_active" },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      products: [],
      editedIndex: -1,
      editedItem: {
        article_name: "",
        description:"",
        image_path:'',
        category_id:0,
        is_active: 1,
        price:0,
        stock:0
      },
      defaultItem: {
        article_name: "",
        description:"",
        image_path:"",
        category_id:0,
        is_active: 1,
        price:0,
        stock:0
      },
      icons:{
        mdiMagnify ,
      },
      aviable_categories:[]
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar producto" : "Editar producto";
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
    this.get_categories();
  },
  methods: {
    get_categories: function(){
      let $this = this;
      axios.get('categoryActive').then(function(response){
        $this.aviable_categories = response.data;
      })
    },
    get_status_text(status){
      if(status == true || status  ==1){
        return 'Activo'
      }else{
        return 'Inactivo'
      }
    },
    handleFileUpload(){
      if(this.file){
        this.editedItem.image_path= URL.createObjectURL(this.file)
      }
    },
    initialize() {
        let $this = this;
        this.overlay = true;
        
        axios.get("article").then((response)=>{
            $this.products = response.data
            $this.products.forEach(function(item){
              item.image_path = axios.defaults.baseURL+"images/"+item.image_path;
              item.text_active = $this.get_status_text(item.is_active)
            })
            $this.overlay = false;
        }).catch(()=>{
          this.overlay = false;
          this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
        })
    },

    editItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.products.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.overlay = true;
      let $this = this;
      let deleted_item = this.products[this.editedIndex]
      let edited_index = this.editedIndex

      axios.delete("article/"+deleted_item.article_id).then(()=>{
          $this.products.splice(edited_index, 1);
          console.log(JSON.stringify($this.products[edited_index]))
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

      //console.log(this.editedItem.image_path)

      this.$refs.form.validate();
      if(!this.valid_form){
        return;
      }

      this.overlay = true;
      let $this = this;
      if (this.editedIndex > -1) {
        
        let formData = new FormData();
        
        if(this.file != null){
            formData.append('image', this.file, this.file.name);
        }
        
        formData.append('category_id',this.editedItem.category_id);
        formData.append('article_name',this.editedItem.article_name);
        formData.append('description',this.editedItem.description);
        formData.append('price',this.editedItem.price);
        formData.append('stock',this.editedItem.stock);
        formData.append('is_active',this.editedItem.is_active == true? 1 : 0);
        
        axios.post("article/"+this.editedItem.article_id.toString()+'?_method=PUT', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
        }).then((response)=>{
            console.log(response)
            $this.initialize();
        }).catch(()=>{
          this.overlay = false;
          this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
        })

      } else {
        let formData = new FormData();
        if(this.file != null){
          formData.append('image', this.file,this.file.name);
        }
        formData.append('category_id',this.editedItem.category_id);
        formData.append('article_name',this.editedItem.article_name);
        formData.append('description',this.editedItem.description);
        formData.append('price',this.editedItem.price);
        formData.append('stock',this.editedItem.stock);
        formData.append('is_active',this.editedItem.is_active == true? 1 : 0);
        
        axios.post("article",formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
        }).then(()=>{
            $this.file = null;
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