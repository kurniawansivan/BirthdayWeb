<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = import.meta.env.VITE_PARTNER_NAME
const age = import.meta.env.VITE_PARTNER_AGE

const phase = ref(0) // 0=loading, 1=reveal, 2=ready

onMounted(() => {
  setTimeout(() => { phase.value = 1 }, 800)
  setTimeout(() => { phase.value = 2 }, 2500)
})

function enter() {
  router.push('/home')
}
</script>

<template>
  <div class="splash">
    <!-- Background decorations -->
    <div class="splash-bg">
      <div class="circle c1"></div>
      <div class="circle c2"></div>
      <div class="circle c3"></div>
    </div>

    <!-- Phase 0: Loading pulse -->
    <Transition name="fade">
      <div v-if="phase === 0" class="loading-heart">
        <div class="big-heart pulse">❤️</div>
      </div>
    </Transition>

    <!-- Phase 1+: Main content -->
    <Transition name="bounce-in">
      <div v-if="phase >= 1" class="splash-content">
        <div class="ornament-top">
          <span>🌸</span><span>✨</span><span>💕</span><span>✨</span><span>🌸</span>
        </div>

        <div class="cake-emoji">🎂</div>

        <h1 class="title-main text-script">
          Selamat<br/>Ulang Tahun
        </h1>

        <div class="name-badge">
          <span class="sparkle" style="animation-delay:0s">✨</span>
          <span class="partner-name">{{ name }}</span>
          <span class="sparkle" style="animation-delay:0.5s">✨</span>
        </div>

        <div class="age-display">
          <span class="age-number">{{ age }}</span>
          <span class="age-label">tahun</span>
        </div>

        <div class="hearts-row">
          <span v-for="i in 5" :key="i" :style="{animationDelay: (i*0.15)+'s'}" class="h-item">💖</span>
        </div>

        <Transition name="slide-up">
          <div v-if="phase === 2" class="enter-section">
            <p class="subtitle">Ada kejutan spesial untukmu~ 🎁</p>
            <button class="btn-primary btn-enter" @click="enter">
              Buka Kejutanku 💝
            </button>
          </div>
        </Transition>

        <div class="ornament-bottom">
          <span>💫</span><span>🦋</span><span>🌺</span><span>🦋</span><span>💫</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.splash {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #FF9ADE 0%, #D4A5FF 40%, #9B8FFF 100%);
}

.splash-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.2;
}
.c1 {
  width: 300px; height: 300px;
  background: white;
  top: -100px; right: -80px;
}
.c2 {
  width: 200px; height: 200px;
  background: #FFD6EC;
  bottom: 50px; left: -60px;
}
.c3 {
  width: 150px; height: 150px;
  background: #E0AAFF;
  top: 40%; right: -40px;
}

.loading-heart {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.big-heart {
  font-size: 80px;
}

.splash-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 24px 100px;
  text-align: center;
}

.ornament-top, .ornament-bottom {
  display: flex;
  gap: 8px;
  font-size: 22px;
}

.cake-emoji {
  font-size: 72px;
  animation: bounce-in 0.8s ease 0.3s both;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
}

.title-main {
  font-size: 52px;
  line-height: 1.1;
  color: white;
  text-shadow: 0 2px 20px rgba(120, 0, 80, 0.3);
}

.name-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.85);
  border-radius: 50px;
  padding: 10px 24px;
  box-shadow: 0 4px 20px rgba(196,113,237,0.3);
}

.partner-name {
  font-family: var(--font-script);
  font-size: 32px;
  color: var(--hot-pink);
  font-weight: 700;
}

.age-display {
  display: flex;
  align-items: baseline;
  gap: 8px;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 50px;
  padding: 8px 24px;
}

.age-number {
  font-size: 48px;
  font-weight: 800;
  color: white;
  font-family: var(--font-script);
}

.age-label {
  font-size: 18px;
  color: rgba(255,255,255,0.9);
  font-weight: 600;
}

.hearts-row {
  display: flex;
  gap: 6px;
}
.h-item {
  font-size: 24px;
  animation: pulse-love 1.5s ease-in-out infinite;
}

.enter-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin-top: 8px;
}

.subtitle {
  color: rgba(255,255,255,0.9);
  font-size: 16px;
  font-weight: 600;
}

.btn-enter {
  font-size: 18px;
  padding: 16px 40px;
  box-shadow: 0 8px 30px rgba(80, 0, 80, 0.25);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.bounce-in-enter-active {
  animation: bounce-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

.slide-up-enter-active { animation: slide-up 0.6s ease forwards; }
</style>
