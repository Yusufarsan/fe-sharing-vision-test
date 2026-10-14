<script setup>
import { computed, onMounted, ref } from 'vue'
import { listArticles } from '../services/articles'

const limit = 5
const currentPage = ref(1)
const total = ref(0)
const articles = ref([])
const loading = ref(false)
const errorMessage = ref('')

const pageCount = computed(() => Math.max(1, Math.ceil(total.value / limit)))

const loadPage = async (page) => {
  loading.value = true
  errorMessage.value = ''

  try {
    const offset = (page - 1) * limit
    const response = await listArticles({
      status: 'published',
      limit,
      offset,
    })

    articles.value = response.items
    total.value = Number.isFinite(response.total) ? response.total : offset + response.items.length
    currentPage.value = page
  } catch {
    errorMessage.value = 'Unable to load preview feed.'
  } finally {
    loading.value = false
  }
}

const goToPage = async (page) => {
  if (page < 1 || page > pageCount.value || loading.value) return
  await loadPage(page)
}

onMounted(() => {
  loadPage(1)
})
</script>

<template>
  <section class="space-y-6">
    <div>
      <h2 class="text-2xl font-semibold">Preview</h2>
      <p class="text-sm text-slate-600">Blog feed for published articles only.</p>
    </div>

    <p v-if="errorMessage" class="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {{ errorMessage }}
    </p>

    <div v-if="loading" class="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
      Loading preview...
    </div>

    <div v-else class="space-y-4">
      <article
        v-for="article in articles"
        :key="article.id"
        class="rounded-lg border border-slate-200 bg-white p-5"
      >
        <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">{{ article.category }}</p>
        <h3 class="mb-2 text-xl font-semibold">{{ article.title }}</h3>
        <p class="text-sm leading-6 text-slate-700">{{ article.content }}</p>
      </article>

      <p v-if="articles.length === 0" class="rounded-lg border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-600">
        No published articles found.
      </p>
    </div>

    <div class="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
      <button
        type="button"
        class="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="currentPage <= 1 || loading"
        @click="goToPage(currentPage - 1)"
      >
        Previous
      </button>
      <p class="text-sm text-slate-600">Page {{ currentPage }} of {{ pageCount }}</p>
      <button
        type="button"
        class="rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
        :disabled="currentPage >= pageCount || loading"
        @click="goToPage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </section>
</template>
