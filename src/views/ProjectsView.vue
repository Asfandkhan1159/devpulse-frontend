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
  <div class="projects">
    <div class="projects-header">
      <h1 class="projects-title">Projects</h1>
      <p class="projects-subtitle">{{ projects.length }} connected repositories</p>
    </div>

    <div v-if="loading" class="loading-state">
      <ProgressSpinner style="width: 32px; height: 32px" />
    </div>

    <Message v-else-if="error" severity="error">{{ error }}</Message>

    <div v-else class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-card-header">
          <i class="pi pi-gitlab project-icon" />
          <span class="project-name">{{ project.name }}</span>
        </div>
        <a :href="project.web_url" target="_blank" class="project-url">
          {{ project.web_url }}
        </a>
        <Button
          label="View Dashboard"
          icon="pi pi-chart-bar"
          severity="secondary"
          size="small"
          @click="viewDashboard(project.id)"
          class="project-btn"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.projects {
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.projects-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.projects-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
}

.projects-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.project-card {
  background: #111318;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s;
}

.project-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.project-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.project-icon {
  font-size: 18px;
  color: #e24646;
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
}

.project-url {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-url:hover {
  color: rgba(255, 255, 255, 0.6);
}

.project-btn {
  align-self: flex-start;
  margin-top: 0.25rem;
}
</style>
