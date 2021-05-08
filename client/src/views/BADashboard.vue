<template lang="html">
<div class="container">
  <div class="basic-sec">
    <form @submit.prevent="getTotalCommissions()">
      <h6>Commission Report Form</h6>
      <div class="form-group">
        <label for="commissionStartDate">Search From</label>
        <input v-model="commissionStartDate" type="date" class="form-control" id="commissionStartDate" required>
      </div>
      <button class="custom-btn">Submit</button>
    </form>
  </div>

  <div class="basic-sec container">
    <div class="container">
      <h5>Display</h5>
      <p>Total Commission: {{ totalCommission }}</p>
      <p>Total Tickets Sold: {{ totalTicketsSold }}</p>
    </div>
  </div>

  <div class="basic-sec container">
    <h5>Top Customers By Tickets Bought</h5>
    <canvas id="monthly-tickets-sold" width="500" height="500"></canvas>
    <hr/>
    <h5>Top Customers By Commission</h5>
    <canvas id="top-commission" width="500" height="500"></canvas>
  </div>

  <div class="basic-sec container">
    <div class="customers-list container row">
      <h5>Booked Flights</h5>
      <div class="col-12 col-md-6 container customer-flight basic-sec" v-for="(flight, index) in customerFlights" :key="index" @click="goToFlight(flight.id)">
        <p>{{ flight.flight_num }} - {{ flight.owned_by.replace('%20', ' ') }}</p>
        <p>Customer: {{ flight.purchaser_email }}</p>
      </div>
    </div>
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
      commissionStartDate: '',
      totalCommission: 0,
      totalTicketsSold: 0,
      customerFlights: []
    }
  },
  methods: {
    goToFlight(id) {
      this.$router.push('/flight/' + id)
    },
    getTotalCommissions() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      axios.post('/purchases/agent-commission', { agent_id: this.user.data.agent_id, startDate: this.commissionStartDate }, config).then(res => {
        console.log(res)
          this.totalCommission = res.data.total_commission[0].TOTALCOMMISSION
          this.totalTicketsSold = res.data.total_tickets_sold[0].TICKETSSOLD
      }).catch(err => {
        console.log(err)
      })
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

    axios.get('/agent/acf', config).then((res) => {
      console.log(res.data)
      const oldFlights = JSON.parse(JSON.stringify(this.customerFlights))
      res.data.flights[0].map(x => {
        oldFlights.push(x)
      })
      this.customerFlights = oldFlights
    }).catch(err => console.log(err))

    axios.get('/purchases/top-customers/' + this.user.data.agent_id, config).then(res => {
      const monthlyCtx = document.getElementById('monthly-tickets-sold').getContext('2d')
      const yearCtx = document.getElementById('top-commission').getContext('2d')
      const ticketsData = res.data.monthly_report[0]
      const commissionData = res.data.yearly_report[0]
      const months = ["JAN", "FEB", "MARCH", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"]
      new ChartJs.Chart(monthlyCtx, {
        type: 'bar',
        responsive: true,
        labels:  Array.from(new Set(ticketsData.map(x => months[x.MONTHBOUGHT-1]))),
        data: {
          datasets: ticketsData.map(mts => {
            return {
              data: [{x: months[mts.MONTHBOUGHT-1], y: mts.AMOUNT}],
              label: mts.purchaser_email,
              fill: true,
              borderColor: "#c45850",
              backgroundColor:"#d78f89",
            }
          }),
          labels: Array.from(new Set(ticketsData.map(x => months[x.MONTHBOUGHT-1]))),
        }
      })

      new ChartJs.Chart(yearCtx, {
        type: 'bar',
        responsive: true,
        labels: Array.from(new Set(commissionData.map(x => months[x.MONTHBOUGHT-1]))),
        data: {
          datasets: commissionData.map(mts => {
            return {
              data: [{x: months[mts.MONTHBOUGHT-1], y: mts.AMOUNT}],
              label: mts.purchaser_email,
              fill: true,
              borderColor: "#c45850",
              backgroundColor:"#d78f89",
            }
          }),
          labels: Array.from(new Set(commissionData.map(x => months[x.MONTHBOUGHT-1])))
        }
      })
    }).catch(err => console.log(err))

    const today = new Date()
    const priorDate = new Date().setDate(today.getDate()-30)
    axios.post('/purchases/agent-commission', { agent_id: this.user.data.agent_id, startDate: new Date(priorDate).toISOString()}, config).then(res => {
      console.log(res)
      this.totalCommission = res.data.total_commission[0][0].TOTALCOMMISSION || 0
      this.totalTicketsSold = res.data.total_tickets_sold[0][0].TICKETSSOLD || 0
    }).catch(err => {
      console.log(err)
    })
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

.customer-flight {
  cursor: pointer;
}
</style>
