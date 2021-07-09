<template>
  <div class="flight-results">
    <div class="flight-results__row">
      <div class="flight-results__row-left">Source:</div>
      <div class="flight-results__row-right">{{searchOptions.selectedSource}}</div>
    </div>
    <div class="flight-results__row">
      <div class="flight-results__row-left">Destination:</div>
      <div class="flight-results__row-right">{{searchOptions.selectedDestination}}</div>
    </div>
    <div class="flight-results__row">
      <div class="flight-results__row-left">Departure On:</div>
      <div> {{searchOptions.departureDate}}</div>
    </div>
    <div class="flight-results__row" v-if="searchOptions.isReturnFlightNeeded">
      <div class="flight-results__row-left">Return On:</div>
      <div class="flight-results__row-right">{{searchOptions.returnDate}}</div>
    </div><hr>
    <div class="passenger">
      <div>Passengers :</div>
      <div class="passenger-cards">
        <div class="passenger-cards__item">
          <div>Adults</div>
          <div>{{searchOptions.passengersCount.adults}}</div>
        </div>
        <div class="passenger-cards__item">
          <div>Children</div>
          <div>{{searchOptions.passengersCount.children}}</div>
        </div>
        <div class="passenger-cards__item">
          <div>Infants</div>
          <div>{{searchOptions.passengersCount.infant}}</div>
          </div>
        <div class="passenger-cards__item">
          <div>Total</div>
          <div>{{searchOptions.passengersCount.total}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  props: ['id'],

  data () {
    return {
      searchOptions: {}
    }
  },
  created () {
    this.searchOptions = this.$route.params.searchOptions
    console.log(this.$route.params.searchOptions)
  }
}
</script>
