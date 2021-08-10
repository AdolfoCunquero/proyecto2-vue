import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Category from '../views/Category.vue'
import Product from '../views/Product.vue'
import Store from '../views/Store.vue'
import Login from '../views/Login.vue'
import Customer from '../views/Customer.vue'
import Sales from '../views/Sales.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'store',
    component: Store
  },
  {
    path: '/category',
    name: 'category',
    component: Category
  },
  {
    path: '/customer',
    name: 'customer',
    component: Customer
  },
  {
    path: '/product',
    name: 'product',
    component: Product
  },
  {
    path: '/sales',
    name: 'sales',
    component: Sales
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/admin',
    name: 'admin',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
