<script setup>
import { ref } from 'vue'
import { mdiClose, mdiDotsVertical } from '@mdi/js'
import { containerMaxW } from '@/config.js'
import BaseIcon from '@/components/admin/BaseIcon.vue'
import NavBarMenuList from '@/components/admin/NavBarMenuList.vue'
import NavBarItemPlain from '@/components/admin/NavBarItemPlain.vue'

defineProps({
  menu: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['menu-click'])

const menuClick = (event, item) => {
  emit('menu-click', event, item)
}

const isMenuNavBarActive = ref(false)
</script>

<template>
  <nav
    class="top-0 inset-x-0 fixed bg-white/80 backdrop-blur-lg border-b border-slate-200 h-16 z-30 transition-all duration-300 w-screen lg:w-auto dark:bg-slate-800/90 dark:border-slate-700 shadow-sm"
  >
    <div class="flex lg:items-stretch h-full" :class="containerMaxW">
      <div class="flex flex-1 items-stretch h-16">
        <slot />
      </div>
      <div class="flex-none items-stretch flex h-16 lg:hidden">
        <NavBarItemPlain @click.prevent="isMenuNavBarActive = !isMenuNavBarActive">
          <BaseIcon :path="isMenuNavBarActive ? mdiClose : mdiDotsVertical" size="24" />
        </NavBarItemPlain>
      </div>
      <div
        class="max-h-screen-menu overflow-y-auto lg:overflow-visible absolute w-screen top-16 left-0 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-xl lg:w-auto lg:flex lg:static lg:shadow-none lg:bg-transparent lg:backdrop-blur-none lg:border-none dark:bg-slate-800/95 dark:border-slate-700"
        :class="[isMenuNavBarActive ? 'block' : 'hidden']"
      >
        <NavBarMenuList :menu="menu" @menu-click="menuClick" />
      </div>
    </div>
  </nav>
</template>
