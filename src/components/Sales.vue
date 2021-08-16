<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="orders"
        :search="search"
        sort-by="order"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Ventas</v-toolbar-title>
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
                  Nueva Orden de venta
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
                        <v-col cols="12" sm="12" md="6" class="p-0">
                          <v-autocomplete
                            :items="aviable_customers"
                            label="Cliente"
                            v-model="editedItem.customer_id"
                            item-text="customer_name"
                            item-value="customer_id"
                            required
                            :rules="[v => !rules.autocomplete_required || !!v || 'Debe seleccionar un cliente']"
                          >
                            <template v-slot:item="{ item, attrs, on }">
                              <v-list-item
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-list-item-title
                                  :id="attrs['aria-labelledby']"
                                  v-text="item.customer_name"
                                  class="text-left"
                                ></v-list-item-title>
                              </v-list-item>
                            </template>
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="12" sm="12" md="6" class="p-0">
                          <v-menu
                              ref="menu"
                              v-model="menu"
                              :rules="[rules.required]"
                              :close-on-content-click="false"
                              :return-value.sync="editedItem.order_date"
                              transition="scale-transition"
                              offset-y
                              min-width="auto"
                          >
                              <template v-slot:activator="{ on, attrs }">
                              <v-text-field
                                  v-model="editedItem.order_date"
                                  label="Fecha Venta"
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                  required
                              ></v-text-field>
                              </template>
                              <v-date-picker
                              v-model="editedItem.order_date"
                              no-title
                              scrollable
                              >
                              <v-spacer></v-spacer>
                              <v-btn
                                  text
                                  color="primary"
                                  @click="menu = false"
                              >
                                  Cancel
                              </v-btn>
                              <v-btn
                                  text
                                  color="primary"
                                  @click="$refs.menu.save(editedItem.order_date)"
                              >
                                  OK
                              </v-btn>
                              </v-date-picker>
                          </v-menu>
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
                    </v-form>
                  </v-container>
                </v-card-text>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="close">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue darken-1"  text @click="save(false)"> Guardar</v-btn>
                  <v-btn color="blue darken-1" text @click="save_and_add_products"> Guardar y agregar productos</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
              <v-card>
                <v-card-title class="text-h5"
                  >Estas seguro de eliminar esta venta</v-card-title
                >
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeDelete"
                    >Cancelar</v-btn>
                  <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                    >Aceptar</v-btn>
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogReport" max-width="1000px">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Orden de Venta - Tecno Global</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row >
                        <v-col cols="12" md="6" sm="12" class="text-left p-0">
                          <strong>No. Orden: </strong><label>{{order_report.order_id}}</label>
                        </v-col>
                         <v-col cols="12" md="6" sm="12" class="text-left p-0">
                          <strong>Fecha: </strong><label>{{order_report.order_date}}</label>
                        </v-col>
                    </v-row>
                    <v-row >
                        <v-col cols="12" md="12" sm="12" class="text-left p-0">
                          <strong>Nombre Cliente: </strong><label>{{order_report.customer_name}}</label>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="text-left p-0">
                          <strong>Direccion: </strong><label>{{order_report.address}}</label>
                        </v-col>
                        <v-col cols="12" md="12" sm="12" class="text-left p-0">
                          <strong>NIT: </strong><label>{{order_report.nit}}</label>
                        </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12" sm="12" class="">
                        <v-data-table
                          dense
                          :headers="headers_report"
                          :items="order_report.products"
                          item-key="article_id"
                          class="elevation-1"
                        ></v-data-table>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" md="12" sm="12" class="text-right">
                        <strong class="text-h6">Total: {{order_report.total}}</strong>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="closeReport"
                    >Cerrar</v-btn
                  >
                  <v-spacer></v-spacer>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon small class="mr-2" @click="editItem(item)"> mdi-pencil </v-icon>
          <v-icon small class="mr-2" @click="deleteItem(item)"> mdi-delete </v-icon>
          <v-icon small @click="showReport(item)"> mdi-file-chart </v-icon>
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
        autocomplete_required: {
          type: Boolean,
          default: false,
        },
      },
      valid_form:false,
      menu: false,
      search:'',
      overlay:false,
      dialog: false,
      dialogDelete: false,
      dialogReport:false,
      headers: [
        {
          text: "No. Documento",
          align: "left",
          sortable: true,
          value: "order_id",
        },
        {
          text: "Cliente",
          align: "left",
          sortable: true,
          value: "customer_name",
        },
        {
          text: "Fecha",
          align: "left",
          sortable: true,
          value: "order_date",
        },
        { text: "Estado", value: "text_active" },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      orders: [],
      editedIndex: -1,
      editedItem: {
        order_id:0,
        customer_id:0,
        order_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        is_active:1
      },
      defaultItem: {
        order_id:0,
        customer_id:0,
        order_date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        is_active:1
      },
      icons:{
        mdiMagnify ,
      },
      aviable_customers:[],
      headers_report:[
        {
          text: 'Producto',
          align: 'start',
          sortable: false,
          value: 'article_name',
        },
        {
          text: 'Precio unitario',
          align: 'start',
          sortable: false,
          value: 'unit_price',
        },
        {
          text: 'Cantidad',
          align: 'start',
          sortable: false,
          value: 'quantity',
        },
        {
          text: 'Subtotal',
          align: 'start',
          sortable: false,
          value: 'subtotal',
        },
      ],
      order_report:{
        order_id:0,
        customer_name:"",
        order_date:"",
        address:"",
        nit:"",
        total:0,
        products:[]
      }
    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Agregar orden de venta" : "Editar order de venta";
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
    this.get_customers();
  },
  methods: {
    get_customers: function(){
      let $this = this;
      axios.get('customerActive').then(function(response){
        $this.aviable_customers = response.data;
        $this.aviable_customers.forEach(function(item){
          item.customer_name = item.first_name + " " + item.last_name;
        })
      }).catch(()=>{
        this.overlay = false;
        this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
      })
    },
    get_status_text(status){
      if(status == true || status  ==1){
        return 'Activo'
      }else{
        return 'Inactivo'
      }
    },
    showReport(item){
      this.overlay = true
      this.order_report = Object.assign({}, item);
      let $this = this;
      axios.get("orderDetail/"+item.order_id.toString()).then((response)=>{
        let total = 0;
        $this.order_report.products = response.data
        $this.order_report.products.forEach(function(item){
          item.subtotal = item.unit_price * item.quantity;
          total += item.subtotal;
        })
        $this.order_report.total = total;
        $this.overlay = false;
        $this.dialogReport = true;
      }).catch(()=>{
        this.overlay = false;
        this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
      })
    },
    initialize() {
        let $this = this;
        this.overlay = true;
        
        axios.get("order").then((response)=>{
            $this.orders = response.data
            $this.orders.forEach(function(item){
              item.text_active = $this.get_status_text(item.is_active)
              item.customer_name = item.first_name + " " + item.last_name;
            })
            $this.overlay = false;
        }).catch(()=>{
          this.overlay = false;
          this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
        })
    },

    editItem(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.orders.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.overlay = true;
      let $this = this;
      let deleted_item = this.orders[this.editedIndex]
      let edited_index = this.editedIndex

      axios.delete("order/"+deleted_item.order_id).then(()=>{
          $this.orders.splice(edited_index, 1);
          console.log(JSON.stringify($this.orders[edited_index]))
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
    closeReport(){
      this.dialogReport = false;
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

    redirect_order_detail(order_id){
      this.$router.push({
        name:"order_detail",
        params:{
          order_id: order_id,
        }
      })
    },

    save_and_add_products(){
      this.save(true);
    },

    save(add_products) {
      this.$refs.form.validate();

      if(!this.valid_form){
        return;
      }
      
      this.overlay = true;
      if (this.editedIndex > -1) {
        let $this = this;
        let order_id = this.editedItem.order_id;

        axios.put("order/"+this.editedItem.order_id ,this.editedItem).then(()=>{
            if(add_products){
              $this.redirect_order_detail(order_id);
            }else{
              $this.initialize();
            }
        }).catch(()=>{
          this.overlay = false;
          this.$swal("Error", "Ocurrio un error al realizar la operacion :(", "error");
        })

      } else {
        let $this = this;
        axios.post("order",this.editedItem).then((response)=>{
            let data = response.data
            if(add_products){
              $this.redirect_order_detail(data.order_id);
            }else{
              data.text_active = $this.get_status_text(data.is_active)
              $this.orders.push(data);
              $this.overlay = false;
            }
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