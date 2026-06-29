<script setup>
import { onMounted, ref } from 'vue'
import confetti from 'canvas-confetti'

const name = import.meta.env.VITE_PARTNER_NAME
const age = import.meta.env.VITE_PARTNER_AGE
const birthdayDate = import.meta.env.VITE_BIRTHDAY_DATE
const specialPlace = import.meta.env.VITE_SPECIAL_PLACE

const loaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    loaded.value = true
    // Confetti burst saat hero muncul
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors: ['#FF6B9D','#C471ED','#FFD700','#FF9ADE','#fff'] })
    setTimeout(() => {
      confetti({ particleCount: 60, spread: 70, origin: { x: 0.1, y: 0.5 } })
      confetti({ particleCount: 60, spread: 70, origin: { x: 0.9, y: 0.5 } })
    }, 600)
  }, 400)
})

const decos = [
  { e: '🌸', top: '8%', left: '5%', size: 28, delay: 0 },
  { e: '✨', top: '12%', right: '8%', size: 22, delay: 0.3 },
  { e: '💕', top: '20%', left: '12%', size: 24, delay: 0.6 },
  { e: '🌺', top: '5%', right: '20%', size: 26, delay: 0.2 },
  { e: '💫', bottom: '30%', left: '8%', size: 20, delay: 0.8 },
  { e: '🎀', bottom: '28%', right: '6%', size: 26, delay: 0.4 },
  { e: '🌸', bottom: '22%', left: '20%', size: 18, delay: 1.0 },
  { e: '✨', bottom: '35%', right: '18%', size: 16, delay: 0.7 },
]
</script>

<template>
  <section class="hero">
    <!-- Floating deco -->
    <span
      v-for="(d, i) in decos"
      :key="i"
      class="deco"
      :style="{
        top: d.top, left: d.left, right: d.right, bottom: d.bottom,
        fontSize: d.size + 'px',
        animationDelay: d.delay + 's',
        opacity: loaded ? 1 : 0,
        transition: `opacity 0.5s ease ${d.delay + 0.4}s`
      }"
    >{{ d.e }}</span>

    <!-- BG circles -->
    <div class="bg-circle bc1"></div>
    <div class="bg-circle bc2"></div>
    <div class="bg-circle bc3"></div>

    <!-- Main content -->
    <div class="hero-body" :class="{ loaded }">
      <div class="top-badge">🎉 Hari Spesialmu! 🎉</div>

      <div class="cake">🎂</div>

      <h1 class="title text-script">
        Selamat<br/>Ulang Tahun
      </h1>

      <div class="name-pill">
        <span class="sparkle" style="animation-delay:0s">✨</span>
        <span class="name-text">{{ name }}</span>
        <span class="sparkle" style="animation-delay:0.6s">✨</span>
      </div>

      <div class="age-ring">
        <span class="age-num text-script">{{ age }}</span>
        <span class="age-suffix">tahun</span>
      </div>

      <div class="meta-row">
        <span>📅 {{ birthdayDate }}</span>
        <span class="dot">·</span>
        <span>📍 {{ specialPlace }}</span>
      </div>

      <div class="hearts-line">
        <span v-for="i in 5" :key="i" :style="{ animationDelay: (i*0.18) + 's' }">💖</span>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="scroll-hint" :class="{ loaded }">
      <span>scroll ke bawah</span>
      <div class="arrow-bounce">↓</div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  background: linear-gradient(160deg, #FF9ADE 0%, #D4A5FF 45%, #9B8FFF 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 48px 24px 80px;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
}
.bc1 { width: 320px; height: 320px; background: rgba(255,255,255,0.12); top: -120px; right: -80px; }
.bc2 { width: 180px; height: 180px; background: rgba(255,200,230,0.18); bottom: 60px; left: -50px; }
.bc3 { width: 120px; height: 120px; background: rgba(220,180,255,0.2); top: 35%; right: -30px; }

.deco {
  position: absolute;
  pointer-events: none;
  animation: float-deco 4s ease-in-out infinite;
}
@keyframes float-deco {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(8deg); }
}

.hero-body {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.9s cubic-bezier(0.175, 0.885, 0.32, 1.1);
}
.hero-body.loaded { opacity: 1; transform: translateY(0); }

.top-badge {
  background: rgba(255,255,255,0.28);
  border: 1px solid rgba(255,255,255,0.45);
  color: white;
  border-radius: 50px;
  padding: 6px 20px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.cake {
  font-size: 80px;
  line-height: 1;
  filter: drop-shadow(0 6px 16px rgba(0,0,0,0.15));
  animation: pulse-love 2s ease-in-out infinite;
}

.title {
  font-size: 54px;
  line-height: 1.1;
  color: white;
  text-shadow: 0 3px 20px rgba(80,0,100,0.25);
}

.name-pill {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.88);
  border-radius: 50px;
  padding: 10px 24px;
  box-shadow: 0 6px 24px rgba(150,60,200,0.25);
}
.name-text {
  font-family: var(--font-script);
  font-size: 34px;
  font-weight: 700;
  color: var(--hot-pink);
}

.age-ring {
  display: flex;
  align-items: baseline;
  gap: 6px;
  background: rgba(255,255,255,0.2);
  border: 2px solid rgba(255,255,255,0.5);
  border-radius: 50px;
  padding: 8px 28px;
}
.age-num { font-size: 52px; color: white; line-height: 1; }
.age-suffix { font-size: 18px; color: rgba(255,255,255,0.88); font-weight: 600; }

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255,255,255,0.88);
  font-size: 14px;
  font-weight: 600;
}
.dot { font-size: 18px; }

.hearts-line {
  display: flex;
  gap: 6px;
  font-size: 22px;
}
.hearts-line span { animation: pulse-love 1.5s ease-in-out infinite; }

.scroll-hint {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: rgba(255,255,255,0.7);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  opacity: 0;
  transition: opacity 1s ease 1.5s;
}
.scroll-hint.loaded { opacity: 1; }

.arrow-bounce {
  font-size: 20px;
  animation: bounce-arrow 1.2s ease-in-out infinite;
}
@keyframes bounce-arrow {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}
</style>
