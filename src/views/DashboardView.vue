<script setup lang="ts">
import { useMetricsStore } from '@/stores/metrics'
import MetricCard from '@/components/metrics/MetricCard.vue'
import { useMetrics } from '@/composables/useMetrics'
const metricsStore = useMetricsStore()

const { projectId, days, daysOptions, loadMetrics } = useMetrics()
</script>

<template>
  <div class="p-8 flex flex-col gap-8">
    <!-- Filters -->
    <div class="flex items-center gap-4">
      <InputNumber v-model="projectId" placeholder="Project ID" :min="1" />
      <Select
        v-model="days"
        :options="daysOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Select period"
      />
      <Button label="Load Metrics" icon="pi pi-refresh" @click="loadMetrics" />
    </div>

    <!-- Error -->
    <Message v-if="metricsStore.error" severity="error">
      {{ metricsStore.error }}
    </Message>

    <!-- Loading -->
    <div v-if="metricsStore.loading" class="flex justify-center">
      <ProgressSpinner />
    </div>

    <div v-else-if="!metricsStore.hasFetched" class="flex justify-center">
      <Message> Click on load button to fetch fresh data </Message>
    </div>

    <!-- Metric Cards -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        v-if="metricsStore.deploymentFrequency"
        title="Deployment Frequency"
        :value="metricsStore.deploymentFrequency.total_deployments"
        :label="metricsStore.deploymentFrequency.frequency_label"
        icon="pi pi-cloud-upload"
      />
      <MetricCard
        v-if="metricsStore.leadTime"
        title="Lead Time"
        :value="metricsStore.leadTime.average_lead_time_hours + 'h'"
        label="Average lead time"
        icon="pi pi-clock"
      />
      <MetricCard
        v-if="metricsStore.changeFailureRate"
        title="Change Failure Rate"
        :value="metricsStore.changeFailureRate.failure_rate_percentage + '%'"
        label="Of deployments failed"
        icon="pi pi-exclamation-triangle"
      />
      <MetricCard
        v-if="metricsStore.mttr"
        title="Mean Time To Recovery"
        :value="metricsStore.mttr.avg_mttr + 'h'"
        label="Average recovery time"
        icon="pi pi-wrench"
      />
    </div>
  </div>
</template>
