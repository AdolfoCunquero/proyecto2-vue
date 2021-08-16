<template>
  <div data-app>
    <OrderDetail/>
  </div>
  
</template>


<script>
// @ is an alias to /src
import OrderDetail from '@/components/OrderDetail.vue'

export default {
  name: 'OrderDetailView',
  components: {
    OrderDetail
  },
  created:function(){
    if (!this.$session.exists()) {
      this.$router.push('/');
    }
  }
}
</script>