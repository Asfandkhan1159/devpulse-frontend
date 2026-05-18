<script setup lang="ts">
import { useMetricsStore } from '@/stores/metrics'
import MetricCard from '@/components/metrics/MetricCard.vue'
import { useMetrics } from '@/composables/useMetrics'
const metricsStore = useMetricsStore()

const { projectId, days, daysOptions, loadMetrics } = useMetrics()
</script>

<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <div>
        <h1 class="dashboard-title">DORA Metrics</h1>
        <p class="dashboard-subtitle">Developer performance intelligence</p>
      </div>
      <div class="filter-bar">
        <InputNumber v-model="projectId" placeholder="Project ID" :min="1" class="filter-input" />
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
      />
      <MetricCard
        v-if="metricsStore.leadTime"
        title="Lead Time"
        :value="metricsStore.leadTime.average_lead_time_hours + 'h'"
        label="Average lead time"
        icon="pi pi-clock"
        :performance="metricsStore.leadTime.performance"
      />
      <MetricCard
        v-if="metricsStore.changeFailureRate"
        title="Change Failure Rate"
        :value="metricsStore.changeFailureRate.failure_rate_percentage + '%'"
        label="Of deployments failed"
        icon="pi pi-exclamation-triangle"
        :performance="metricsStore.changeFailureRate.performance"
      />
      <MetricCard
        v-if="metricsStore.mttr"
        title="Mean Time To Recovery"
        :value="metricsStore.mttr.avg_mttr + 'h'"
        label="Average recovery time"
        icon="pi pi-wrench"
        :performance="metricsStore.mttr.performance"
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
  grid-template-columns: repeat(4, 1fr);
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
