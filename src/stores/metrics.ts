import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
export const useMetricsStore = defineStore('metrics', () => {
  // state
  const selectedProjectId = ref<number | null>(null)
  const selectedDays = ref<number>(30)
  const deploymentFrequency = ref<any>(null)
  const leadTime = ref<any>(null)
  const changeFailureRate = ref<any>(null)
  const mttr = ref<any>(null)
  const trends = ref<any>(null)
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)
  const hasFetched = ref<boolean>(false)

  // actions come next
  async function fetchMetrics(projectId: number, days: number) {
    loading.value = true
    error.value = null
    try {
      const [df, lt, cfd, mttrData, trendsData] = await Promise.all([
        api.get('/metrics/deployment-frequency', { params: { project_id: projectId, days } }),
        api.get('/metrics/lead-time', { params: { project_id: projectId, days } }),
        api.get('/metrics/change-failure-rate', { params: { project_id: projectId, days } }),
        api.get('/metrics/mean-time-to-recovery', { params: { project_id: projectId, days } }),
        api.get('/metrics/trends', { params: { project_id: projectId, days } }),
      ])
      deploymentFrequency.value = df.data
      leadTime.value = lt.data
      changeFailureRate.value = cfd.data
      mttr.value = mttrData.data
      trends.value = trendsData.data
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Failed to Fetch metrics'
    } finally {
      loading.value = false
      hasFetched.value = true
    }
  }

  return {
    selectedProjectId,
    selectedDays,
    deploymentFrequency,
    leadTime,
    changeFailureRate,
    mttr,
    trends,
    loading,
    error,
    fetchMetrics,
    hasFetched,
  }
})
