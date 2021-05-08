<template>
<div class="register-sec container">
  <div class="registration-form" @submit.prevent="submit">
    <div class="container">
      <h6 class="error-display">{{ error }}</h6>
    </div>
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input v-model="email" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
        <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      </div>
      <div class="form-group" v-if="currentForm === 'staff'">
        <label for="username">Username</label>
        <input v-model="username" type="text" class="form-control" id="username" placeholder="Username">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="password" type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
      </div>
      <div class="form-group" v-if="currentForm === 'agent'">
        <label for="agentIDfield">Agent ID</label>
        <input v-model="agentId" type="text" class="form-control" id="agentIDfield" placeholder="Agent ID">
      </div>
      <div class="form-group" v-if="currentForm === 'staff'">
        <label for="airline">Airline</label>
        <input v-model="airline" type="text" class="form-control" id="airline" placeholder="Airline">
      </div>
      <button class="btn btn-primary">Register</button>
    </form>
    <div class="form-change">
      <div class="container">
        <a href="#" @click="changeFormType('agent')" v-if="currentForm !== 'agent'">Register as a booking agent<br /></a>
        <a href="#" @click="changeFormType('staff')" v-if="currentForm !== 'staff'">Register as a staff member<br /></a>
        <a href="#" @click="changeFormType('customer')" v-if="currentForm !== 'customer'">Register as a customer</a>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      currentForm: 'customer',
      email: '',
      password: '',
      username: '',
      agentId: '',
      airline: '',
      type: 1,
      error: ''
    }
  },
  methods: {
    submit () {
      const response = axios.post('register', {
        email: this.email,
        password: this.password,
        username: this.username,
        agent_id: this.agentId,
        airline: this.airline,
        type: this.type
      }).then((res) => {
        console.log(res)
        this.$router.push('/login')
      }).catch(err => {
        this.error = 'There was an issue with validation. Ensure a unique email, username, or agent id is not taken! Ensure an airline exists!'
        console.log(err)
      })
    },
    changeFormType (type) {
      this.currentForm = type
      switch(type) {
        case 'customer':
          this.type = 1
          break
        case 'agent':
          this.type = 2
          break
        case 'staff':
          this.type = 3
          break
      }
    }
  }
}
</script>

<style lang="css" scoped>
.registration-form {
  text-align: left;
  border: solid gray 1px;
  padding: 1em;
}

.form-change {
  text-align: right
}

.error-display {
  color: red;
}
</style>
