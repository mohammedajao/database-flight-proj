<template lang="html">
<div class="container">
  <div class="container basic-sec">
    <h5>Purchased Flights</h5>
    <div class="container flights-bought">
      <div class="row container flight-purchased col-12 col-md-6" v-for="(flight, index) in purchasedFlights" :key="index">
        <p>Flight Number: {{flight.flight_num}}</p><br/>
        <p>Airline: {{ flight.owned_by.replace('%20', ' ') }}</p>
        <p>Departing: {{ new Date(flight.depart_date_time) }}</p>
        <p v-if="flight.arrival_date_time">Arriving {{ new Date(flight.arrival_date_time )}}</p>
        <p>From: {{ flight.departure_airport }}</p>
        <p v-if="flight.arrival_airport">To: {{ flight.arrival_airport }}</p>
        <p>Status: {{ constants.statuses[flight.status] }}</p>
        <p>Type: {{ constants.types[flight.type] }}</p>
      </div>
    </div>
  </div>
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
      endTime: '',
      purchasedFlights: [],
      constants: {
        statuses: ['ON GOING', 'DELAYED', 'CANCELLED'],
        types: ['ONE WAY', 'ROUND TRIP'],
        enumStatus: { 'ON GOING': 1, 'DELAYED': 2, 'CANCELLED': 3},
        enumType: {'ONE WAY': 1, 'ROUND TRIP': 2}
      }
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

    axios.get('/flights/fetch-customer-flights', config).then(res => {
      console.log("Client Flights", res.data)
      const oldFlights = JSON.parse(JSON.stringify(this.purchasedFlights))
      res.data.purchased_flights[0].map(x => oldFlights.push(x))
      this.purchasedFlights = oldFlights
      console.log("HEHE", this.purchasedFlights)
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

.flight-purchased {
  border: solid 1px gray;
  border-radius:  5px;
  padding: 10px;
}

</style>
