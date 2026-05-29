<script setup lang="ts">
import { useMetricsStore } from '@/stores/metrics'
import MetricCard from '@/components/metrics/MetricCard.vue'
import { useMetrics } from '@/composables/useMetrics'

const metricsStore = useMetricsStore()
const { projects, selectedProject, days, daysOptions, loadMetrics } = useMetrics()

function formatDuration(hours: number): string {
  if (hours === 0) return '0m'
  const totalSeconds = hours * 3600
  if (totalSeconds < 60) return `${Math.round(totalSeconds)}s`
  const totalMinutes = hours * 60
  if (totalMinutes < 60) return `${Math.round(totalMinutes)}m`
  return `${Math.round(hours)}h`
}
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">DORA Metrics</h1>
        <p class="dashboard-subtitle">Developer performance intelligence</p>
      </div>
      <div class="filter-bar">
        <Select
          v-model="selectedProject"
          :options="projects"
          optionLabel="name"
          placeholder="Select project"
          class="filter-select"
        />
        <Select
          v-model="days"
          :options="daysOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select period"
          class="filter-select"
        />
        <Button
          label="Load Metrics"
          icon="pi pi-refresh"
          @click="loadMetrics"
          class="filter-button"
        />
      </div>
    </div>

    <Message v-if="metricsStore.error" severity="error" class="mt-4">
      {{ metricsStore.error }}
    </Message>

    <div v-if="metricsStore.loading" class="loading-state">
      <ProgressSpinner style="width: 32px; height: 32px" />
      <span>Fetching metrics...</span>
    </div>

    <div v-else-if="!metricsStore.hasFetched" class="empty-state">
      <i class="pi pi-chart-bar empty-icon" />
      <p>Select a project and period, then click Load Metrics</p>
    </div>

    <div v-else class="metrics-grid">
      <MetricCard
        v-if="metricsStore.deploymentFrequency"
        title="Deployment Frequency"
        :value="metricsStore.deploymentFrequency.total_deployments"
        :label="metricsStore.deploymentFrequency.frequency_label"
        icon="pi pi-cloud-upload"
        :performance="metricsStore.deploymentFrequency.performance"
        :sparkline="metricsStore.trends?.deployment_frequency"
      />
      <MetricCard
        v-if="metricsStore.leadTime"
        title="Lead Time"
        :value="formatDuration(metricsStore.leadTime.average_lead_time_hours)"
        label="Average lead time"
        icon="pi pi-clock"
        :performance="metricsStore.leadTime.performance"
        :sparkline="metricsStore.trends?.lead_time"
      />
      <MetricCard
        v-if="metricsStore.changeFailureRate"
        title="Change Failure Rate"
        :value="Math.round(metricsStore.changeFailureRate.failure_rate_percentage) + '%'"
        label="Of deployments failed"
        icon="pi pi-exclamation-triangle"
        :performance="metricsStore.changeFailureRate.performance"
        :sparkline="metricsStore.trends?.change_failure_rate"
      />
      <MetricCard
        v-if="metricsStore.mttr"
        title="Mean Time To Recovery"
        :value="formatDuration(metricsStore.mttr.avg_mttr)"
        label="Average recovery time"
        icon="pi pi-wrench"
        :performance="metricsStore.mttr.performance"
        :sparkline="metricsStore.trends?.mttr"
      />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.dashboard-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
}

.dashboard-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 4px 0 0;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 14px;
  padding: 3rem 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: rgba(255, 255, 255, 0.25);
}

.empty-icon {
  font-size: 2rem;
}
</style>
