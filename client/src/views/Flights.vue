<template lang="html">
<div class="flights-section">
  <form @submit.prevent="searchForFlights">
    <div class="filters container">
      <div class="row">
        <div class="col-12 col-sm-6">
          <label for="sourceCity">Source City</label>
          <select v-model="sourceCity" class="form-select" id="sourceCity">
            <option v-for="(city, index) in Object.keys(cities)">{{ city }}</option>
          </select>
        </div>

        <div class="col-12 col-sm-6">
          <label for="destinationCity">Destination City</label>
          <select v-model="destinationCity" class="form-select" id="destinationCity">
            <option v-for="(city, index) in Object.keys(cities)" :key="index">{{ city}}</option>
          </select>
        </div>

        <div class="col-12 col-sm-6">
          <label for="sourceAirport">Source Airport</label>
          <select v-model="sourceAirport" class="form-select" id="sourceAirport">
            <option v-for="airport in airports" :key="airport.name">{{ airport.name }}</option>
          </select>
        </div>

        <div class="col-12 col-sm-6">
          <label for="destinationAirport">Destination Airport</label>
          <select v-model="destinationAirport" class="form-select" id="destinationAirport">
            <option v-for="airport in airports" :key="airport.name">{{ airport.name }}</option>
          </select>
        </div>

        <div class="col-12 col-sm-6">
          <label for="departDateTime" class="datepicker col-form-label">Departure Time</label>
          <input v-model="departureDateTime" class="form-control" type="datetime-local" id="departDateTime">
        </div>

        <div class="col-12 col-sm-6">
          <label for="arrivalDateTime" class="datepicker col-form-label">Arrival Time</label>
          <input v-model="arrivalDateTime" class="form-control" type="datetime-local" id="arrivalDateTime">
        </div>

      </div>

      <button class="btn custom-btn">Submit</button>
    </div>
  </form>
  <div class="flight-view row">
    <div class="flight col-12 col-md-6" v-for="flight in this.flights" :key="flight.id" @click="goToFlight(flight.id)">
      <div class="date-display">
        <span class="date-1">{{ convertIsoDate(flight.depart_date_time) }}</span> - <span class="date-2" v-if="flight.arrival_date_time">{{ convertIsoDate(flight.arrival_date_time) }}</span>
      </div>
      <h3>Flight Number: {{ flight.flight_num }}</h3>
      <h5>Owned By: {{ flight.owned_by.replace('%20', ' ') }}</h5>
      <h6>Departing Airport: {{ flight.departure_airport }}</h6>
      <h6 v-if="flight.arrival_airport">Arrival Airport: {{ flight.arrival_airport }}</h6>
      <div class="statuses">
        <p>Status: {{ constants.statuses[flight.status-1]}}</p>
        <p>Type: {{ constants.types[flight.type-1] }}</p>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  data () {
    return {
      constants: {
        statuses: ['ON GOING', 'DELAYED', 'CANCELLED'],
        types: ['ONE WAY', 'ROUND TRIP']
      },
      sourceCity: '',
      destinationCity: '',
      destinationAirport: '',
      sourceAirport: '',
      departureDateTime: '',
      arrivalDateTime: '',
      airports: [],
      cities: {},
      flights: []
    }
  },
  methods: {
    convertIsoDate(str) {
      return moment(str, 'YYYY-MM-DD HH:mm')
    },
    goToFlight(id) {
      this.$router.push('/flight/'+id)
    },
    searchForFlights () {
      let url = '/flights/search/'
      if(this.departureDateTime) {
        const departTime = new Date(this.departureDateTime).toISOString().replace("T"," ")
        this.departureDateTime = departTime.substring(0, departTime.length - 5)
      }


      axios.post('/flights/search',{
        depart_date_time: this.departureDateTime,
        arrival_date_time: this.arrivalDateTime,
        departure_airport: this.sourceAirport,
        arrival_airport: this.destinationAirport,
        departure_city: this.sourceCity,
        arrival_city: this.destinationCity
      }).then((res) => {
        res.data.flights.map(x => {
          this.flights.push(x)
        })
      })
    }
  },
  mounted() {
    axios.get('airports').then((res) => {
      res.data.airports.map(x => {
          this.airports.push(x)
          this.cities[x.city] = ''
          console.log(this.cities)
      })
    })
    axios.get('flights').then((res) => {
      console.log(res)
      res.data.flights.map(x => {
        this.flights.push(x)
      })
    }).catch(err => console.log(err))
  }
}
</script>

<style lang="css" scoped>
.filters {
  text-align: left;
  max-width: 700px;
}

.flight {
  padding: 10px;
  border: 1px solid gray;
  margin: 30px;
  cursor: pointer;
}
</style>
