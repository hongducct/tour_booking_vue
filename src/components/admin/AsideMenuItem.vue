<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { mdiChevronDown, mdiChevronRight } from '@mdi/js'
import { getButtonColor } from '@/colors.js'
import BaseIcon from '@/components/admin/BaseIcon.vue'
import AsideMenuList from '@/components/admin/AsideMenuList.vue'

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  isDropdownList: Boolean,
})

const emit = defineEmits(['menu-click'])

const hasColor = computed(() => props.item && props.item.color)

const isDropdownActive = ref(false)

const componentClass = computed(() => {
  const baseClasses = [
    'flex items-center w-full text-left rounded-lg transition-all duration-200 group',
    props.isDropdownList ? 'py-2 px-3 text-sm ml-4' : 'py-3 px-4',
  ]

  if (hasColor.value) {
    if (props.item.color === 'danger') {
      return [
        ...baseClasses,
        'text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20',
      ]
    }
    return [...baseClasses, getButtonColor(props.item.color, false, true)]
  }

  return [
    ...baseClasses,
    'text-slate-700 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50',
  ]
})

const activeClass = computed(
  () =>
    'bg-blue-100 text-blue-700 border-r-2 border-blue-600 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-400 font-semibold',
)

const hasDropdown = computed(() => !!props.item.menu)

const menuClick = (event) => {
  emit('menu-click', event, props.item)

  if (hasDropdown.value) {
    isDropdownActive.value = !isDropdownActive.value
  }
}
</script>

<template>
  <div>
    <!-- RouterLink case -->
    <RouterLink
      v-if="item.to"
      :to="item.to"
      :class="[
        componentClass,
        $route.path === item.to || $route.path.startsWith(item.to + '/') ? activeClass : '',
      ]"
      @click="menuClick"
    >
      <BaseIcon v-if="item.icon" :path="item.icon" class="flex-shrink-0 mr-3" :size="20" />
      <span class="flex-1 font-medium truncate">
        {{ item.label }}
      </span>
      <BaseIcon
        v-if="hasDropdown"
        :path="isDropdownActive ? mdiChevronDown : mdiChevronRight"
        class="flex-shrink-0 ml-2 transition-transform duration-200"
        :size="16"
      />
    </RouterLink>

    <!-- Regular button/link case -->
    <component
      v-else
      :is="item.href ? 'a' : 'button'"
      :href="item.href ?? null"
      :target="item.target ?? null"
      :class="componentClass"
      @click="menuClick"
    >
      <BaseIcon v-if="item.icon" :path="item.icon" class="flex-shrink-0 mr-3" :size="20" />
      <span class="flex-1 font-medium truncate">
        {{ item.label }}
      </span>
      <BaseIcon
        v-if="hasDropdown"
        :path="isDropdownActive ? mdiChevronDown : mdiChevronRight"
        class="flex-shrink-0 ml-2 transition-transform duration-200"
        :size="16"
      />
    </component>

    <div
      v-if="hasDropdown"
      :class="[
        'overflow-hidden transition-all duration-300 ease-in-out',
        isDropdownActive ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
      ]"
    >
      <div class="mt-1 ml-4 pl-4 border-l-2 border-slate-200 dark:border-slate-600">
        <AsideMenuList
          :menu="item.menu"
          is-dropdown-list
          @menu-click="emit('menu-click', $event)"
        />
      </div>
    </div>
  </div>
</template>
