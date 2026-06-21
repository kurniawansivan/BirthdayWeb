<script setup>
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const route = useRoute()
const navItems = [
  { path: '/home', icon: '🏠', label: 'Beranda' },
  { path: '/galeri', icon: '📷', label: 'Galeri' },
  { path: '/kuis', icon: '💡', label: 'Kuis' },
  { path: '/game', icon: '🎮', label: 'Game' },
  { path: '/surat', icon: '💌', label: 'Surat' },
]
</script>

<template>
  <nav class="bottom-nav">
    <RouterLink
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="nav-item"
      :class="{ active: route.path === item.path }"
    >
      <span class="icon">{{ item.icon }}</span>
      <span>{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>
