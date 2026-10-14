<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  articles: {
    type: Array,
    default: () => [],
  },
  showTrashAction: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['trash'])
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-slate-200 bg-white">
    <table class="min-w-full divide-y divide-slate-200 text-left text-sm">
      <thead class="bg-slate-50 text-xs uppercase tracking-wider text-slate-600">
        <tr>
          <th class="px-4 py-3">Title</th>
          <th class="px-4 py-3">Category</th>
          <th class="px-4 py-3">Action</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200">
        <tr v-for="article in articles" :key="article.id">
          <td class="px-4 py-3 font-medium text-slate-800">{{ article.title }}</td>
          <td class="px-4 py-3 text-slate-700">{{ article.category || '-' }}</td>
          <td class="px-4 py-3">
            <div class="flex items-center gap-3">
              <RouterLink
                :to="{ name: 'edit-article', params: { id: article.id } }"
                class="rounded p-1 text-indigo-600 transition hover:bg-indigo-50"
                title="Edit"
                aria-label="Edit"
              >
                ✏️
              </RouterLink>
              <button
                v-if="showTrashAction"
                type="button"
                class="rounded p-1 text-rose-600 transition hover:bg-rose-50"
                title="Trash"
                aria-label="Trash"
                @click="emit('trash', article)"
              >
                🗑️
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="articles.length === 0">
          <td class="px-4 py-6 text-center text-slate-500" colspan="3">No articles found.</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
