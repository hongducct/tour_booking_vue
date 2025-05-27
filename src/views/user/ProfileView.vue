<script setup>
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import TheHeader from '@/components/TheHeader.vue'
import UserSidebar from '@/components/user/UserSidebar.vue'
import ProfileForm from '@/components/user/ProfileForm.vue'
import PasswordForm from '@/components/user/PasswordForm.vue'
import { mdiAccount } from '@mdi/js'

const notifySuccess = (message) => {
  toast(message, {
    theme: 'auto',
    type: 'success',
    position: 'top-center',
    dangerouslyHTMLString: true,
  })
}
const notifyError = (message) => {
  toast(message, {
    theme: 'auto',
    type: 'error',
    position: 'top-center',
    dangerouslyHTMLString: true,
  })
}
</script>

<template>
  <TheHeader />
  <div class="flex min-h-screen mt-27 bg-gray-50">
    <!-- Sidebar -->
    <UserSidebar />

    <!-- Main Content -->
    <div class="w-full lg:ml-80">
      <div class="container mx-auto px-4 py-6 lg:px-8 lg:py-8 max-w-7xl">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            Profile Settings
          </h1>
          <p class="text-gray-600 mt-2">Manage your account settings and personal preferences</p>
        </div>

        <!-- Updated grid layout: 2/3 for ProfileForm, 1/3 for PasswordForm -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <!-- ProfileForm takes 2 columns (2/3 width) -->
          <div class="xl:col-span-2">
            <ProfileForm :notify-success="notifySuccess" :notify-error="notifyError" />
          </div>
          <!-- PasswordForm takes 1 column (1/3 width) -->
          <div class="xl:col-span-1">
            <PasswordForm :notify-success="notifySuccess" :notify-error="notifyError" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
