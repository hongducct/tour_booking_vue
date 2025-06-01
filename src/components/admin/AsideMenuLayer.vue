<script setup>
import { mdiLogout, mdiClose } from '@mdi/js'
import { computed } from 'vue'
import AsideMenuList from '@/components/admin/AsideMenuList.vue'
import AsideMenuItem from '@/components/admin/AsideMenuItem.vue'
import BaseIcon from '@/components/admin/BaseIcon.vue'

defineProps({
  menu: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['menu-click', 'aside-lg-close-click'])

const logoutItem = computed(() => ({
  label: 'Logout',
  icon: mdiLogout,
  color: 'danger',
  isLogout: true,
}))

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}

const asideLgCloseClick = (event) => {
  emit('aside-lg-close-click', event)
}
</script>

<template>
  <aside
    id="aside"
    class="lg:py-3 lg:pl-3 w-60 fixed flex z-40 top-0 h-screen transition-all duration-300 overflow-hidden"
  >
    <div
      class="aside lg:rounded-xl flex-1 flex flex-col overflow-hidden bg-white border-r border-slate-200 dark:bg-slate-800 dark:border-slate-700 shadow-xl lg:shadow-2xl"
    >
      <!-- Brand/Header -->
      <div
        class="aside-brand flex flex-row h-14 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-400 to-indigo-600 text-white"
      >
        <div class="text-center flex-1 lg:text-left xl:text-center">
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <span class="font-bold text-sm">T</span>
            </div>
            <span class="font-bold text-lg">TravelBook</span>
          </div>
        </div>
        <button
          class="hidden lg:inline-flex xl:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
          @click.prevent="asideLgCloseClick"
        >
          <BaseIcon :path="mdiClose" size="20" />
        </button>
      </div>

      <!-- Menu Items -->
      <div class="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-1">
        <AsideMenuList :menu="menu" @menu-click="menuClick" />
      </div>

      <!-- Logout Button -->
      <div class="border-t border-slate-200 dark:border-slate-700 p-4">
        <AsideMenuItem :item="logoutItem" @menu-click="menuClick" />
      </div>
    </div>
  </aside>
</template>
