<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleForm from '../components/ArticleForm.vue'
import { getArticle, updateArticle } from '../services/articles'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const submitting = ref(false)
const errorMessage = ref('')
const formValues = ref({
  title: '',
  content: '',
  category: '',
})

const articleId = route.params.id

const loadArticle = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const article = await getArticle(articleId)
    formValues.value = {
      title: article?.title ?? '',
      content: article?.content ?? '',
      category: article?.category ?? '',
    }
  } catch {
    errorMessage.value = 'Unable to load article details.'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async (payload) => {
  submitting.value = true
  errorMessage.value = ''

  try {
    await updateArticle(articleId, payload)
    router.push({ name: 'dashboard' })
  } catch {
    errorMessage.value = 'Unable to update article. Please try again.'
  } finally {
    submitting.value = false
  }
}

onMounted(loadArticle)
</script>

<template>
  <div class="space-y-4">
    <p v-if="errorMessage" class="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {{ errorMessage }}
    </p>

    <div v-if="loading" class="rounded-lg border border-slate-200 bg-white px-4 py-6 text-sm text-slate-600">
      Loading article...
    </div>

    <ArticleForm
      v-else
      title="Edit Article"
      :initial-values="formValues"
      :submitting="submitting"
      @submit="handleSubmit"
    />
  </div>
</template>
