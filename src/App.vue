<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { name: 'dashboard', label: 'All Posts' },
  { name: 'add-new', label: 'Add New' },
  { name: 'preview', label: 'Preview' },
]
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <h1 class="text-xl font-semibold">Article Dashboard</h1>
        <nav class="flex flex-wrap gap-2">
          <RouterLink
            v-for="link in links"
            :key="link.name"
            :to="{ name: link.name }"
            class="rounded-md px-3 py-2 text-sm font-medium transition"
            :class="route.name === link.name
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <RouterView />
    </main>
  </div>
</template>
