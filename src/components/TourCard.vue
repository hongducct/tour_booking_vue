<template>
  <div class="package-wrap border rounded-lg shadow-xl/30 overflow-hidden bg-white">
    <RouterLink :to="`/tour/${createSlug(tour.id, tour.name)}`">
      <img
        :src="tour.images?.[0]?.image_url || '/images/default-tour.jpg'"
        :alt="tour.name"
        class="w-full h-64 object-cover"
      />
    </RouterLink>

    <div class="bg-yellow-500 text-white px-4 py-2 font-semibold text-sm">
      {{ formatPrice(tour.price) }} / người
    </div>

    <div class="p-4">
      <div class="text-center text-sm text-gray-600 mb-2">
        <ul class="flex justify-around">
          <li class="flex items-center gap-1">
            <ClockIcon class="w-4 h-4" />
            {{ tour.days }}N/{{ tour.nights }}Đ
          </li>
          <li class="flex items-center gap-1">
            <UserGroupIcon class="w-4 h-4" />
          </li>
          <li class="flex items-center gap-1">
            <MapPinIcon class="w-4 h-4" />
            <span>{{ tour.location?.name || 'Unknown' }}</span>
          </li>
        </ul>
      </div>

      <h3 class="text-lg font-bold mb-2">
        <RouterLink
          :to="`/tour/${createSlug(tour.id, tour.name)}`"
          class="hover:text-yellow-500"
        >
          {{ tour.name }}
        </RouterLink>
      </h3>

      <div class="text-sm text-gray-700 mb-3">
        <p>Điểm khởi hành: {{ tour.start_point || 'Unknown' }}</p>
        <div class="flex gap-1 text-yellow-400">
          <StarIcon v-for="n in 5" :key="n" class="w-4 h-4" />
        </div>
      </div>

      <div class="flex justify-between items-center">
        <RouterLink
          :to="`/tour/${createSlug(tour.id, tour.name)}`"
          class="text-yellow-500 hover:underline flex items-center gap-1"
        >
          Book Now <ArrowRightIcon class="w-4 h-4" />
        </RouterLink>
        <button class="text-gray-400 hover:text-red-500 flex items-center gap-1">
          <HeartIcon class="w-4 h-4" /> Wish List
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  ArrowRightIcon,
  HeartIcon,
} from '@heroicons/vue/24/solid'

const props = defineProps({ tour: Object })

const formatPrice = (price) => {
  const parsed = parseFloat(price)
  return parsed ? parsed.toLocaleString('vi-VN') + '₫' : '11,490,000₫'
}

const createSlug = (id, name) => {
  return `${id}-${name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`
}
</script>
