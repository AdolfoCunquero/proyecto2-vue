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
  }
}
</script>