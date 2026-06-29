<script setup>
import { computed } from 'vue'
import { useScrollProgress, mapRange, easeOut } from '../composables/useScrollProgress.js'

const name = import.meta.env.VITE_PARTNER_NAME
const age  = import.meta.env.VITE_PARTNER_AGE

const wishes = [
  { emoji: '🌟', text: `Semoga di umur ${age} ini selalu sehat, bahagia, dan bersinar~`, color: '#FFD700', bg: '#FFFDE7' },
  { emoji: '✨', text: 'Semoga semua mimpi dan cita-citamu tercapai satu per satu~',    color: '#C471ED', bg: '#F3E5F5' },
  { emoji: '🌸', text: 'Semoga hari-harimu selalu dipenuhi tawa, kebaikan, dan cinta~', color: '#FF6B9D', bg: '#FFF0F8' },
  { emoji: '💫', text: 'Semoga kamu punya semangat untuk mengejar apapun yang kamu mau~', color: '#9B59B6', bg: '#EDE7F6' },
  { emoji: '❤️', text: 'Dan semoga kita selalu bersama, apapun yang terjadi~ 🥰',       color: '#FF1493', bg: '#FFF0F8' },
]

const { wrapperRef, progress: p } = useScrollProgress()

// Each wish gets ~0.17 of progress
function wishT(i) {
  return easeOut(mapRange(p.value, 0.06 + i * 0.17, 0.20 + i * 0.17, 0, 1))
}
function wishStyle(i) {
  const t = wishT(i)
  const fromLeft = i % 2 === 0
  return {
    opacity: t,
    transform: `translateX(${(1 - t) * (fromLeft ? -36 : 36)}px)`,
  }
}

const headerT = computed(() => mapRange(p.value, 0, 0.07, 0, 1))
const sectionOpacity = computed(() =>
  Math.min(mapRange(p.value, 0, 0.04, 0, 1), mapRange(p.value, 0.97, 1, 1, 0))
)
</script>

<template>
  <div class="wishes-wrapper" ref="wrapperRef">
    <div class="sticky-frame" :style="{ opacity: sectionOpacity }">

      <div class="w-header" :style="{ opacity: headerT, transform: `translateY(${(1-headerT)*20}px)` }">
        <h2 class="text-script">Doa Untukmu 🙏</h2>
        <p>Semoga semua kebaikan menyertaimu, {{ name }}~</p>
      </div>

      <div class="wishes-list">
        <div
          v-for="(w, i) in wishes"
          :key="i"
          class="wish-card"
          :style="[{ '--wbg': w.bg, '--wcol': w.color }, wishStyle(i)]"
        >
          <span class="w-emoji">{{ w.emoji }}</span>
          <p>{{ w.text }}</p>
        </div>
      </div>

      <!-- Balloons at bottom -->
      <div class="balloons" :style="{ opacity: mapRange(p.value, 0.88, 1, 0, 1) }">
        <span v-for="(e, i) in ['🎈','🎉','🎊','💝','🎈','🎉','🎊']" :key="i"
          :style="{ animationDelay: i*.12+'s', fontSize: (22+i%2*6)+'px' }">{{ e }}</span>
      </div>

    </div>
  </div>
</template>

<style scoped>
.wishes-wrapper {
  height: 340vh;
  position: relative;
}

.sticky-frame {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #FF9A9E 0%, #FFD1DC 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 52px 16px 24px;
  gap: 14px;
  border-radius: 40px 40px 0 0;
  will-change: opacity;
}

.w-header {
  text-align: center;
  will-change: opacity, transform;
  flex-shrink: 0;
}
.w-header h2 { font-size: 32px; color: white; margin-bottom: 4px; }
.w-header p  { color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600; }

.wishes-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  max-width: 380px;
  flex: 1;
  overflow: hidden;
}

.wish-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: var(--wbg);
  border-radius: 18px;
  padding: 14px 16px;
  box-shadow: 0 3px 14px rgba(0,0,0,0.07);
  border-left: 4px solid var(--wcol);
  will-change: opacity, transform;
  flex-shrink: 0;
}
.w-emoji { font-size: 30px; flex-shrink: 0; line-height: 1; }
.wish-card p { font-size: 14px; font-weight: 600; color: var(--dark); line-height: 1.55; }

.balloons {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-shrink: 0;
  will-change: opacity;
}
.balloons span {
  animation: float-deco 3s ease-in-out infinite;
  display: inline-block;
}
@keyframes float-deco {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style>
