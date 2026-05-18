<template>
  <div class="login-bg">
    <div class="login-card">
      <div class="login-header">
        <svg
          width="40"
          height="40"
          viewBox="0 0 35 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.87 18.05L23.16 17.45L25.27 20.46V29.78L32.49 23.76V13.53L29.18 14.73L25.87 18.04V18.05ZM25.27 35.49L29.18 31.58V27.67L25.27 30.98V35.49ZM20.16 17.14H20.03H20.17H20.16ZM30.1 5.19L34.89 4.81L33.08 12.33L24.1 15.67L30.08 5.2L30.1 5.19ZM5.72 14.74L2.41 13.54V23.77L9.63 29.79V20.47L11.74 17.46L9.03 18.06L5.72 14.75V14.74ZM9.63 30.98L5.72 27.67V31.58L9.63 35.49V30.98ZM4.8 5.2L10.78 15.67L1.81 12.33L0 4.81L4.79 5.19L4.8 5.2ZM24.37 21.05V34.59L22.56 37.29L20.46 39.4H14.44L12.34 37.29L10.53 34.59V21.05L12.42 18.23L17.45 26.8L22.48 18.23L24.37 21.05ZM22.85 0L22.57 0.69L17.45 13.08L12.33 0.69L12.05 0H22.85Z"
            fill="#1D9E75"
          />
        </svg>
        <h1 class="login-title">DevPulse</h1>
        <p class="login-subtitle">Developer Productivity Intelligence</p>
      </div>

      <div class="oauth-buttons">
        <a :href="`${apiUrl}/auth/gitlab`" class="oauth-btn gitlab-btn">
          <i class="pi pi-gitlab" />
          <span>Continue with GitLab</span>
        </a>
        <a :href="`${apiUrl}/auth/github`" class="oauth-btn github-btn">
          <i class="pi pi-github" />
          <span>Continue with GitHub</span>
        </a>
      </div>

      <div class="divider">
        <span>or sign in with email</span>
      </div>

      <div class="email-form">
        <InputText v-model="email" type="text" placeholder="Email address" class="w-full" />
        <Password
          v-model="password"
          placeholder="Password"
          :toggleMask="true"
          :feedback="false"
          input-class="w-full!"
        />
        <p v-if="error" class="error-text">{{ error }}</p>
        <Button @click="handleLogin" label="Sign In" icon="pi pi-sign-in" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const authStore = useAuthStore()
const router = useRouter()
const error = ref<string | null>(null)
const apiUrl = import.meta.env.VITE_API_URL

async function handleLogin() {
  try {
    await authStore.login(email.value, password.value)
    router.push('/projects')
  } catch (err) {
    error.value = (err as any).response?.data?.message || 'Login failed'
  }
}
</script>

<style scoped>
.login-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a0b0e;
}

.login-card {
  background: #111318;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
}

.login-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
}

.login-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.oauth-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.oauth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.2s;
  cursor: pointer;
}

.oauth-btn:hover {
  opacity: 0.85;
}

.gitlab-btn {
  background: #e24646;
  color: #ffffff;
}

.github-btn {
  background: #238636;
  color: #ffffff;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.25);
  font-size: 12px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.07);
}

.email-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.error-text {
  font-size: 13px;
  color: #e24b4a;
  margin: 0;
}
</style>
