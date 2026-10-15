<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-800">Blog Preview</h1>
      <router-link to="/" class="text-sm text-gray-500 hover:text-gray-700 transition font-medium">
        &larr; Back to Dashboard
      </router-link>
    </div>

    <!-- State Loading -->
    <div v-if="isLoading" class="py-12 text-center text-gray-400 text-sm">
      Loading published articles...
    </div>

    <div v-else>
      <!-- State Kosong -->
      <div v-if="publishedArticles.length === 0" class="py-12 text-center text-gray-400 bg-white rounded-lg border border-gray-200 text-sm">
        No published articles available at the moment.
      </div>

      <!-- Feed Artikel -->
      <div class="space-y-4">
        <article 
          v-for="article in paginatedArticles" 
          :key="article.id" 
          class="bg-white p-5 rounded-lg border border-gray-200 hover:border-gray-300 transition"
        >
          <div class="flex items-center gap-2.5 mb-3">
            <span class="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {{ article.category }}
            </span>
            <span class="text-xs text-gray-400">
              {{ formatDate(article.created_date) }}
            </span>
          </div>
          <h2 class="text-lg font-semibold text-gray-800 mb-2">{{ article.title }}</h2>
          <!-- whitespace-pre-line menjaga format paragraf -->
          <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {{ article.content }}
          </p>
        </article>
      </div>

      <!-- Pagination Controls -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-4">
        <button 
          @click="prevPage" 
          :disabled="currentPage === 1"
          class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <span class="text-sm text-gray-500">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button 
          @click="nextPage" 
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-600 hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const isLoading = ref(true);
const articles = ref([]);

// State Pagination
const currentPage = ref(1);
const itemsPerPage = 3; // Menampilkan 3 artikel per halaman

// Fetch data dari backend (mengambil banyak data sekaligus untuk difilter di sisi klien)
const fetchArticles = async () => {
  try {
    const response = await api.get('/article/100/0');
    articles.value = response.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchArticles();
});

// 1. Filter hanya artikel yang statusnya "publish"
const publishedArticles = computed(() => {
  return articles.value.filter(article => article.status === 'publish');
});

// 2. Hitung total halaman berdasarkan artikel yang ter-publish
const totalPages = computed(() => {
  return Math.ceil(publishedArticles.value.length / itemsPerPage);
});

// 3. Potong array artikel (slice) sesuai halaman yang sedang aktif
const paginatedArticles = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return publishedArticles.value.slice(startIndex, endIndex);
});

// Navigasi Pagination
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Utility untuk memformat tanggal (opsional, membuat tampilan lebih rapi)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};
</script>