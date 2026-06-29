<script setup>
import { computed } from 'vue'
import { useScrollProgress, mapRange, easeOut } from '../composables/useScrollProgress.js'

const yourName = import.meta.env.VITE_YOUR_NAME
const startDate = import.meta.env.VITE_RELATIONSHIP_START_DATE
const specialPlace = import.meta.env.VITE_SPECIAL_PLACE
const name = import.meta.env.VITE_PARTNER_NAME

const daysTogether = Math.max(0, Math.floor((new Date() - new Date(startDate)) / 86400000))

const events = [
  { emoji: '💫', title: 'Pertama Kali Ketemu', desc: 'Hari itu dunia terasa berbeda. Kamu muncul dan semuanya berubah~', color: '#FF9ADE' },
  { emoji: '📱', title: 'Pertama Chat', desc: 'Deg-degan nunggu balasan. Tiap notif bikin senyum sendiri~', color: '#C471ED' },
  { emoji: '🌟', title: 'Jadian!', desc: `${name} jadi milikku — momen paling bahagia!`, color: '#FF6B9D' },
  { emoji: '🌅', title: 'Kencan Pertama', desc: `Jalan bareng di ${specialPlace}. Nervous tapi indah banget~`, color: '#FFB347' },
  { emoji: '🎂', title: 'Ulang Tahun Hari Ini!', desc: 'Kamu bertambah umur, aku makin bersyukur punya kamu 🥰', color: '#FFD700', highlight: true },
]

const { wrapperRef, progress: p } = useScrollProgress()

// Line draws from 0% → 100% height (progress 0.1 → 0.85)
const lineH = computed(() => mapRange(p.value, 0.08, 0.88, 0, 100))

// Each event appears when line reaches it
function evVisible(i) {
  const threshold = mapRange(i + 0.5, 0, events.length, 0.08, 0.88)
  return p.value >= threshold
}

// Card slide amount
function evSlide(i) {
  const threshold = mapRange(i + 0.5, 0, events.length, 0.08, 0.88)
  const t = easeOut(mapRange(p.value, threshold, threshold + 0.08, 0, 1))
  return t
}

const sectionOpacity = computed(() =>
  Math.min(mapRange(p.value, 0, 0.05, 0, 1), mapRange(p.value, 0.96, 1, 1, 0))
)
</script>

<template>
  <div class="tl-wrapper" ref="wrapperRef">
    <div class="sticky-frame" :style="{ opacity: sectionOpacity }">

      <!-- Header -->
      <div class="tl-header">
        <h2 class="text-script">Kisah Kita 💑</h2>
        <div class="days-pill">
          <span class="text-script days-num">{{ daysTogether }}</span>
          <span class="days-lbl">hari bersama ❤️</span>
        </div>
      </div>

      <!-- Timeline -->
      <div class="tl-track">
        <!-- The animated line -->
        <div class="tl-line-bg"></div>
        <div class="tl-line-fill" :style="{ height: lineH + '%' }"></div>

        <!-- Events -->
        <div
          v-for="(ev, i) in events"
          :key="i"
          class="tl-event"
          :class="{ right: i % 2 !== 0, highlight: ev.highlight }"
          :style="{ '--col': ev.color }"
        >
          <!-- Dot on line -->
          <div class="tl-dot" :style="{ transform: `scale(${evVisible(i) ? 1 : 0})`, background: ev.color }">
            {{ ev.emoji }}
          </div>

          <!-- Card -->
          <div
            class="tl-card"
            :style="{
              opacity: evSlide(i),
              transform: `translateX(${i % 2 === 0 ? (1 - evSlide(i)) * -32 : (1 - evSlide(i)) * 32}px)`,
            }"
          >
            <h3>{{ ev.title }}</h3>
            <p>{{ ev.desc }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.tl-wrapper {
  height: 420vh;
  position: relative;
}

.sticky-frame {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #7B2D8B 0%, #4A148C 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 0 24px;
  border-radius: 40px 40px 0 0;
  will-change: opacity;
}

.tl-header {
  text-align: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}
.tl-header h2 { font-size: 32px; color: white; margin-bottom: 10px; }
.days-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.15);
  border: 1.5px solid rgba(255,255,255,0.25);
  border-radius: 50px;
  padding: 8px 20px;
}
.days-num { font-size: 32px; color: white; line-height: 1; }
.days-lbl { font-size: 13px; color: rgba(255,255,255,0.8); font-weight: 600; }

/* Timeline track */
.tl-track {
  position: relative;
  width: min(360px, 94vw);
  flex: 1;
  overflow: hidden;
  padding: 4px 0;
}

/* Line */
.tl-line-bg, .tl-line-fill {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  top: 0;
}
.tl-line-bg {
  height: 100%;
  background: rgba(255,255,255,0.1);
}
.tl-line-fill {
  background: linear-gradient(180deg, #FF9ADE, #C471ED, #FF6B9D, #FFB347, #FFD700);
  transition: height 0.05s linear;
  box-shadow: 0 0 8px rgba(255,107,157,0.5);
}

/* Events */
.tl-event {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}
.tl-event.right { flex-direction: row-reverse; }

.tl-dot {
  flex-shrink: 0;
  width: 42px; height: 42px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
  border: 2px solid white;
  box-shadow: 0 3px 12px rgba(0,0,0,0.2);
  position: relative;
  z-index: 1;
  transition: transform 0.4s cubic-bezier(0.175,0.885,0.32,1.275);
  will-change: transform;
}

.tl-card {
  flex: 1;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 16px;
  padding: 12px 14px;
  border-left: 3px solid var(--col);
  will-change: transform, opacity;
}
.tl-event.right .tl-card { border-left: none; border-right: 3px solid var(--col); text-align: right; }
.tl-event.highlight .tl-card { background: rgba(255,215,0,0.12); border-color: var(--gold); }

.tl-card h3 { font-size: 14px; font-weight: 700; color: white; margin-bottom: 3px; }
.tl-card p  { font-size: 12px; color: rgba(255,255,255,0.72); line-height: 1.45; }
</style>
