<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
  <a class="navbar-brand" href="#">SuperFlights</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarNav">
    <ul class="navbar-nav">
      <li class="nav-item active" v-if="this.user">
        <router-link class="nav-link" :to="'/'">Home</router-link>
      </li>
      <li class="nav-item" v-if="this.user && this.user.type == 3">
        <router-link class="nav-link" :to="'/staff-dashboard'">Dashboard</router-link>
      </li>
      <li class="nav-item" v-if="this.user && this.user.type == 2">
        <router-link class="nav-link" :to="'/agent-dashboard'">Dashboard</router-link>
      </li>
      <li class="nav-item" v-if="this.user && this.user.type == 1">
        <router-link class="nav-link" :to="'/customer-profile'">Profile</router-link>
      </li>
      <li class="nav-item active">
        <router-link class="nav-link" :to="'/flights'">Flights</router-link>
      </li>
      <li class="nav-item" v-if="!this.user">
        <router-link class="nav-link" :to="'/login'">Log In</router-link>
      </li>
      <li class="nav-item" v-if="!this.user">
        <router-link class="nav-link" :to="'/register'">Register</router-link>
      </li>
      <li class="nav-item active" v-if="this.user" @click.prevent="logout">
        <a class="btn">Logout</a>
      </li>
    </ul>
  </div>
</nav>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {}
  },
  methods: {
    logout () {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }
      axios.post('logout', {}, config).then(() => {
        this.$store.dispatch('logout')
        this.$router.push('/login')
      }).catch(err => console.log(err))
    }
  },
  computed: {
    ...mapGetters(['user', 'token'])
  }
}
</script>

<style lang="css">

</style>
