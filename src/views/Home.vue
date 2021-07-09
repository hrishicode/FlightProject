<template>
  <div class="home-view-container">
   <div class="home-view-container__row travel-direction">
      <label class="home-view-container__row-direction">
        <input type="radio" name="travelmode" :value="1" checked @change="change($event)" />
        <span>One-way</span>
      </label>
      <label class="home-view-container__row-direction">
        <input type="radio" name="travelmode" :value="2"
          @change="change($event)"
        />
        <span>Return flight</span>
      </label>

    </div>

    <div class="home-view-container__row">
      <p class="home-view-container__row-left">Departure<span class="required-message">*</span>: </p>
      <p class="home-view-container__row-right"><input type="date" name="searchOptions.departureDate" v-model="searchOptions.departureDate"/></p>
    </div>

    <div class="home-view-container__row" v-if="searchOptions.isReturnFlightNeeded">
      <p class="home-view-container__row-left">Return<span class="required-message">*</span>:</p>
      <p class="home-view-container__row-right"><input type="date" name="searchOptions.returnDate" v-model="searchOptions.returnDate"/></p>
    </div>

    <div class="home-view-container__row">
      <p class="home-view-container__row-left">Source<span class="required-message">*</span>:</p>
      <p class="home-view-container__row-right">
      <select name="source" @change="onSourceChange($event)">
          <option>--- Select Source ---</option>
          <option v-for="item in airportNames" :value="item" :key="item">{{item}}</option>
      </select>
      </p>
    </div>

    <div class="home-view-container__row">
      <p class="home-view-container__row-left">Destination<span class="required-message">*</span>:</p>
      <p class="home-view-container__row-right">
        <select name="destination" @change="onDestChange($event)">
            <option>--- Select destination ---</option>
            <option v-for="item in airportNames" :value="item" :key="item">{{item}}</option>
        </select>
      </p>
    </div>

    <div class="home-view-container__row">
      <p class="home-view-container__row-left"><span class="passenger-count-text">Number of Passengers</span><span class="required-message">*</span>: <span class="passenger-total__count">{{searchOptions.passengersCount.total}}</span></p>

    </div>
    <div class="home-view-container__passenger">
      <div class="home-view-container__passenger-adults">
      <div>Adults</div>
      <div>
      <button @click="decrement('adult')">-</button>
      <input :value="searchOptions.passengersCount.adults" disabled/>
      <button @click="increment('adult')">+</button>
      </div>
    </div>

    <div class="home-view-container__passenger-children">
      <div>Children</div>
      <div>
      <button @click="decrement('children')">-</button>
      <input :value="searchOptions.passengersCount.children" disabled />
      <button @click="increment('children')">+</button>
      </div>
    </div>

    <div class="home-view-container__passenger-infant">
      <div>Infant</div>
        <div>
          <button @click="decrement('infant')">-</button>
          <input :value="searchOptions.passengersCount.infant" disabled />
          <button @click="increment('infant')">+</button>
        </div>
      </div>
    </div>
    <div class="home-view-container__error-message" v-if="isError">Please select all required fields..</div>
    <button class="search-btn" @click="showResult">Search</button>
  </div>
</template>

<script>
// @ is an alias to /src
import router from '../router'
import FlightApi from '../common/services/FlightApi'

export default {
  name: 'Home',
  data () {
    return {
      airportNames: [],
      isError: false,
      formValidated: false,
      searchOptions: {
        isReturnFlightNeeded: false,
        selectedSource: null,
        selectedDestination: null,
        departureDate: null,
        returnDate: null,
        passengersCount: {
          total: 0,
          adults: 0,
          infant: 0,
          children: 0
        }
      }
    }
  },
  components: {
  },
  methods: {
    // event to handle switch toggle for one way and return flight
    change (event) {
      const optionValue = event.target.value
      this.searchOptions.isReturnFlightNeeded = optionValue === '2'
    },
    onSourceChange (event) {
      this.searchOptions.selectedSource = event.target.value
    },
    onDestChange (event) {
      this.searchOptions.selectedDestination = event.target.value
    },
    // Populating airport names and code
    populateAirportNames (airports) {
      airports.forEach((airportItem) => {
        this.airportNames.push(airportItem.name + ' (' + airportItem.code + ')')
        airportItem.connections.forEach((connectionItem) => {
          this.airportNames.push(connectionItem.name + ' (' + connectionItem.code + ')')
        })
      })
      this.airportNames = [...new Set(this.airportNames)]
    },
    // applying initial validation for required fields
    checkValidation () {
      if (this.searchOptions.selectedSource != null && !!this.searchOptions.selectedDestination &&
      this.searchOptions.departureDate != null && this.searchOptions.passengersCount.total > 0) {
        if (this.searchOptions.isReturnFlightNeeded) {
          if (this.searchOptions.returnDate != null) {
            return true
          }
        } else {
          return true
        }
      }
      return false
    },
    // This method is called on Search button click
    showResult () {
      this.formValidated = this.checkValidation()
      if (this.formValidated) {
        this.isError = false
        router.push({ name: 'FlightResults', params: { searchOptions: this.searchOptions } })
      } else {
        this.isError = true
      }
    },
    // This method is meant to decrement passenger count
    decrement (passengerType) {
      if (passengerType === 'adult' && this.searchOptions.passengersCount.adults > 0) {
        this.searchOptions.passengersCount.adults--
      }
      if (passengerType === 'children' && this.searchOptions.passengersCount.children > 0) {
        this.searchOptions.passengersCount.children--
      }
      if (passengerType === 'infant' && this.searchOptions.passengersCount.infant > 0) {
        this.searchOptions.passengersCount.infant--
      }
      this.calculatePssengersCount()
    },
    // This method is meant to increment passenger count
    increment (passengerType) {
      if (passengerType === 'adult') {
        this.searchOptions.passengersCount.adults++
      }
      if (passengerType === 'children') {
        this.searchOptions.passengersCount.children++
      }
      if (passengerType === 'infant') {
        this.searchOptions.passengersCount.infant++
      }
      this.calculatePssengersCount()
    },
    // Calculating total number of passengers including adults, children and infants
    calculatePssengersCount () {
      this.searchOptions.passengersCount.total = this.searchOptions.passengersCount.infant +
      this.searchOptions.passengersCount.children + this.searchOptions.passengersCount.adults
    }
  },
  // Making Get request call to get airport names on Created hook method
  created () {
    FlightApi.getAirports().then((response) => {
      this.populateAirportNames(response)
    }).catch(error => console.log(error))
  }
}
</script>
