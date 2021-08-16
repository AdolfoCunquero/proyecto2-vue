<template>
  <div data-app>
    <Customer/>
  </div>
  
</template>


<script>
// @ is an alias to /src
import Customer from '@/components/Customer.vue'

export default {
  name: 'CustomerView',
  components: {
    Customer
  },
  created:function(){
    if (!this.$session.exists()) {
      this.$router.push('/');
    }
  }
}
</script>