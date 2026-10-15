<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- Navbar -->
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <router-link to="/" class="text-lg font-bold text-gray-800 tracking-tight">
            Article CMS
          </router-link>
          <div class="flex items-center gap-1">
            <router-link 
              to="/" 
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.path === '/' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/add" 
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.path === '/add' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'"
            >
              Add New
            </router-link>
            <router-link 
              to="/preview" 
              class="px-3 py-2 rounded-md text-sm font-medium transition-colors"
              :class="$route.path === '/preview' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'"
            >
              Preview
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <router-view></router-view>
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200 bg-white">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <p class="text-center text-sm text-gray-400">Sharing Vision — Article Management System</p>
      </div>
    </footer>
  </div>
</template>