<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  initialValues: {
    type: Object,
    default: () => ({
      title: '',
      content: '',
      category: '',
    }),
  },
  submitting: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit'])

const form = reactive({
  title: '',
  content: '',
  category: '',
})

const errors = reactive({
  title: '',
  content: '',
  category: '',
})

const applyValues = (values) => {
  form.title = values?.title ?? ''
  form.content = values?.content ?? ''
  form.category = values?.category ?? ''
}

watch(
  () => props.initialValues,
  (values) => {
    applyValues(values)
  },
  { immediate: true, deep: true },
)

const validate = () => {
  errors.title = form.title.trim() ? '' : 'Title is required.'
  errors.content = form.content.trim() ? '' : 'Content is required.'
  errors.category = form.category.trim() ? '' : 'Category is required.'

  return !errors.title && !errors.content && !errors.category
}

const submitWithStatus = (status) => {
  if (!validate()) return

  emit('submit', {
    title: form.title.trim(),
    content: form.content.trim(),
    category: form.category.trim(),
    status,
  })
}
</script>

<template>
  <section class="rounded-lg border border-slate-200 bg-white p-6">
    <h2 class="mb-6 text-2xl font-semibold">{{ title }}</h2>
    <form class="space-y-4" @submit.prevent>
      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700" for="title">Title</label>
        <input
          id="title"
          v-model="form.title"
          type="text"
          class="w-full rounded-md border px-3 py-2 outline-none ring-0 transition focus:border-indigo-500"
          :class="errors.title ? 'border-rose-500' : 'border-slate-300'"
        />
        <p v-if="errors.title" class="mt-1 text-xs text-rose-600">{{ errors.title }}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700" for="category">Category</label>
        <input
          id="category"
          v-model="form.category"
          type="text"
          class="w-full rounded-md border px-3 py-2 outline-none ring-0 transition focus:border-indigo-500"
          :class="errors.category ? 'border-rose-500' : 'border-slate-300'"
        />
        <p v-if="errors.category" class="mt-1 text-xs text-rose-600">{{ errors.category }}</p>
      </div>

      <div>
        <label class="mb-1 block text-sm font-medium text-slate-700" for="content">Content</label>
        <textarea
          id="content"
          v-model="form.content"
          rows="7"
          class="w-full rounded-md border px-3 py-2 outline-none ring-0 transition focus:border-indigo-500"
          :class="errors.content ? 'border-rose-500' : 'border-slate-300'"
        />
        <p v-if="errors.content" class="mt-1 text-xs text-rose-600">{{ errors.content }}</p>
      </div>

      <div class="flex flex-wrap gap-3 pt-2">
        <button
          type="button"
          class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="submitting"
          @click="submitWithStatus('published')"
        >
          Publish
        </button>
        <button
          type="button"
          class="rounded-md bg-slate-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="submitting"
          @click="submitWithStatus('draft')"
        >
          Draft
        </button>
      </div>
    </form>
  </section>
</template>
