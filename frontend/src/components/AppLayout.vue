<template>
  <div class="app-shell">
    <SideBar />
    <div class="main-content">
      <!-- Topbar -->
      <header class="topbar">
        <span class="topbar-title">{{ title }}</span>
        <div class="topbar-actions">
          <slot name="actions" />
        </div>
      </header>
      <!-- Body -->
      <main class="page-body">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import SideBar from './SideBar.vue'
defineProps({ title: { type: String, default: '' } })
</script>
