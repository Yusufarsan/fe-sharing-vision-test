<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-800">Edit Article</h1>
      <button @click="$router.push('/')" class="text-sm text-gray-500 hover:text-gray-700 transition font-medium">
        &larr; Back to Dashboard
      </button>
    </div>

    <!-- State Loading saat data sedang ditarik dari API -->
    <div v-if="isLoading" class="py-12 text-center text-gray-400 text-sm">
      Loading article data...
    </div>

    <div v-else>
      <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
        <p class="font-semibold text-sm mb-1">Error</p>
        <p class="whitespace-pre-line text-sm">{{ errorMessage }}</p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <form @submit.prevent>
          <div class="mb-5">
            <label class="block text-sm text-gray-700 font-medium mb-1.5">Title</label>
            <input 
              v-model="form.title" 
              type="text" 
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
              required
            >
            <div class="mt-1.5 flex justify-between text-xs">
              <span class="text-gray-400">Minimum 20 characters</span>
              <span :class="form.title.length < 20 ? 'text-red-500' : 'text-green-600'" class="font-medium">
                {{ form.title.length }} / 20
              </span>
            </div>
          </div>

          <div class="mb-5">
            <label class="block text-sm text-gray-700 font-medium mb-1.5">Category</label>
            <input 
              v-model="form.category" 
              type="text" 
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" 
              required
            >
          </div>

          <div class="mb-6">
            <label class="block text-sm text-gray-700 font-medium mb-1.5">Content</label>
            <textarea 
              v-model="form.content" 
              rows="8" 
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y" 
              required
            ></textarea>
            <div class="mt-1.5 flex justify-between text-xs">
              <span class="text-gray-400">Minimum 200 characters</span>
              <span :class="form.content.length < 200 ? 'text-red-500' : 'text-green-600'" class="font-medium">
                {{ form.content.length }} / 200
              </span>
            </div>
          </div>

          <div class="flex gap-3 pt-2 border-t border-gray-100">
            <!-- Update status menggunakan PUT request -->
            <button 
              @click="updateArticle('publish')" 
              :disabled="isSubmitting"
              class="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300 shadow-sm"
            >
              Update &amp; Publish
            </button>
            <button 
              @click="updateArticle('draft')" 
              :disabled="isSubmitting"
              class="bg-white text-gray-700 text-sm border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50 transition font-medium disabled:bg-gray-50"
            >
              Update as Draft
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const route = useRoute(); // Digunakan untuk mengambil ID dari parameter URL

// Mengambil ID artikel dari path: /edit/:id
const articleId = route.params.id; 

const isSubmitting = ref(false);
const isLoading = ref(true);
const errorMessage = ref('');

const form = reactive({
  title: '',
  content: '',
  category: ''
});

// Menarik data artikel yang ada dari backend
const fetchArticle = async () => {
  try {
    const response = await api.get(`/article/${articleId}`);
    // Mengisi data ke dalam form reaktif
    form.title = response.data.title;
    form.content = response.data.content;
    form.category = response.data.category;
  } catch (error) {
    console.error('Error fetching article:', error);
    errorMessage.value = 'Failed to load article data. It might have been deleted.';
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle hook: Eksekusi penarikan data saat komponen dimuat
onMounted(() => {
  fetchArticle();
});

// Mengirim update data ke backend
const updateArticle = async (status) => {
  if (isSubmitting.value) return;
  
  errorMessage.value = ''; 
  isSubmitting.value = true;

  try {
    // Menggunakan method PUT untuk pembaruan data
    await api.put(`/article/${articleId}`, {
      title: form.title,
      content: form.content,
      category: form.category,
      status: status
    });
    
    router.push('/');
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage.value = error.response.data.error;
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>