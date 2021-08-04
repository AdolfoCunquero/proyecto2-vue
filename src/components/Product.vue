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
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.article_name"
                          label="Nombre producto"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="editedItem.description"
                          label="Descripcion"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                        type="number"
                          v-model="editedItem.price"
                          label="Precio"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="4">
                        <v-text-field
                          type="number"
                          v-model="editedItem.stock"
                          label="Existencia"
                          aria-autocomplete="false"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="4">
                       <v-checkbox
                        v-model="editedItem.is_active"
                        label="Activo"
                      ></v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="12" md="8">
                            <v-file-input
                                :rules="rules"
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
                        <v-col cols="12" sm="12" md="4">
                            <v-img max-height="150" max-width="150" :src="editedItem.image_path"></v-img>
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
        <template v-slot:item.actions="{ item }">
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
      rules: [
        value => !value || value.size < 2000000 || 'La imagen no puede ser mayor a 2 MB!',
      ],
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
        is_active: 1,
        price:0,
        stock:0
      },
      defaultItem: {
        article_name: "",
        descriptionl:"",
        image_path:"",
        is_active: 1,
        price:0,
        stock:0
      },
      icons:{
        mdiMagnify ,
      }
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
  },
  methods: {
    get_status_text(status){
      if(status == true || status  ==1){
        return 'Activo'
      }else{
        return 'Inactivo'
      }
    },
    handleFileUpload(){
        this.editedItem.image_path= URL.createObjectURL(this.file)
    },
    initialize() {
        let $this = this;
        this.overlay = true;
        axios.get("http://localhost:8000/api/article").then((response)=>{
            $this.products = response.data
            $this.products.forEach(function(item){
              item.image_path = "http://localhost:8000/api/"+item.image_path;
              item.text_active = $this.get_status_text(item.is_active)
            })
            $this.overlay = false;
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

      axios.delete("http://localhost:8000/api/article/"+deleted_item.article_id).then(()=>{
          $this.products.splice(edited_index, 1);
          console.log(JSON.stringify($this.products[edited_index]))
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
      if (this.editedIndex > -1) {
        
        let formData = new FormData();
        if(this.file != null){
            formData.append('image', this.file, this.file.name);
        }
        
        formData.append('category_id',1);
        formData.append('article_name',this.editedItem.article_name);
        formData.append('description',this.editedItem.description);
        formData.append('price',this.editedItem.price);
        formData.append('stock',this.editedItem.stock);
        formData.append('is_active',this.editedItem.is_active);
        let $this = this;

        axios.post("http://localhost:8000/api/article/"+this.editedItem.article_id.toString()+'?_method=PUT', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
        }).then((response)=>{
            console.log(response)
            $this.initialize();
        })

      } else {
        let formData = new FormData();
        formData.append('image', this.file,this.file.name);
        formData.append('category_id',1);
        formData.append('article_name',this.editedItem.article_name);
        formData.append('description',this.editedItem.description);
        formData.append('price',this.editedItem.price);
        formData.append('stock',this.editedItem.stock);
        formData.append('is_active',this.editedItem.is_active);
        let $this = this;

        axios.post("http://localhost:8000/api/article",formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
        }).then(()=>{
            $this.file = null;
            $this.initialize();
            $this.overlay = false;
        })
        
      }
      this.close();
    },
  },
};
</script>
