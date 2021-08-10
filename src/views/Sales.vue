<template>
  <div data-app>
    <Sales/>
  </div>
  
</template>


<script>
// @ is an alias to /src
import Sales from '@/components/Sales.vue'

export default {
  name: 'SalesView',
  components: {
    Sales
  }
}
</script>