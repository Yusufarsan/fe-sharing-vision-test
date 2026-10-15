<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-800">All Posts</h1>
      <router-link 
        to="/add" 
        class="inline-flex items-center gap-1.5 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add New
      </router-link>
    </div>

    <!-- Tabs Navigation -->
    <div class="flex gap-1 border-b border-gray-200 mb-0">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="activeTab = tab.name"
        :class="[
          'py-2.5 px-4 text-sm font-medium outline-none transition-all duration-200 border-b-2 -mb-px',
          activeTab === tab.name 
            ? 'border-blue-600 text-blue-600' 
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]"
      >
        {{ tab.name }}
        <span 
          :class="[
            'ml-1.5 py-0.5 px-2 rounded-full text-xs font-medium',
            activeTab === tab.name 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-500'
          ]"
        >
          {{ getTabCount(tab.statusValue) }}
        </span>
      </button>
    </div>

    <!-- Data Table -->
    <div class="bg-white rounded-b-lg border border-t-0 border-gray-200 overflow-hidden">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
            <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-40">Category</th>
            <th class="py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-24">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="filteredArticles.length === 0">
            <td colspan="3" class="py-10 text-center text-gray-400 text-sm">
              No articles found in {{ activeTab }}.
            </td>
          </tr>
          <tr v-for="article in filteredArticles" :key="article.id" class="hover:bg-gray-50/50 transition">
            <td class="py-3 px-4 text-sm text-gray-800 font-medium">{{ article.title }}</td>
            <td class="py-3 px-4">
              <span class="text-xs font-medium bg-gray-100 text-gray-600 py-1 px-2.5 rounded-full">
                {{ article.category }}
              </span>
            </td>
            <td class="py-3 px-4 text-center">
              <div class="flex items-center justify-center gap-2">
                <!-- Ikon Edit -->
                <button @click="goToEdit(article.id)" class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition" title="Edit Article">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <!-- Ikon Trash -->
                <button 
                  v-if="article.status !== 'thrash'" 
                  @click="moveToTrash(article.id)" 
                  class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition" 
                  title="Move to Trash"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const articles = ref([]);

// Definisi Tabs dan pemetaan ke status backend
const tabs = ref([
  { name: 'Published', statusValue: 'publish' },
  { name: 'Drafts', statusValue: 'draft' },
  { name: 'Trashed', statusValue: 'thrash' }
]);
const activeTab = ref('Published');

// Mengambil data dari backend
const fetchArticles = async () => {
  try {
    // Memanggil API dengan limit besar (misal 100) agar semua data tertarik untuk dashboard
    const response = await api.get('/article/100/0');
    articles.value = response.data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
  }
};

// Computed property untuk memfilter tabel berdasarkan tab yang sedang aktif
const filteredArticles = computed(() => {
  const currentTab = tabs.value.find(t => t.name === activeTab.value);
  return articles.value.filter(article => article.status === currentTab.statusValue);
});

// Utility untuk menghitung jumlah artikel per tab
const getTabCount = (statusValue) => {
  return articles.value.filter(article => article.status === statusValue).length;
};

// Navigasi ke halaman Edit
const goToEdit = (id) => {
  router.push(`/edit/${id}`);
};

// Memanggil API DELETE (Soft Delete) dan merefresh tabel
const moveToTrash = async (id) => {
  if (!confirm('Move this article to trash?')) return;
  
  try {
    await api.delete(`/article/${id}`);
    await fetchArticles(); // Data ditarik ulang sehingga artikel langsung berpindah ke tab Trashed
  } catch (error) {
    console.error('Error moving article to trash:', error);
    alert('Failed to delete article.');
  }
};

// Siklus hidup komponen: ambil data saat halaman pertama kali dimuat
onMounted(() => {
  fetchArticles();
});
</script>