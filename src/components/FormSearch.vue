<template>
  <div class="w-full max-w-6xl mx-auto px-4">
    <div class="mt-8 w-full">
      <div class="bg-white rounded-lg shadow-md p-6 flex flex-wrap lg:flex-nowrap gap-4">
        <!-- Điểm khởi hành -->
        <div class="input-group flex-1 min-w-0 relative" ref="departureRef">
          <label class="block text-sm font-medium text-gray-700 mb-2">Bạn ở đâu?</label>
          <div class="relative">
            <input
              type="text"
              name="departure"
              autocomplete="off"
              placeholder="Điểm khởi hành"
              class="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
              v-model="departure"
              @input="filterDepartures"
              @focus="onDepartureFocus"
            />

            <div
              v-if="showDepartureDropdown && filteredDepartures.length > 0"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              <ul>
                <li
                  v-for="location in filteredDepartures"
                  :key="location.id"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  @click="handleDepartureSelect(location)"
                >
                  <span class="mr-2">📍</span>
                  <div>
                    <div class="font-medium">{{ location.name }}</div>
                    <div class="text-xs text-gray-500">{{ formatLocation(location) }}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Điểm đến -->
        <div class="input-group flex-1 min-w-0 relative" ref="destinationRef">
          <label class="block text-sm font-medium text-gray-700 mb-2">Bạn muốn đi Tour*</label>
          <div class="relative">
            <input
              type="text"
              name="destination"
              autocomplete="off"
              placeholder="Chọn Tour bạn muốn đi"
              class="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
              v-model="destination"
              @input="filterDestinations"
              @focus="onDestinationFocus"
            />

            <div
              v-if="showDestinationDropdown && filteredDestinations.length > 0"
              class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
            >
              <ul>
                <li
                  v-for="location in filteredDestinations"
                  :key="location.id"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-start gap-3"
                  @click="handleDestinationSelect(location)"
                >
                  <div class="flex-shrink-0 w-12 h-12 mt-1 overflow-hidden rounded">
                    <img
                      :src="location.image"
                      :alt="location.name"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div class="font-medium">{{ location.name }}</div>
                    <div class="text-xs text-gray-500">{{ formatLocation(location) }}</div>
                    <div
                      v-if="location.description"
                      class="text-xs text-gray-600 mt-1 line-clamp-1"
                    >
                      {{ location.description }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Số người -->
        <div class="input-group flex-1 min-w-0">
          <label class="block text-sm font-medium text-gray-700 mb-2">Số người</label>
          <input
            type="number"
            name="people"
            placeholder="Số người đi"
            class="w-full p-3 border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
            v-model="people"
            min="1"
          />
        </div>

        <!-- Nút tìm kiếm -->
        <div class="input-group w-full lg:w-auto flex items-end">
          <button
            type="button"
            @click="search"
            class="w-full lg:w-auto bg-red-500 text-white font-medium py-3 px-6 rounded-md hover:bg-red-600 transition duration-300 h-12"
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// Router initialization
const router = useRouter()

// Reactive state
const departure = ref('')
const destination = ref('')
const people = ref('')
const locations = ref([])
const filteredDepartures = ref([])
const filteredDestinations = ref([])
const showDepartureDropdown = ref(false)
const showDestinationDropdown = ref(false)
const isLoading = ref(false)

// Template refs
const departureRef = ref(null)
const destinationRef = ref(null)

// Format location to show city, country
const formatLocation = (location) => {
  let result = []
  if (location.city) result.push(location.city)
  if (location.country) result.push(location.country)
  return result.join(', ')
}

// Create slug from id and name (matching the function in DestinationView)
const createSlug = (id, name) => {
  return `${id}-${name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '')}`
}

// Navigate to destination detail page
const navigateToDestination = (location) => {
  router.push(`/destination/${createSlug(location.id, location.name)}`)
}

// Fetch locations from API
onMounted(async () => {
  isLoading.value = true
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.hongducct.id.vn/api'
    const response = await fetch(`${apiBaseUrl}/locations`)
    const result = await response.json()
    if (result && result.data) {
      locations.value = result.data
    }
  } catch (error) {
    console.error('Error fetching locations:', error)
  } finally {
    isLoading.value = false
  }

  // Add click outside event listener
  document.addEventListener('click', handleClickOutside)
})

// Clean up event listener
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Filter locations based on user input
const filterDepartures = () => {
  if (departure.value.trim() !== '') {
    filteredDepartures.value = locations.value.filter(
      (location) =>
        location.name.toLowerCase().includes(departure.value.toLowerCase()) ||
        (location.city && location.city.toLowerCase().includes(departure.value.toLowerCase())) ||
        (location.country &&
          location.country.toLowerCase().includes(departure.value.toLowerCase())),
    )
    showDepartureDropdown.value = true
  } else {
    filteredDepartures.value = []
    showDepartureDropdown.value = false
  }
}

const filterDestinations = () => {
  if (destination.value.trim() !== '') {
    filteredDestinations.value = locations.value.filter(
      (location) =>
        location.name.toLowerCase().includes(destination.value.toLowerCase()) ||
        (location.city && location.city.toLowerCase().includes(destination.value.toLowerCase())) ||
        (location.country &&
          location.country.toLowerCase().includes(destination.value.toLowerCase())),
    )
    showDestinationDropdown.value = true
  } else {
    filteredDestinations.value = []
    showDestinationDropdown.value = false
  }
}

// Focus event handlers
const onDepartureFocus = () => {
  if (departure.value.trim() !== '') {
    filterDepartures()
  }
}

const onDestinationFocus = () => {
  if (destination.value.trim() !== '') {
    filterDestinations()
  }
}

// Handle selection from dropdown
const handleDepartureSelect = (location) => {
  departure.value = location.name
  showDepartureDropdown.value = false
}

const handleDestinationSelect = (location) => {
  // Set the destination name in the input
  destination.value = location.name
  // Hide the dropdown
  showDestinationDropdown.value = false

  // Navigate to destination detail page
  navigateToDestination(location)
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (departureRef.value && !departureRef.value.contains(event.target)) {
    showDepartureDropdown.value = false
  }
  if (destinationRef.value && !destinationRef.value.contains(event.target)) {
    showDestinationDropdown.value = false
  }
}

// Search function
const search = () => {
  console.log('Tìm kiếm:', {
    departure: departure.value,
    destination: destination.value,
    people: people.value,
  })

  // If there's an exact match for destination, navigate to that location
  const exactMatch = locations.value.find(
    (loc) => loc.name.toLowerCase() === destination.value.toLowerCase(),
  )

  if (exactMatch) {
    navigateToDestination(exactMatch)
  } else {
    // Optional: Could navigate to a search results page instead
    // router.push({
    //   path: '/search-results',
    //   query: {
    //     departure: departure.value,
    //     destination: destination.value,
    //     people: people.value
    //   }
    // })
  }
}

// Watch for changes in input to filter results
watch(departure, filterDepartures)
watch(destination, filterDestinations)
</script>

<style scoped>
/* Base styles for the component */
.input-group {
  position: relative;
}

/* Line clamp for description */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .input-group {
    width: 100%;
  }
}

/* Animation for dropdown */
.absolute {
  transition: all 0.2s ease;
}
</style>
