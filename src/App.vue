<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <nav class="bg-blue-600 text-white p-4 shadow-md">
      <div class="container mx-auto flex gap-6 font-semibold">
        <router-link to="/" class="hover:text-blue-200">Dashboard</router-link>
        <router-link to="/add" class="hover:text-blue-200">Add New</router-link>
        <router-link to="/preview" class="hover:text-blue-200">Preview</router-link>
      </div>
    </nav>
    <main class="flex-grow container mx-auto p-4">
      <router-view></router-view>
    </main>
  </div>
</template>