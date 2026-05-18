<template>
  <div class="metric-card" :style="{ borderLeftColor: accentColor }">
    <div class="metric-header">
      <i :class="props.icon" class="metric-icon" />
      <span class="metric-title">{{ props.title }}</span>
      <span class="metric-badge" :style="{ background: badgeBg, color: badgeColor }">
        {{ performanceLabel }}
      </span>
    </div>
    <div class="metric-value">{{ props.value }}</div>
    <div class="metric-label">{{ props.label }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: number | string
  label: string
  icon: string
  performance?: 'elite' | 'high' | 'medium' | 'low'
}>()

const performanceLabel = computed(() => {
  switch (props.performance) {
    case 'elite':
      return 'Elite'
    case 'high':
      return 'High'
    case 'medium':
      return 'Medium'
    case 'low':
      return 'Low'
    default:
      return '—'
  }
})

const accentColor = computed(() => {
  switch (props.performance) {
    case 'elite':
      return '#1D9E75'
    case 'high':
      return '#378ADD'
    case 'medium':
      return '#BA7517'
    case 'low':
      return '#E24B4A'
    default:
      return '#888780'
  }
})

const badgeBg = computed(() => {
  switch (props.performance) {
    case 'elite':
      return 'rgba(29,158,117,0.15)'
    case 'high':
      return 'rgba(55,138,221,0.15)'
    case 'medium':
      return 'rgba(186,117,23,0.15)'
    case 'low':
      return 'rgba(226,75,74,0.15)'
    default:
      return 'rgba(136,135,128,0.15)'
  }
})

const badgeColor = computed(() => {
  switch (props.performance) {
    case 'elite':
      return '#1D9E75'
    case 'high':
      return '#378ADD'
    case 'medium':
      return '#BA7517'
    case 'low':
      return '#E24B4A'
    default:
      return '#888780'
  }
})
</script>

<style scoped>
.metric-card {
  background: #111318;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 3px solid #888780;
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: border-color 0.2s;
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metric-icon {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}

.metric-title {
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  flex: 1;
}

.metric-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.metric-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  letter-spacing: -0.02em;
}

.metric-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}
</style>
