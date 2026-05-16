import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useMetricsStore } from '@/stores/metrics'

export function useMetrics() {
  const route = useRoute()
  const metricsStore = useMetricsStore()

  const projectId = ref<number>(Number(route.query.project_id) || 1)
  const days = ref<number>(30)

  const daysOptions = [
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Last 180 days', value: 180 },
  ]

  async function loadMetrics() {
    await metricsStore.fetchMetrics(projectId.value, days.value)
  }

  onMounted(() => {
    if (route.query.project_id) {
      loadMetrics()
    }
  })

  return {
    projectId,
    days,
    daysOptions,
    loadMetrics,
  }
}
