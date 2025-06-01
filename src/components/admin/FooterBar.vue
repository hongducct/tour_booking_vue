<script setup>
import { containerMaxW } from '@/config.js'
import BaseLevel from '@/components/admin/BaseLevel.vue'
import TravelBookingHongDucCT from '@/components/admin/TravelBookingHongDucCT.vue'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="py-2 px-6" :class="containerMaxW">
    <BaseLevel>
      <div class="text-center md:text-left">
        <b>&copy;{{ year }}, <a href="https://hongducct.id.vn" target="_blank">hongducct.id.vn</a>.</b>
        <slot />
      </div>
      <div class="md:py-2">
        <a href="https://github.com/hongducct/travelbook-app">
          <TravelBookingHongDucCT class="w-auto h-10 md:h-6" />
        </a>
      </div>
    </BaseLevel>
  </footer>
</template>
