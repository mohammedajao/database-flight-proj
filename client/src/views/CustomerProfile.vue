<template lang="html">
<div class="container">
  <div class="container basic-sec">
    <form action="" @submit.prevent="requestSpendingInRange()">

      <div class="col-12 col-sm-6">
        <label for="startTime" class="datepicker col-form-label">From</label>
        <input v-model="startTime" class="form-control" type="datetime-local" id="startTime" required>
      </div>

      <div class="col-12 col-sm-6">
        <label for="endTime" class="datepicker col-form-label">To</label>
        <input v-model="endTime" class="form-control" type="datetime-local" id="endTime">
      </div>

      <div class="row mt-3 col-12">
        <button class="btn btn-primary col-3">Submit</button>
      </div>
    </form>
  </div>
  <div class="container basic-sec">
    <h5>Spending In range {{ startTime }} to {{ endTime }}</h5>
    <p v-if="yearlySpending">${{ yearlySpending }}</p>
    <h5>Past 6 Months Spending</h5>
    <canvas id="spending" width="500" height="500"></canvas>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { mapGetters } from 'vuex'
import * as ChartJs from 'chart.js'

ChartJs.Chart.register.apply(
  null,
  Object.values(ChartJs).filter((chartClass => chartClass.id)),
)

export default {
  data() {
    return {
      yearlySpending: 0,
      startTime: '',
      endTime: ''
    }
  },
  methods: {
    requestSpendingInRange() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      const data = {
        email: this.user.data.user_email,
        startDate: new Date(this.startTime).toISOString(),
        endDate: new Date(this.endTime).toISOString()
      }
      axios.post('/purchases/get-spending', data, config).then(res => {
        this.yearlySpending = res.data.annual_payment[0][0].AMOUNT
      }).catch(err => console.log(err))
    }
  },
  computed: {
    ...mapGetters(['user', 'token'])
  },
  created() {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer '+this.token.token
      }
    }

    let startDate = new Date()
    const data = {
      email: this.user.data.user_email,
      startDate: new Date(startDate.setFullYear(startDate.getFullYear()-1)).toISOString(),
      endDate: new Date().toISOString()
    }
    axios.post('/purchases/get-spending', data, config).then(res => {
      this.yearlySpending = res.data.annual_payment[0][0].AMOUNT
    }).catch(err => console.log(err))

    axios.post('/purchases/get-monthly-spending', { email: this.user.data.user_email }, config).then(res => {
      console.log('Monthly Spending', res.data)
      const ctx = document.getElementById('spending').getContext('2d')
      const months = ["JAN", "FEB", "MARCH", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"]
      new ChartJs.Chart(ctx, {
        type: 'bar',
        labels: Array.from(new Set(res.data.monthly_spending[0].map(x => months[x.MONTHWORK-1]))),
        data: {
          datasets: res.data.monthly_spending[0].map(mts => {
            return {
              data: [{x: months[mts.MONTHWORK-1], y: mts.AMOUNT}],
              label: mts.AMOUNT,
              fill: true,
              borderColor: "#c45850",
              backgroundColor:"#d78f89",
            }
          }),
          labels: Array.from(new Set(res.data.monthly_spending[0].map(x => months[x.MONTHWORK-1])))
        }
      })
    }).catch(err => console.log(err))
  }
}
</script>

<style lang="css" scoped>
.basic-sec {
  border: solid 1px gray;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  margin: 10px;
  padding: 10px;
}

.custom-btn {
  padding: 15px 7px;
  margin: 10px 0px;
  min-width: 150px;
  border-radius: 150px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  background-color: rgb(255, 45, 32);
  border: 0;
}

</style>
