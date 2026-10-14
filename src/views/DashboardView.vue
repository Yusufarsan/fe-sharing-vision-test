<script setup>
import { onMounted, ref } from 'vue'
import ArticleTable from '../components/ArticleTable.vue'
import Tabs from '../components/Tabs.vue'
import { listArticles, trashArticle } from '../services/articles'

const tabs = [
  { label: 'Published', value: 'published' },
  { label: 'Drafts', value: 'draft' },
  { label: 'Trashed', value: 'trashed' },
]

const activeTab = ref('published')
const loading = ref(false)
const errorMessage = ref('')

const articlesByStatus = ref({
  published: [],
  draft: [],
  trashed: [],
})

const fetchStatus = async (status) => {
  const response = await listArticles({ status })
  articlesByStatus.value[status] = response.items
}

const loadArticles = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    await Promise.all(tabs.map((tab) => fetchStatus(tab.value)))
  } catch {
    errorMessage.value = 'Unable to load articles. Please try again.'
  } finally {
    loading.value = false
  }
}

const moveToTrash = async (article) => {
  errorMessage.value = ''

  try {
    await trashArticle(article.id)

    for (const tab of ['published', 'draft']) {
      articlesByStatus.value[tab] = articlesByStatus.value[tab].filter((item) => item.id !== article.id)
    }

    const alreadyInTrash = articlesByStatus.value.trashed.some((item) => item.id === article.id)
    if (!alreadyInTrash) {
      articlesByStatus.value.trashed.unshift({
        ...article,
        status: 'trashed',
      })
    }

    if (activeTab.value !== 'trashed') {
      await fetchStatus(activeTab.value)
    }
  } catch {
    errorMessage.value = 'Unable to move article to trash.'
  }
}

onMounted(loadArticles)
</script>

<template>
  <section class="space-y-4">
    <div>
      <h2 class="text-2xl font-semibold">All Posts</h2>
      <p class="text-sm text-slate-600">Manage published, draft, and trashed articles.</p>
    </div>

    <Tabs :tabs="tabs" :active-tab="activeTab" @change="activeTab = $event" />

    <p v-if="errorMessage" class="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {{ errorMessage }}
    </p>

    <div v-if="loading" class="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
      Loading articles...
    </div>

    <ArticleTable
      v-else
      :articles="articlesByStatus[activeTab]"
      :show-trash-action="activeTab !== 'trashed'"
      @trash="moveToTrash"
    />
  </section>
</template>
