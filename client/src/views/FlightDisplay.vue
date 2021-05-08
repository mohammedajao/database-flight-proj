<template lang="html">
<div class="container">
  <div class="flight-content container">
    <h5>Flight: {{ flightDisplayData.flightNum }} - ${{ flightDisplayData.price }}</h5>
    <h6>Slots: {{ bookings }} / {{ capacity }}</h6>
    <h6>Average Rating: {{ avgRating }}</h6>
    <div class="container flight-display">
      <div class="row">
        <span class="col-6">From {{ flightDisplayData.sourceAirport }}</span><span class="col-6" v-if="flightDisplayData.arrivalAirport"> to {{ flightDisplayData.arrivalAirport}}</span>
      </div>
      <div class="row">
        <span class="col-6">{{ flightDisplayData.departureDateTime }}</span>
        <span class="col-6" v-if="flightDisplayData.arrivalDateTime">{{new Date(flightDisplayData.arrivalDateTime) }}</span>
      </div>
      <div class="row">
        <span class="col-6">Status: {{ constants.statuses[flightDisplayData.status-1]}}</span>
        <span class="col-6">Type: {{ constants.types[flightDisplayData.type-1]}}</span>
      </div>
    </div>
  </div>

  <div class="flight-update-form container basic-form" v-if="this.user && this.user.type == 3">
    <h5>Flight Update Form</h5>
    <h6>{{ alertsMessage }}</h6>
    <form action="" class="row" @submit.prevent="updateFlight">
      <div class="form-group col-6">
        <label for="flightStatuses" class="form-label">Flight Status</label>
        <select v-model="flightUpdateForm.newStatus" class="form-select" id="flightStatuses" required>
          <option v-for="(status, index) in constants.statuses" :key="index">{{ status }}</option>
        </select>
      </div>

      <div class="row mt-3 col-12">
        <button class="btn btn-primary col-3">Submit</button>
      </div>
    </form>
  </div>

  <div class="container customer-list" v-if="this.user && this.user.type == 3">
    <h5>Customers Who Bought Tickets</h5>
    <div class="customer-display" v-for="(cust, index) in this.customers" :key="index">
      <p><strong>{{ cust.user_email }}</strong></p>
    </div>
  </div>

  <div class="payment-form container" v-if="this.user && this.user.type != 3">
    <div class="message-displays container">
      <div class="alert-cont" id="#alertStatus">
        <h5>{{ alertsMessage }}</h5>
      </div>
      <div class="ticket-warning-window" v-if="this.bookings > 0.7*this.capacity">
        <h5>{{ ticketWarning }}</h5>
      </div>
      <div class="alert alert-success fade d-none" role="alert" id="alertSuccess">
        {{ alertsMessage }}
      </div>
      <div class="alert alert-danger fade d-none" role="alert" id="alertFail">
        {{ alertsMessage }}
      </div>
    </div>

    <form action="" @submit.prevent="purchaseFlight" class="row">
      <div class="col-6">
        <label for="ccNum" class="col-form-label">Credit Card Number</label>
        <input v-model="purchaseForm.ccNum" minlength="10" maxlength="10" class="form-control" type="text" id="ccNum" required>
      </div>

      <div class="col-6">
        <label for="ccExpDate" class="col-form-label">CC Expiration Date</label>
        <input v-model="purchaseForm.ccExpDate" class="form-control" type="date" id="ccExpDate" required>
      </div>

      <div class="col-3" v-if="this.user.type == 1">
        <label for="secCode" class="col-form-label">Security Code</label>
        <input class="form-control" type="number" id="secCode" required>
      </div>

      <div class="col-3"  v-if="this.user.type != 2">
        <label for="agentSelect">Agent Id</label>
        <select v-model="purchaseForm.agentId" class="form-select" id="agentSelect">
          <option v-for="(agent, index) in agents" :key="agent.agent_id">{{ agent.agent_id }}</option>
        </select>
      </div>

      <div class="col-3"  v-if="this.user.type == 2">
        <label for="clientSelect">Clients</label>
        <select v-model="purchaseForm.purchaseFor" @change="fillCC($event, $event.target.selectedIndex)" class="form-select" id="clientSelect" required>
          <option v-for="(client, index) in clients" :key="client.id" >{{ client.id }}</option>
        </select>
      </div>
      <div class="row mt-3 col-12">
        <button class="btn btn-primary col-3">Submit</button>
      </div>
    </form>
  </div>

  <div class="ratings-form container basic-form" v-if="this.user && this.user.type == 1 && this.bought">
    <h5>Flight Rating Form</h5>
    <h6>{{ alertsMessage }}</h6>
    <form action="" class="row" @submit.prevent="submitRating">
      <div class="form-group col-6">
        <label for="flightRating" class="form-label">Flight Rating</label>
        <input v-model="flightRatingForm.rating" class="form-control" type="number" max="10" min="0" id="flightRating" required>
      </div>

      <div class="form-group col-6">
        <label for="flightComment" class="form-label">Flight Comment</label>
        <input v-model="flightRatingForm.comment" type="text" class="form-control" id="flightComment" required>
      </div>

      <div class="row mt-3 col-12">
        <button class="btn btn-primary col-3">Submit</button>
      </div>
    </form>
  </div>

  <div class="flight-ratings container row">
    <h3>Flight Ratings</h3>
    <hr>
    <div v-for="(rating, index) in ratings" :key="index" :data-index="index" class="comment col-12 col-md-6">
      <h5>{{ rating.rating  }} / 10</h5>
      <h6>{{ rating.customer_email }}</h6>
      <p><em>{{ rating.comment }}</em></p>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      alertsMessage: '',
      ticketWarning: '',
      ratings: [],
      customers: [],
      constants: {
        statuses: ['ON GOING', 'DELAYED', 'CANCELLED'],
        types: ['ONE WAY', 'ROUND TRIP'],
        enumStatus: { 'ON GOING': 1, 'DELAYED': 2, 'CANCELLED': 3},
        enumType: {'ONE WAY': 1, 'ROUND TRIP': 2}
      },
      bookings: 0,
      capacity: 0,
      flightData: {},
      agents: [],
      clients: [],
      bought: false,
      avgRating: 0,
      flightDisplayData: {
        id: 0,
        flightNum: 0,
        price: 0,
        status: 0,
        type: 0,
        sourceCity: '',
        destinationCity: '',
        destinationAirport: '',
        sourceAirport: '',
        departureDateTime: '',
        arrivalDateTime: '',
      },
      purchaseForm: {
        ccNum: '',
        ccExpDate: '',
        securityCode: '',
        type: 1,
        purchaseFor: 0,
        agentId: 0
      },
      flightUpdateForm: {
        newStatus: 0
      },
      flightRatingForm: {
        rating: 0,
        comment: ''
      }
    }
  },
  methods: {
    submitRating() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      console.log(this.user)

      const data = {
        flight_id: this.flightDisplayData.id,
        rating: this.flightRatingForm.rating,
        comment: this.flightRatingForm.comment,
        email: this.user.email || this.user.data.user_email
      }

      axios.post('/ratings/create', data, config).then((res) => {
        this.displayAlert('Rating successful!')
        console.log(res.data)
      }).catch((err) => {
        this.displayAlert('Failed to create the rating.')
      })
    },
    updateFlight() {
      const data = {
        flight_id: this.flightDisplayData.id,
        status: this.constants.enumStatus[this.flightUpdateForm.newStatus]
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      axios.post('/flights/update', data, config).then((res) => {
        console.log(res)
        this.alertsMessage = 'Successful update'
        this.flightDisplayData.status = res.data.flight.status

        setTimeout(() => {
          this.alertsMessage = ''
        }, 1000);
      }).catch(err => {
        console.log(err)
        this.alertsMessage = 'An error occurred when updating the flight!'
        setTimeout(() => {
          this.alertsMessage = ''
        }, 1000);
      })
    },
    fillCC(event, index) {
      const ccInfo = this.clients[index]
      console.log(ccInfo, index, this.clients)
      this.purchaseForm.ccNum = ccInfo.credit_card_num
      this.purchaseForm.ccExpDate = new Date(ccInfo.credit_card_exp_date).toISOString().substr(0, 10)

      console.log(this.purchaseForm.ccExpDate)
      this.purchaseForm.purchaseFor = ccInfo.id
    },
    displayAlert(msg, bool) {
      this.alertsMessage = msg
      console.log(this.alertsMessage)
       if (bool) {
         $("#alertFail").removeClass('d-none')
         $("#alertFail").addClass('show')
         setTimeout(() => {
           $("#alertFail").removeClass('show')
           $("#alertFail").addClass('d-none')
           this.alertsMessage = ''
         }, 3000);
      } else {
        console.log("Showing success")
        $("#alertSucess").addClass('show')
        $("#alertSucess").removeClass('d-none')
        setTimeout(() => {
          $("#alertSucess").removeClass('show')
          $("#alertSucess").addClass('d-none')
          this.alertsMessage = ''
        }, 1000);
      }
    },
    purchaseFlight() {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer '+this.token.token
        }
      }

      if(this.bookings >= this.capacity) {
        this.displayAlert("Cannot book anymore!", true)
        return
      }

      const data = {
        creditCardNum: this.purchaseForm.ccNum,
        creditCardExpDate: this.purchaseForm.ccExpDate,
        type: (this.purchaseForm.agentId) ? 2 : 1,
        purchaseFor: this.purchaseForm.purchaseFor,
        flight_id: this.flightDisplayData.id,
        agent_id: this.purchaseForm.agentId
      }

      console.log(data.creditCardExpDate, data.flight_id, this.purchaseForm.agentId, data.type)
      this.displayAlert("Successful purchase!")
      axios.post('/purchases/create', data, config).then((res) => {
        console.log(res)
        if(res.data.error) {
          this.displayAlert(res.data.error)
        } else {
          this.displayAlert("Successful purchase!")
          this.bookings = this.bookings + 1
        }
      }).catch((err) => {
        console.log(err)
        this.displayAlert("Error occurred!", true)
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
        "Authorization": 'Bearer ' + ((this.token != undefined && this.token != null) ? this.token.token : '')
      }
    }

    axios.get('/flights/' + this.$route.params.id, config).then((res) => {
      console.log(res.data)
      this.flightData = JSON.parse(JSON.stringify(res.data))
      this.bookings = res.data.bookings["count(*)"]
      this.capacity = res.data.maxOccupancy
      console.log(this.capacity, res.data.maxOccupancy)
      this.flightDisplayData.id = res.data.data.id
      this.flightDisplayData.flightNum = res.data.data.flight_num
      this.flightDisplayData.price = res.data.data.base_price
      this.flightDisplayData.departureDateTime = moment(res.data.departure_date_time).format("MMMM Do YYYY, h:mm a")
      this.flightDisplayData.status = res.data.data.status
      this.flightDisplayData.type = res.data.data.type
      this.avgRating = res.data.avg_rating
      if(res.data.arrival_date_time) {
        this.flightDisplayData.ArrivalDateTime =  moment(res.data.arrival_date_time).format("MMMM Do YYYY, h:mm a")
      }
      this.flightDisplayData.sourceAirport = res.data.data.departure_airport
      this.bought = res.data.bought

      const flightIndexData = {
        flight_id: res.data.data.id
      }

      axios.post('/ratings/flight', flightIndexData, config).then((res) => {
        console.log(res.data)
        this.ratings = []
        res.data.ratings.map(x => {
          const oldRatings = JSON.parse(JSON.stringify(this.ratings))
          oldRatings.push(x)
          this.ratings = oldRatings
        })
      })

      if(this.user && this.user.type == 3) {
        axios.post('/flights/getCustomers', { airline: this.user.data.airline, flight_id: res.data.data.id }, config).then(res => {
          console.log("Customers of Flight", res.data)
          const oldCustomers = JSON.parse(JSON.stringify(this.customers))
          res.data.customers.map(x => oldCustomers.push(x))
          this.customers = oldCustomers
        }).catch(err => {
          console.log(err)
        })
      }
    })

    if(this.bookings >= 0.7*this.capacity) {
      console.log(this.bookings, this.capacity)
      this.ticketWarning = 'You will be charged 20% more due to flight capacity being almost reached.'
    } else {
      this.ticketWarning = ''
    }

    axios.get('/agents').then((res) => {
      this.agents = res.data.agents
    })
    if(this.user) {
      console.log("FLight Data", JSON.stringify(this.flightData), this.flightData["data"])
      const data = {
        flight_id: this.flightDisplayData.id,
        agent_id: this.user.data.agent_id
      }
      if(this.user.type == 2) {
        let _this = this
        axios.post('/purchases/getClients', data, config).then((res) => {
          console.log(res)
          res.data.purchases.map(client => {
            const oldClients = JSON.parse(JSON.stringify(_this.clients))
            oldClients.push(client)
            _this.clients = oldClients
          })
        }).catch(err => {
          console.log(err)
          return err
        })
      }

      console.log("Rate Array", this.ratings)
    }
  }
}
</script>

<style lang="css" scoped>
.flight-content {
  padding: 10px;
  border: solid 1px gray;
  margin: 10px;
}

.payment-form {
  text-align: left;
  padding: 20px;
  margin: 10px;
  border: solid 1px gray;
}

.message-displays {
  min-height: 50px;
}

.flight-ratings > .comment {
  border: 1px solid gray;
  padding: 10px;
}
</style>
