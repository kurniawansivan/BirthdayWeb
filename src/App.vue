<script setup>
import { ref, onMounted } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import BottomNav from './components/BottomNav.vue'
import FloatingHearts from './components/FloatingHearts.vue'

const route = useRoute()
const showNav = ref(false)

onMounted(() => {
  setTimeout(() => { showNav.value = true }, 3000)
})
</script>

<template>
  <div class="app-container">
    <FloatingHearts />
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" @showNav="showNav = true" />
      </Transition>
    </RouterView>
    <BottomNav v-if="showNav && route.path !== '/'" />
  </div>
</template>
