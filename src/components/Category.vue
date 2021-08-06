<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="categories"
        :search="search"
        sort-by="calories"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Categorias</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-text-field class="text-xs-center" v-model="search"  label="Busqueda" :append-icon="icons.mdiMagnify " single-line  hide-details></v-text-field>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog" max-width="500px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  Nueva categoria
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
                          v-model="editedItem.category_name"
                          label="Nombre categoria"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <!-- <v-text-field
                          v-model="editedItem.is_active"
                          label="Activo"
                        ></v-text-field> -->
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
                  >Estas seguro de eliminar esta categoria</v-card-title
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
      search:'',
      overlay:false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Nombre categoria",
          align: "left",
          sortable: true,
          value: "category_name",
        },
        { text: "Estado", value: "text_active" },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      categories: [],
      editedIndex: -1,
      editedItem: {
        category_name: "",
        is_active: 1,
      },
      defaultItem: {
        category_name: "",
        is_active: 1,
      },
      icons:{
        mdiMagnify ,
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar categoria" : "Editar categoria";
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
    initialize() {
        let $this = this;
        this.overlay = true;
        axios.get("category").then((response)=>{
            $this.categories = response.data
            $this.categories.forEach(function(item){
              item.text_active = $this.get_status_text(item.is_active)
            })
            $this.overlay = false;
        })
    },

    editItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.overlay = true;
      let $this = this;
      let deleted_item = this.categories[this.editedIndex]
      let edited_index = this.editedIndex

      axios.delete("category/"+deleted_item.category_id).then(()=>{
          $this.categories.splice(edited_index, 1);
          console.log(JSON.stringify($this.categories[edited_index]))
          $this.overlay = false;
      })
      this.closeDelete();
      
    },

    close() {
      this.dialog = false;
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
        let $this = this;

        axios.put("category/"+this.editedItem.category_id ,this.editedItem).then(()=>{
            $this.initialize();
        })

      } else {
        let $this = this;
        axios.post("category",this.editedItem).then((response)=>{
            let data = response.data
            data.text_active = $this.get_status_text(data.is_active)
            $this.categories.push(data);
            $this.overlay = false;
        })
        
      }
      this.close();
    },
  },
};
</script>
