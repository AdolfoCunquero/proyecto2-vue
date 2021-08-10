<template>
  <div data-app>
    <Product/>
  </div>
  
</template>


<script>
// @ is an alias to /src
import Product from '@/components/Product.vue'

export default {
  name: 'ProductView',
  components: {
    Product
  }
}
</script>