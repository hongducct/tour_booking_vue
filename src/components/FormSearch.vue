<template>
  <div class="container">
    <div class="trip-search-section">
      <div class="trip-search-inner white-bg flex flex-wrap lg:flex-nowrap gap-4">
        <!-- Điểm khởi hành -->
        <div class="input-group flex-1">
          <label>Bạn ở đâu?</label>
          <input
            type="text"
            name="departure"
            autocomplete="off"
            placeholder="Điểm khởi hành"
            class="in_dd mod-search-searchword txt_search w-full border p-2 rounded"
            v-model="departure"
          />
          <input type="hidden" name="location" />
          <div id="show_data" v-show="false">
            <ul></ul>
          </div>
        </div>

        <!-- Điểm đến -->
        <div class="input-group flex-1">
          <label>Bạn muốn đi Tour*</label>
          <input
            type="text"
            name="destination"
            autocomplete="off"
            placeholder="Chọn Tour bạn muốn đi"
            class="in_dd diemden-search-searchword txt_search2 w-full border p-2 rounded"
            v-model="destination"
          />
          <input type="hidden" name="destination" />
          <div id="show_data2" v-show="false">
            <ul></ul>
          </div>
        </div>

        <!-- Số người -->
        <div class="input-group flex-1">
          <label>Số người</label>
          <input
            type="text"
            name="people"
            placeholder="Số người đi"
            class="w-full border p-2 rounded"
            v-model="people"
          />
        </div>

        <!-- Nút tìm kiếm -->
        <div class="input-group w-full lg:w-auto">
          <label class="sr-only">Search</label>
          <input
            type="submit"
            name="travel-search"
            value="Tìm kiếm"
            @click.prevent="search"
            class="bg-orange-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-orange-600 transition"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const departure = ref('')
const destination = ref('')
const people = ref('')

const search = () => {
  console.log('Tìm kiếm:', {
    departure: departure.value,
    destination: destination.value,
    people: people.value,
  })
}
</script>

<style scoped>
.trip-search-section {
  margin-top: 2rem;
}

.trip-search-inner {
  padding: 1rem;
  background-color: #fff;
  border-radius: 8px;
}
</style>
