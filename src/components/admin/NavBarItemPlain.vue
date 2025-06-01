<script setup>
defineProps({
  display: {
    type: String,
    default: 'flex',
  },
  useMargin: Boolean,
})
</script>

<template>
  <div
    :class="[display, useMargin ? 'my-2 mx-3' : 'py-3 px-4']"
    class="navbar-item-label items-center cursor-pointer text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-200 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50"
  >
    <slot />
  </div>
</template>
