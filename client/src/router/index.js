import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Flights from '../views/Flights.vue'
import StaffDashboard from '../views/StaffDashboard.vue'
import FlightDisplay from '../views/FlightDisplay.vue'
import BADashboard from '../views/BADashboard.vue'
import CustomerProfile from '../views/CustomerProfile.vue'
import store from '../store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: (to, from, next) => {
        console.log(store.getters.user)
        if(store.getters.user) { next() } else { next('/login') }
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: (to, from, next) => {
        if(store.getters.user) { next('/') } else { next() }
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: (to, from, next) => {
        if(store.getters.user) { next('/') } else { next() }
    }
  },
  {
    path: '/flights',
    name: 'Flights',
    component: Flights
  },
  {
    path: '/staff-dashboard',
    name: 'StaffDashboard',
    component: StaffDashboard,
    beforeEnter: (to, from, next) => {
        if(store.getters.user && store.getters.user.type == 3) { next() } else { next('/') }
    }
  },
  {
    path: '/flight/:id',
    name: 'FlightDisplay',
    component: FlightDisplay
  },
  {
    path: '/agent-dashboard',
    name: 'AgentDashboard',
    component: BADashboard,
    beforeEnter: (to, from, next) => {
        if(store.getters.user && store.getters.user.type == 2) { next() } else { next('/') }
    }
  },
  {
    path: '/customer-profile',
    name: 'CustomerProfile',
    component: CustomerProfile,
    beforeEnter: (to, from, next) => {
        if(store.getters.user && store.getters.user.type == 1) { next() } else { next('/') }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
