<template >
   <div>
      <v-main  class="bg">
         <v-container fluid fill-height>
            <v-layout align-center justify-center>
               <v-flex xs12 sm8 md4>
                  <v-card class="elevation-12">
                     <v-toolbar dark color="primary">
                        <v-toolbar-title>Tecno Global</v-toolbar-title>
                     </v-toolbar>
                     <v-card-text>
                        <v-form>
                           <v-text-field
                              :prepend-icon="icons.mdiAccount"
                              name="login"
                              label="Login"
                              v-model="username"
                              type="email"
                              autocomplete="none"
                           ></v-text-field>
                           <v-text-field
                              id="password"
                              v-model="password"
                              :prepend-icon="icons.mdiLock"
                              name="password"
                              label="Password"
                              type="password"
                              @keydown.enter="login"
                           ></v-text-field>
                        </v-form>
                     </v-card-text>
                     <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="login"
                           :loading="loading"
                           :disabled="loading"
                        >Login</v-btn>
                     </v-card-actions>
                  </v-card>
               </v-flex>
            </v-layout>
         </v-container>
      </v-main>
   </div>
 
</template>
<script>

import { mdiAccount,mdiLock } from '@mdi/js';
import axios from 'axios'

export default {
   name: 'LoginView',
   data:function(){
       return {
           icons:{
               mdiAccount,
               mdiLock
           },
           username:"",
           password:"",
           loading:false
       }
   },
   methods:{
      login: function(){
         let $this = this;

         if(this.username == "" || this.password == ""){
            this.$swal("Datos incorrectos", "Debe ingresar usuario y contraseña", "error");
            return;
         }
         this.loading = true;
         axios.post('signin',{email:this.username, password: this.password}).then(function(response){
            let data = response.data;
            $this.loading = false;
            if(data.error){
               $this.$swal("No autorizado", "Usuario o contraseña incorrecto", "error");
               $this.username = '';
               $this.password = '';
               return;
            }else{
               $this.$session.start();
               $this.$session.set('user', data);
               $this.$router.push('/admin');
            }
         })
      }
   }
   
};
</script>

<style>
.bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url( '../assets/2843425.jpg') no-repeat center center;
    background-size: cover;
  }
</style>
