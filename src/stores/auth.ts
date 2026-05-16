import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref<boolean>(false)
  const initiliazed = ref<boolean>(false)
  const user = ref<{ userId: string; email: string } | null>(null)
  async function initialize() {
    if (initiliazed.value) return
    try {
      const response = await api.get('/auth/me')
      if (response.data && response.data.email) {
        isAuthenticated.value = true
        user.value = response.data
      }
    } catch {
      isAuthenticated.value = false
      user.value = null
    } finally {
      initiliazed.value = true
    }
  }

  async function login(email: string, password: string) {
    await api.post('/auth/login', { email, password })
    isAuthenticated.value = true
  }

  async function logout() {
    await api.post('/auth/logout')
    isAuthenticated.value = false
  }

  return { isAuthenticated, initiliazed, user, login, logout, initialize }
})
