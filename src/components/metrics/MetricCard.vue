<template>
  <Card>
    <template #title>
      <div class="flex items-center gap-2">
        <i :class="props.icon" />
        <span>{{ props.title }}</span>
      </div>
    </template>
    <template #content>
      <p class="text-4xl font-bold">{{ props.value }}</p>
      <p class="text-sm text-gray-400">{{ props.label }}</p>
    </template>
  </Card>
</template>
<script setup lang="ts">
const props = defineProps<{
  title: string
  value: number | string
  label: string
  icon: string
}>()
</script>
