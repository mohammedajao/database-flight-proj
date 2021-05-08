<template lang="html">
<div class="container">
  <h1>Dashboard</h1>
  <div class="basic-form airport-form" @submit.prevent="submitAirportForm">
    <div class="alert alert-success fade d-none" role="alert" id="airportFormSuccess">
      Successfully created the airport!
    </div>
    <div class="alert alert-danger fade d-none" role="alert" id="airportFormFail">
      Airport names must be unique.
    </div>
    <form>
      <h6>Airport Form</h6>
      <div class="form-group">
        <label for="airportName">Name</label>
        <input v-model="airportForm.name" type="text" class="form-control" placeholder="Airport Name" id="airportName" required>
      </div>
      <div class="form-group">
        <label for="airportCity">Name</label>
        <input v-model="airportForm.city" type="text" class="form-control" placeholder="Airport City" id="airportCity" required>
      </div>
      <button class="custom-btn">Submit</button>
    </form>
  </div>

  <div class="basic-form airplane-form" @submit.prevent="submitAirplaneForm">
    <div class="alert alert-success fade d-none" role="alert" id="airplaneFormSuccess">
      Successfully created the airplane!
    </div>
    <div class="alert alert-danger fade d-none" role="alert" id="airplaneFormFail">
      An unknown error occurred when creating the airplane.
    </div>
    <form>
      <h6>Airplane Form</h6>
      <div class="form-group">
        <label for="airplaneCapacity">Capacity</label>
        <input v-model="airplaneForm.seats" min="1" type="number" class="form-control" placeholder="Airplane Capacity" id="airplaneCapacity" required>
      </div>
      <button class="custom-btn">Submit</button>
    </form>
  </div>

  <div class="basic-form flights-form" @submit.prevent="submitFlightsForm">
    <div class="alert alert-success fade d-none" role="alert" id="flightsFormSuccess">
      Successfully created the flight!
    </div>
    <div class="alert alert-danger fade d-none" role="alert" id="flightsFormFail">
      An unknown error occurred when creating the flight.
    </div>
    <form class="row">
      <h6>Flights Form</h6>
      <div class="form-group">
        <label for="flightNum">Flight Number</label>
        <input v-model="flightsForm.form.flightNum" min="1" type="number" class="form-control" placeholder="Flight Number" id="flightNum" required>
      </div>

      <div class="form-group col-6">
        <label for="departDateTime" class="datepicker col-form-label">Departure Time</label>
        <input v-model="flightsForm.form.departDateTime" class="form-control" type="datetime-local" id="departDateTime" required>
      </div>

      <div class="form-group row col-6">
        <label for="arrivalDateTime" class="datepicker col-form-label">Arrival Time</label>
        <input v-model="flightsForm.form.arrivalDateTime" class="form-control" type="datetime-local" id="arrivalDateTime">
      </div>

      <div class="form-group col-4">
        <label for="basePrice" class="col-form-label">Base Price</label>
        <input type="number" v-model="flightsForm.form.basePrice" min="1" class="form-control" id="basePrice" required>
      </div>

      <div class="form-group col-4">
        <label for="departureAirport" class="form-label">Departure Airport</label>
        <select v-model="flightsForm.form.departureAirport" class="form-select" id="departureAirport" required>
          <option v-for="airport in airports" :key="airport.name">{{ airport.name }}</option>
        </select>
      </div>

      <div class="form-group col-4">
        <label for="arrivalAirport" class="form-label">Arrival Airport</label>
        <select v-model="flightsForm.form.arrivalAirport" class="form-select" id="arrivalAirport">
          <option v-for="airport in airports" :key="airport.name">{{ airport.name }}</option>
        </select>
      </div>

      <div class="form-group">
        <label for="selectedAirplane" class="form-label">Airplane</label>
        <select v-model="flightsForm.form.airplane" class="form-select" id="selectedAirplane" required>
          <option v-for="plane in airplanes" :key="plane.id">{{ plane.id }}</option>
        </select>
      </div>

      <div class="form-group col-6">
        <label for="flightStatuses" class="form-label">Flight Status</label>
        <select v-model="flightsForm.form.status" class="form-select" id="flightStatuses" required>
          <option v-for="(status, index) in flightsForm.static.statuses" :key="index">{{ status }}</option>
        </select>
      </div>

      <div class="form-group col-6">
        <label for="flightTypes" class="form-label">Flight Type</label>
        <select v-model="flightsForm.form.type" class="form-select" id="flightTypes" required>
          <option v-for="(type, index) in flightsForm.static.types" :key="index">{{ type }}</option>
        </select>
      </div>
      <button class="custom-btn">Submit</button>
    </form>
  </div>

  <div class="ticket-display-form row basic-form">
    <form class="container row" @submit.prevent="getTicketsInRange()">
      <h5>Display Tickets in Range:</h5>
      <div class="col-6">
        <label for="startTime">From Date</label>
        <input v-model="ticketsForm.startTime" class="form-control" type="date" id="startTime" required>
      </div>

      <div class="col-6">
        <label for="endTime">To Date</label>
        <input v-model="ticketsForm.endTime" class="form-control" type="date" id="endTime" required>
      </div>

      <button class="custom-btn">Submit</button>
    </form>
  </div>

  <div class="ticket-report basic-sec">
    <div class="container p-5">
      <div class="tickets-in-range">
        <h5>Tickets Sold From {{this.ticketsForm.startTime}} to {{this.ticketsForm.endTime}}</h5>
        <p>{{this.ticketReport.filteredTicketsSold}}</p>
      </div>
      <div class="tickets-report">
        <h5>Main Report</h5>
        <h6>Ticket Bar Chart</h6>
        <canvas id="ticket-canvas" width="500" height="500"></canvas>
        <h6>Revenue Chart</h6>
        <div class="col-6">
          <label for="revenueStartTime">To Date</label>
          <input v-model="revenueStartTime" class="form-control" type="date" id="revenueStartTime" @change="loadPieChart()" required>
        </div>
        <canvas id="ticket-revenue-canvas" width="500" height="500"></canvas>
      </div>
    </div>
  </div>

  <div class="top-clients container">
    <h5>Top Clients</h5>
    <div class="top-client container row mt-3" v-for="(client, index) in this.topCustomers" :key="index" @click="showFlightsTaken(client)" data-toggle="modal" data-target="#customerFlightsDialog">
      <h6>Ranking: {{ index + 1 }}</h6>
      <p><strong>{{ client.purchaser_email }}</strong></p>
    </div>
  </div>

  <div class="top-year-agents basic-sec container">
    <h5>Year's Current Top Agents</h5>
    <div class="container row mt-3" v-for="(agent, index) in this.topYearAgents" :key="index">
      <h6>Ranking: {{ index + 1}}</h6>
      <p><strong>{{ agent.agent_id }} - Sold: {{ agent.ticketsSold }}</strong></p>
      <hr>
    </div>
  </div>

  <div class="top-month-agents basic-sec container">
    <h5>Month's Current Top Agents</h5>
    <div class="container row mt-3" v-for="(agent, index) in this.topMonthAgents" :key="index">
      <h6>Ranking: {{ index + 1}}</h6>
      <p><strong>{{ agent.agent_id }} - Sold: {{ agent.ticketsSold }}</strong></p>
      <hr>
    </div>
  </div>

  <div class="top-locations basic-sec container">
    <h5>Top Locations</h5>
    <div class="top-location container row mt-3" v-for="(city, index) in this.topLocations" :key="index">
      <p>Rank: {{ index }} City: {{ city.city }} Amount: {{ city.freq }}</p>
    </div>
  </div>

  <div class="modal" tabindex="-1" role="dialog" id="customerFlightsDialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Flights Taken</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal('#customerFlightsDialog')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row container flightTaken" v-for="(flight, index) in modalInfo.takenFlights" :key="index" @click="goToFlight(flight.id)">
            <h6>Flight Num: {{ flight.flight_num }}</h6>
            <div class="row col-6 departTime">Departing: {{ flight.depart_date_time}}</div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Save changes</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="closeModal('#customerFlightsDialog')">Close</button>
        </div>
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
  data () {
    return {
      airports: [],
      airplanes: [],
      topCustomers: [],
      topYearAgents: [],
      topMonthAgents: [],
      topLocations: [],
      revenueStartTime: new Date().toISOString(),
      revenueData: [],
      ticketReport: {
        filteredTicketsSold: 0,
        report: []
      },
      airportForm: {
        name: '',
        city: ''
      },
      modalInfo: {
        takenFlights: []
      },
      airplaneForm: {
        seats: 0
      },
      ticketsForm: {
        startTime: '',
        endTime: ''
      },
      flightsForm: {
        static: {
          status: { 'ON GOING': 1, 'DELAYED': 2, 'CANCELLED': 3},
          type: {'ONE WAY': 1, 'ROUND TRIP': 2},
          statuses: ['ON GOING', 'DELAYED', 'CANCELLED'],
          types: ['ONE WAY', 'ROUND TRIP']
        },
        form: {
          flightNum: 0,
          airplane: 0,
          basePrice: 0,
          arrivalAirport: '',
          departureAirport: '',
          departDateTime: '',
          arrivalDateTime: '',
          type: 1,
          status: 1
        }
      },
      barChart: {},
      pieChart: {}
    }
  },
  methods: {
    loadPieChart() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      console.log('Checking revenuew since new date')
      axios.post('/purchases/revenue-data', { startDate: this.revenueStartTime, airline: this.user.data.airline }, config).then(res => {
        let revData = [{data: []}]
        res.data.directRevenue[0].map(x => {
          if(x.revenue) {
            revData[0].data.push(x.revenue)
          } else {
            revData[0].data.push(1)
          }
        })
        res.data.indirectRevenue[0].map(x => {
          if(x.revenue) {
            revData[0].data.push(x.revenue)
          } else {
            revData[0].data.push(1)
          }
        })
        const ctx = document.getElementById('ticket-revenue-canvas').getContext('2d')
        this.pieChart.destroy()
        this.pieChart = new ChartJs.Chart(ctx, {
          type: 'pie',
          data: {
            datasets: [{
              data: revData[0].data,
              backgroundColor: ["#c45850","#d78f89"]
            }],
            labels: [
             'Direct Revenue',
             'Indirect Revenue'
           ]
          }
        })
      }).catch(err => { console.log(err) })
    },
    getTicketsInRange() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      const data = {
        airline: this.user.data.airline,
        startDate: new Date(this.ticketsForm.startTime).toISOString(),
        endDate: new Date(this.ticketsForm.endTime).toISOString()
      }

      axios.post('/purchases/get-tickets-thru', data, config).then(res =>{
        console.log(res.data, res.data.tickets_sold_in_range[0][0].ticketsSold)
        this.ticketReport.filteredTicketsSold = res.data.tickets_sold_in_range[0][0].ticketsSold

        const canvas = document.getElementById('ticket-canvas')
        const ctx = document.getElementById('ticket-canvas').getContext('2d')
        // ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.barChart.destroy()

        console.log("Report:", res.data, res.data.report[0])
        const months = ["JAN", "FEB", "MARCH", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"]
        this.barChart = new ChartJs.Chart(ctx, {
          type: 'bar',
          responsive: true,
          labels: Array.from(new Set(res.data.report[0].map(x => months[x.monthSold-1]))),
          data: {
            datasets: res.data.report[0].map(mts => {
              return {
                data: [{x: months[mts.monthSold-1], y: mts.ticketsSold}],
                label: mts.yearSold,
                fill: true,
                borderColor: "#c45850",
                backgroundColor:"#d78f89",
              }
            }),
            labels: Array.from(new Set(res.data.report[0].map(x => months[x.monthSold-1])))
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    goToFlight(id) {
      $('#customerFlightsDialog').modal('hide')
      $('.modal').modal('hide')
      this.$router.push('/flight/' + id)
    },
    showFlightsTaken(clientInfo) {
      this.modalInfo.takenFlights = []
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      const data = {
        email: clientInfo.purchaser_email,
        airline: this.user.data.airline
      }

      axios.post('/flights/flight-cust-air', data, config).then(res => {
        const oldFlights = JSON.parse(JSON.stringify(this.modalInfo.takenFlights))
        res.data.flights[0].map(x => { oldFlights.push(x) })
        this.modalInfo.takenFlights = oldFlights

        $('#customerFlightsDialog').modal('show')
      }).catch(err => {
        console.log(err)
      })
    },
    closeModal(str) {
      $(str).modal('hide')
    },
    submitFlightsForm() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      const type = this.flightsForm.static.types[this.flightsForm.form.type]
      const status = this.flightsForm.static.statuses[this.flightsForm.form.status]
      const departDate = new Date(this.flightsForm.form.departDateTime).toISOString()

      const data = {
        flight_num: this.flightsForm.form.flightNum,
        airplane: this.flightsForm.form.airplane,
        owned_by: this.user.data.airline,
        base_price: this.flightsForm.form.basePrice,
        depart_date_time: departDate,
        arrival_date_time: this.flightsForm.form.arrivalDateTime,
        departure_airport: this.flightsForm.form.departureAirport,
        arrival_airport: this.flightsForm.form.arrivalAirport,
        type: type,
        status: status
      }

      axios.post('/flights/create', data, config).then((res) => {
        $("#flightsFormSuccess").addClass('show')
        $("#flightsFormSuccess").removeClass('d-none')
        setTimeout(function(){
          $("#flightsFormSuccess").removeClass('show')
          $("#flightsFormSuccess").addClass('d-none')
       }, 1000);
      }).catch((err) => {
        console.log(err)
        $("#flightsFormFail").addClass('show')
        $("#flightsFormFail").removeClass('d-none')
        setTimeout(function(){
          $("#flightsFormFail").removeClass('show')
          $("#flightsFormFail").addClass('d-none')
        }, 1000);
      })
    },

    submitAirplaneForm() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }
      axios.get('/staff/getAirline', config).then((res) => {
        const airline = res.data.airline.name
        axios.post('/airplanes/create', {
          airline_name: airline,
          seats: this.airplaneForm.seats
        }, config).then((res) => {
          $("#airplaneFormSuccess").addClass('show')
          $("#airplaneFormSuccess").removeClass('d-none')
          setTimeout(function(){
            $("#airplaneFormSuccess").removeClass('show')
            $("#airplaneFormSuccess").addClass('d-none')
         }, 1000);
        }).catch(err => {
          $("#airplaneFormFail").addClass('show')
          $("#airplaneFormFail").removeClass('d-none')
          setTimeout(function(){
            $("#airplaneFormFail").removeClass('show')
            $("#airplaneFormFail").addClass('d-none')
          }, 1000);
        })
      }).catch(err => {
        console.log(err)
      })
    },
    submitAirportForm() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }
      axios.post('/airports/create', this.airportForm, config).then((res) => {
        $("#airportFormSuccess").addClass('show')
        $("#airportFormSuccess").removeClass('d-none')
        setTimeout(function(){
          $("#airportFormSuccess").removeClass('show')
          $("#airportFormSuccess").addClass('d-none')
       }, 1000);
      }).catch(err => {
        $("#airportFormFail").addClass('show')
        $("#airportFormFail").removeClass('d-none')
        setTimeout(function(){
          $("#airportFormFail").removeClass('show')
          $("#airportFormFail").addClass('d-none')
        }, 1000);
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

    $('#departDateTime').datetimepicker({
     format: "yyyy-MM-DD\'T\'HH:mm:ss",
     tooltips: {
       pickSecond: 'Pick Second'
      }
   });

   axios.get('/airports/get-top-airports/' + this.user.data.airline, config).then(res => {
      const oldTopLocations = JSON.parse(JSON.stringify(this.topLocations))
      res.data.airports[0].map(x => oldTopLocations.push(x))
      this.topLocations = oldTopLocations
   }).catch(err => {
     console.log(err)
   })

   axios.get('/agents/top-agents/' + this.user.data.airline, config).then(res => {
     const oldYearTopAgents = JSON.parse(JSON.stringify(this.topYearAgents))
     res.data.year[0].map(x => oldYearTopAgents.push(x))
     this.topYearAgents = oldYearTopAgents

     const oldMonthTopAgents = JSON.parse(JSON.stringify(this.topMonthAgents))
     res.data.month[0].map(x => oldMonthTopAgents.push(x))
     this.topMonthAgents = oldMonthTopAgents
   }).catch(err => {
     console.log(err)
   })
    axios.get('airports').then((res) => {
      res.data.airports.map(x => this.airports.push(x))
    })
    axios.get('/staff/getAirplanes', config).then((res) => {
      res.data.airplanes.map(x => this.airplanes.push(x))
    })
    axios.get('/staff/getTopCustomers/' + this.user.data.airline, config).then((res) => {
      const oldTopClients = JSON.parse(JSON.stringify(this.topCustomers))
      res.data.topPurchasers[0].map(x => {
        oldTopClients.push(x)
      })
      this.topCustomers = oldTopClients
    }).catch(err => {
      console.log(err)
    })

    axios.get('/purchases/ticket-report/' + this.user.data.airline, config).then(res => {
      const ctx = document.getElementById('ticket-canvas').getContext('2d')
      console.log("Report:", res.data)
      const months = ["JAN", "FEB", "MARCH", "APR", "MAY", "JUN", "JUL", "AUG", "SEPT", "OCT", "NOV", "DEC"]
      this.barChart = new ChartJs.Chart(ctx, {
        type: 'bar',
        responsive: true,
        labels: Array.from(new Set(res.data.report[0].map(x => months[x.monthSold-1]))),
        data: {
          datasets: res.data.report[0].map(mts => {
            return {
              data: [{x: months[mts.monthSold-1], y: mts.TOTALCOUNT}],
              label: mts.yearSold,
              fill: true,
              borderColor: "#c45850",
              backgroundColor:"#d78f89",
            }
          }),
          labels: Array.from(new Set(res.data.report[0].map(x => months[x.monthSold-1])))
        }
      })
    }).catch(err => {
      console.log("report err", err)
    })

    axios.post('/purchases/revenue-data', { startDate: this.revenueStartTime, airline: this.user.data.airline }, config).then(res => {
      let revData = [{data: []}]
      res.data.directRevenue[0].map(x => {
        if(x.revenue) {
          revData[0].data.push(x.revenue)
        } else {
          revData[0].data.push(1)
        }
      })
      res.data.indirectRevenue[0].map(x => {
        if(x.revenue) {
          revData[0].data.push(x.revenue)
        } else {
          revData[0].data.push(1)
        }
      })
      const ctx = document.getElementById('ticket-revenue-canvas').getContext('2d')
      this.pieChart = new ChartJs.Chart(ctx, {
        type: 'pie',
        data: {
          datasets: [{
            data: revData[0].data,
            backgroundColor: ["#c45850","#d78f89"]
          }],
          labels: [
           'Direct Revenue',
           'Indirect Revenue'
         ]
        }
      })
    }).catch(err => { console.log(err) })
  }
}
</script>

<style lang="css" scoped>

.basic-form {
  text-align: left;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  padding: 10px;
  border-radius: 5px;
  margin: 20px;
}

.basic-form > form {
  padding: 30px;
}

.basic-form > form > .form-group {
  margin: 10px 0px;
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

.top-client {
  border: solid 1px gray;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  cursor: pointer;
  padding: 10px;
}

.modal-body {
  max-height: 300px;
  overflow: auto;
}

.flightTaken {
  padding: 10px;
  border: solid 1px gray;
  margin: 10px;
  margin-left: 0;
  cursor: pointer;
}

.basic-sec {
  border: solid 1px gray;
  border-radius: 5px;
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  margin: 10px;
  padding: 10px;
}
</style>
