import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMetricsStore } from '@/stores/metrics'
import api from '@/services/api'

export function useMetrics() {
  const route = useRoute()
  const metricsStore = useMetricsStore()

  const projects = ref<{ id: number; name: string; provider: string }[]>([])
  const selectedProject = ref<{ id: number; name: string; provider: string } | null>(null)
  const days = ref<number>(30)

  //watch
  watch(selectedProject, (newVal) => {
    if (newVal) {
      loadMetrics()
    }
  })
  watch(days, () => {
    if (selectedProject.value) {
      loadMetrics()
    }
  })

  const daysOptions = [
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Last 180 days', value: 180 },
  ]

  async function loadProjects() {
    const response = await api.get('/metrics/projects')
    projects.value = response.data
    if (route.query.project_id) {
      selectedProject.value =
        projects.value.find((p) => p.id === Number(route.query.project_id)) || null
    }
    if (selectedProject.value) {
      loadMetrics()
    }
  }

  async function loadMetrics() {
    if (!selectedProject.value) return
    await metricsStore.fetchMetrics(selectedProject.value.id, days.value)
  }

  onMounted(() => {
    loadProjects()
  })

  return {
    projects,
    selectedProject,
    days,
    daysOptions,
    loadMetrics,
  }
}
