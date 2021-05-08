<template lang="html">
<div class="login-form" @submit.prevent="login">
  <h3>{{ error }}</h3>
  <form action="">
    <h3>Login</h3>
    <div class="form-group">
      <label for="email">Email</label>
      <input v-model="email" type="email" class="form-control" placeholder="Email" id="email">
    </div>
    <div class="form-group">
      <label for="password">Email</label>
      <input v-model="password" type="password" class="form-control" placeholder="Password" id="password">
    </div>
    <button class="btn btn-primary">Log In</button>
  </form>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login () {
      const response = axios.post(process.env.VUE_APP_API_CONFIG + 'login', {
        email: this.email,
        password: this.password
      }).then((res) => {
        this.$store.dispatch('login', {
          user: res.data.user,
          token: res.data.token
        })
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
        this.error = 'Invalid login credentials'
      })
    }
  }
}
</script>

<style lang="css" scoped>
</style>
