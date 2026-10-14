<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['change'])
</script>

<template>
  <div class="mb-4 flex flex-wrap gap-2">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      type="button"
      class="rounded-md px-4 py-2 text-sm font-medium transition"
      :class="activeTab === tab.value
        ? 'bg-slate-900 text-white'
        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
      @click="emit('change', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
