<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ArticleForm from '../components/ArticleForm.vue'
import { createArticle } from '../services/articles'

const router = useRouter()
const submitting = ref(false)
const errorMessage = ref('')

const handleSubmit = async (payload) => {
  submitting.value = true
  errorMessage.value = ''

  try {
    await createArticle(payload)
    router.push({ name: 'dashboard' })
  } catch {
    errorMessage.value = 'Unable to create article. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <div class="space-y-4">
    <p v-if="errorMessage" class="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">
      {{ errorMessage }}
    </p>
    <ArticleForm title="Add New Article" :submitting="submitting" @submit="handleSubmit" />
  </div>
</template>
