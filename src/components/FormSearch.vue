<template>
  <div class="w-full max-w-6xl mx-auto px-4">
    <div class="mt-8 w-full">
      <div class="bg-white rounded-lg shadow-md p-6 flex flex-wrap lg:flex-nowrap gap-4">
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

        <!-- Chọn ngày khởi hành -->
        <div class="input-group flex-1 min-w-0">
          <label class="block text-sm font-medium text-gray-700 mb-2">Ngày bạn muốn đi*</label>

          <!-- Date Input Button -->
          <div class="relative">
            <button
              @click="toggleCalendar"
              class="w-full p-3 border border-gray-200 rounded-md bg-gray-50 text-left focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 flex items-center justify-between hover:bg-gray-100 transition-colors"
            >
              <span class="text-gray-700">
                {{ selectedDate ? formatDisplayDate(selectedDate) : 'Chọn ngày khởi hành' }}
              </span>
              <svg
                class="w-5 h-5 text-gray-400 transition-transform"
                :class="{ 'rotate-180': showCalendar }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
            </button>

            <!-- Calendar Popup -->
            <div
              v-if="showCalendar"
              class="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-80 calendar-container"
            >
              <!-- Calendar Header -->
              <div class="flex items-center justify-between p-4 border-b border-gray-200">
                <button
                  @click="previousMonth"
                  class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 19l-7-7 7-7"
                    ></path>
                  </svg>
                </button>

                <h3 class="text-lg font-semibold text-gray-800">
                  {{ currentMonthYear }}
                </h3>

                <button
                  @click="nextMonth"
                  class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    class="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                </button>
              </div>

              <!-- Calendar Grid -->
              <div class="p-4">
                <!-- Day Headers -->
                <div class="grid grid-cols-7 gap-1 mb-2">
                  <div
                    v-for="day in ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']"
                    :key="day"
                    class="text-center text-sm font-medium text-gray-500 py-2"
                  >
                    {{ day }}
                  </div>
                </div>

                <!-- Calendar Days -->
                <div class="grid grid-cols-7 gap-1">
                  <div v-for="date in calendarGrid" :key="date.dateString" class="aspect-square">
                    <button
                      v-if="date.inCurrentMonth"
                      @click="selectDate(date.dateString)"
                      :disabled="!date.available || date.isPast"
                      :class="[
                        'w-full h-full rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center',
                        date.available && !date.isPast
                          ? 'bg-red-50 text-red-800 hover:bg-red-100 hover:scale-105 cursor-pointer'
                          : 'bg-gray-50 text-gray-400 cursor-not-allowed',
                        selectedDate === date.dateString
                          ? 'ring-2 ring-red-500 bg-red-500 text-white hover:bg-red-600'
                          : '',
                        date.isToday && selectedDate !== date.dateString
                          ? 'ring-1 ring-blue-300'
                          : '',
                      ]"
                    >
                      {{ date.day }}
                    </button>
                    <div
                      v-else
                      class="w-full h-full flex items-center justify-center text-gray-300 text-sm"
                    >
                      {{ date.day }}
                    </div>
                  </div>
                </div>

                <!-- Legend -->
                <div class="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-600">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-red-100 rounded-full mr-1"></div>
                    <span>Có tour</span>
                  </div>
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                    <span>Đã chọn</span>
                  </div>
                </div>

                <!-- Clear Selection Button -->
                <div class="mt-4 flex justify-between">
                  <button
                    @click="clearDateSelection"
                    class="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Xóa lựa chọn
                  </button>
                  <button
                    @click="closeCalendar"
                    class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Date Display -->
          <div v-if="selectedDate" class="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 text-red-600 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
                <span class="text-sm font-medium text-red-800">
                  Ngày khởi hành: {{ formatDisplayDate(selectedDate) }}
                </span>
              </div>
              <button
                @click="clearDateSelection"
                class="text-red-600 hover:text-red-800 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
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

    <!-- Calendar Overlay -->
    <div
      v-if="showCalendar"
      @click="closeCalendar"
      class="fixed inset-0 bg-black bg-opacity-20 z-40"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Router initialization
const router = useRouter()

// Reactive state
const destination = ref('')
const selectedDate = ref('')
const locations = ref([])
const availableDates = ref([])
const filteredDestinations = ref([])
const showDestinationDropdown = ref(false)
const showCalendar = ref(false)
const currentCalendarDate = ref(new Date())
const isLoading = ref(false)

// Template refs
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

// Calendar computed properties
const currentMonthYear = computed(() => {
  return currentCalendarDate.value.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  })
})

const calendarGrid = computed(() => {
  const year = currentCalendarDate.value.getFullYear()
  const month = currentCalendarDate.value.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const dates = []
  const currentDate = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    const available = availableDates.value.some((avail) => avail.date === dateString)
    const inCurrentMonth = currentDate.getMonth() === month
    const isPast = currentDate < today
    const isToday = currentDate.getTime() === today.getTime()

    dates.push({
      dateString,
      day: currentDate.getDate(),
      available,
      inCurrentMonth,
      isPast,
      isToday,
    })

    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
})

const formatDisplayDate = (dateString) => {
  const [year, month, day] = dateString.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  if (date.getTime() === today.getTime()) {
    return 'Hôm nay'
  } else if (date.getTime() === tomorrow.getTime()) {
    return 'Ngày mai'
  } else {
    return date.toLocaleDateString('vi-VN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
}

// Fetch locations and available dates from API
onMounted(async () => {
  isLoading.value = true
  try {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.hongducct.id.vn/api'

    // Fetch locations
    const locationsResponse = await fetch(`${apiBaseUrl}/locations`)
    const locationsResult = await locationsResponse.json()
    if (locationsResult && locationsResult.data) {
      locations.value = locationsResult.data
    }

    // Fetch available dates
    const datesResponse = await axios.get(`${apiBaseUrl}/tour-availability`)
    availableDates.value = datesResponse.data
  } catch (error) {
    console.error('Error fetching data:', error)
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

// Filter destinations based on user input
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
const onDestinationFocus = () => {
  if (destination.value.trim() !== '') {
    filterDestinations()
  }
}

// Handle selection from dropdown
const handleDestinationSelect = (location) => {
  // Set the destination name in the input
  destination.value = location.name
  // Hide the dropdown
  showDestinationDropdown.value = false

  // Navigate to destination detail page
  navigateToDestination(location)
}

// Calendar methods
const toggleCalendar = () => {
  showCalendar.value = !showCalendar.value
}

const closeCalendar = () => {
  showCalendar.value = false
}

const previousMonth = () => {
  const newDate = new Date(currentCalendarDate.value)
  newDate.setMonth(newDate.getMonth() - 1)
  currentCalendarDate.value = newDate
}

const nextMonth = () => {
  const newDate = new Date(currentCalendarDate.value)
  newDate.setMonth(newDate.getMonth() + 1)
  currentCalendarDate.value = newDate
}

const selectDate = (dateString) => {
  selectedDate.value = selectedDate.value === dateString ? '' : dateString
  // Auto-close calendar after selection
  setTimeout(() => {
    closeCalendar()
  }, 300)
}

const clearDateSelection = () => {
  selectedDate.value = ''
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (destinationRef.value && !destinationRef.value.contains(event.target)) {
    showDestinationDropdown.value = false
  }

  // Close calendar if clicking outside
  if (
    showCalendar.value &&
    !event.target.closest('.calendar-container') &&
    !event.target.closest('button')
  ) {
    closeCalendar()
  }
}

// Search function - navigate to tours page with filters
const search = () => {
  const queryParams = {}

  // Add location filter if destination is selected
  if (destination.value.trim()) {
    queryParams.location = destination.value.trim()
  }

  // Add date filter if date is selected
  if (selectedDate.value) {
    queryParams.date = selectedDate.value
  }

  // Navigate to tours page with query parameters
  router.push({
    path: '/tour',
    query: queryParams,
  })
}

// Watch for changes in input to filter results
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

/* Animation for dropdown and calendar */
.absolute {
  transition: all 0.2s ease;
}

.calendar-container {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rotate-180 {
  transform: rotate(180deg);
}

/* Overlay for calendar */
.fixed.inset-0.bg-black.bg-opacity-20.z-40 {
  backdrop-filter: blur(5px);
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
