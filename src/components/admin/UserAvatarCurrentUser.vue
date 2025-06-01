<script setup>
import { useMainStore } from '@/stores/main'
import UserAvatar from '@/components/admin/UserAvatar.vue'

const mainStore = useMainStore()
</script>

<template>
  <UserAvatar :username="mainStore.admin.username" :avatar="mainStore.admin.avatar">
    <slot />
  </UserAvatar>
</template>
