<template>
  <div class="max-w-2xl mx-auto">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-800">Add New Article</h1>
      <button @click="$router.push('/')" class="text-sm text-gray-500 hover:text-gray-700 transition font-medium">
        &larr; Back to Dashboard
      </button>
    </div>

    <!-- Kotak Pesan Error (Ditampilkan jika validasi backend gagal) -->
    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
      <p class="font-semibold text-sm mb-1">Validation Error</p>
      <!-- whitespace-pre-line membuat karakter \n dari Gin berubah menjadi baris baru di HTML -->
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
            placeholder="Enter article title..." 
            required
          >
          <!-- Indikator panjang karakter -->
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
            placeholder="E.g., Technology, Lifestyle" 
            required
          >
        </div>

        <div class="mb-6">
          <label class="block text-sm text-gray-700 font-medium mb-1.5">Content</label>
          <textarea 
            v-model="form.content" 
            rows="8" 
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-y" 
            placeholder="Write your article content here..." 
            required
          ></textarea>
          <!-- Indikator panjang karakter -->
          <div class="mt-1.5 flex justify-between text-xs">
            <span class="text-gray-400">Minimum 200 characters</span>
            <span :class="form.content.length < 200 ? 'text-red-500' : 'text-green-600'" class="font-medium">
              {{ form.content.length }} / 200
            </span>
          </div>
        </div>

        <div class="flex gap-3 pt-2 border-t border-gray-100">
          <!-- Dua tombol mengirimkan parameter status yang berbeda ke fungsi submit -->
          <button 
            @click="submitArticle('publish')" 
            :disabled="isSubmitting"
            class="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300 shadow-sm"
          >
            Publish
          </button>
          <button 
            @click="submitArticle('draft')" 
            :disabled="isSubmitting"
            class="bg-white text-gray-700 text-sm border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50 transition font-medium disabled:bg-gray-50"
          >
            Save as Draft
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const isSubmitting = ref(false);
const errorMessage = ref('');

// Data formulir reaktif
const form = reactive({
  title: '',
  content: '',
  category: ''
});

// Fungsi submit menerima 'status' dari tombol yang diklik
const submitArticle = async (status) => {
  // Cegah submit ganda
  if (isSubmitting.value) return;
  
  errorMessage.value = ''; 
  isSubmitting.value = true;

  try {
    // Memanggil API backend
    await api.post('/article/', {
      title: form.title,
      content: form.content,
      category: form.category,
      status: status
    });
    
    // Jika sukses, kembali ke Dashboard
    router.push('/');
  } catch (error) {
    // Menangkap validasi strict dari backend (400 Bad Request)
    if (error.response && error.response.data && error.response.data.errors) {
      errorMessage.value = error.response.data.errors
        .map(e => `* ${e.message}`)
        .join('\n');
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.';
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>