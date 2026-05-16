<script setup lang="ts">
import AppNavbar from '@/components/layout/AppNavbar.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <AppNavbar v-if="authStore.isAuthenticated" />
  <router-view />
</template>
