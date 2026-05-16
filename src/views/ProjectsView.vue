<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const projects = ref<{ id: number; name: string; web_url: string }[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    const response = await api.get('/metrics/projects')
    projects.value = response.data
  } catch (err: any) {
    error.value = 'Failed to load projects'
  } finally {
    loading.value = false
  }
})

function viewDashboard(projectId: number) {
  router.push({ path: '/dashboard', query: { project_id: projectId } })
}
</script>

<template>
  <div class="p-8 flex flex-col gap-6">
    <h1 class="text-2xl font-bold">Projects</h1>

    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner />
    </div>

    <Message v-else-if="error" severity="error">{{ error }}</Message>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card v-for="project in projects" :key="project.id">
        <template #title>{{ project.name }}</template>
        <template #content>
          <div class="flex flex-col gap-3">
            <a :href="project.web_url" target="_blank" class="text-sm text-primary-400 hover:underline truncate">
              {{ project.web_url }}
            </a>
            <Button label="View Dashboard" icon="pi pi-chart-bar" @click="viewDashboard(project.id)" />
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
