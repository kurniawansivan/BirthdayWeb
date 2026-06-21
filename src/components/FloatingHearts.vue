<script setup>
import { ref, onMounted } from 'vue'

const hearts = ref([])
const emojis = ['❤️', '💕', '💖', '💗', '💝', '🌸', '✨', '💫', '🦋', '🌺']

onMounted(() => {
  for (let i = 0; i < 12; i++) {
    hearts.value.push({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: Math.random() * 100,
      size: 14 + Math.random() * 16,
      duration: 6 + Math.random() * 10,
      delay: Math.random() * 8,
    })
  }
})
</script>

<template>
  <div class="hearts-bg">
    <span
      v-for="h in hearts"
      :key="h.id"
      class="heart-float"
      :style="{
        left: h.left + '%',
        fontSize: h.size + 'px',
        animationDuration: h.duration + 's',
        animationDelay: h.delay + 's',
      }"
    >{{ h.emoji }}</span>
  </div>
</template>
