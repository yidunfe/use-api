<template>
  <div class="home">
    productLoading: {{ $loadings.ProductService.productLoading }}
    <a-button :loading="$loadings.ProductService.productLoading" @click="queryProducts">queryProducts</a-button>
    <a-button @click="queryProducts">queryProducts no loading</a-button>
    <a-button @click="createProduct">createProduct</a-button>
    <ul>
      <li
        v-for="product in productList"
        :key="product.id">{{ product.name }}</li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import ProductService from '@/services/ProductService'
import Vue from 'vue'

let state = new Vue({
  data () {
    return  {
      test: false
    }
  }
})

export default {
  name: 'Home',
  data () {
    return {
      productList: []
    }
  },
  methods: {
    async queryProducts () {
      this.productList = await ProductService.queryProducts({ type: 1 })
      // state.test = !state.test
      console.log('queryProducts', this.productList)
    },
    async createProduct () {
      // this.productList = await ProductService.queryProducts({ type: 1 })
      const id = await ProductService.createProduct({ name: '产品名称' })
      console.log(id)

    }
  }
}
</script>
