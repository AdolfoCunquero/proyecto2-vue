<template>
  <div data-app>
    <Store/>
  </div>
  
</template>


<script>
// @ is an alias to /src
import Store from '@/components/Store.vue'

export default {
  name: 'StoreView',
  components: {
    Store
  }
}
</script>