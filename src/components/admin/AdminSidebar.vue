<template>
  <aside class="w-64 bg-gray-900 text-white p-6">
    <h1 class="text-2xl font-bold mb-8">Travel Admin</h1>
    <nav class="flex flex-col space-y-2">
      <RouterLink to="/admin/dashboard" class="sidebar-link">
        <HomeIcon class="w-5 h-5 mr-2" /> Dashboard
      </RouterLink>
      <RouterLink to="/admin/tours" class="sidebar-link">
        <MapIcon class="w-5 h-5 mr-2" /> Tours
      </RouterLink>
      <RouterLink to="/admin/bookings" class="sidebar-link">
        <ClipboardIcon class="w-5 h-5 mr-2" /> Bookings
      </RouterLink>
      <RouterLink to="/admin/users" class="sidebar-link">
        <UserGroupIcon class="w-5 h-5 mr-2" /> Users
      </RouterLink>
      <RouterLink to="/admin/blog" class="sidebar-link">
        <NewspaperIcon class="w-5 h-5 mr-2" /> Blog
      </RouterLink>
      <RouterLink to="/admin/settings" class="sidebar-link">
        <CogIcon class="w-5 h-5 mr-2" /> Settings
      </RouterLink>
      <button @click="logout" class="sidebar-link text-red-400">
        <ArrowLeftEndOnRectangleIcon class="w-5 h-5 mr-2" /> Logout
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import {
  HomeIcon,
  MapIcon,
  ClipboardIcon,
  UserGroupIcon,
  NewspaperIcon,
  CogIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const router = useRouter()
const logout = () => {
  // Gắn thêm xử lý thực tế khi cần
  router.push('/login')
}
</script>

<style scoped>
/* .sidebar-link {
  @apply flex items-center px-4 py-2 rounded-lg hover:bg-gray-800 transition;
} */
</style>
