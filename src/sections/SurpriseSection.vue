<script setup>
import { ref, computed, onMounted } from 'vue'
import confetti from 'canvas-confetti'
import { useScrollProgress, mapRange, easeOut } from '../composables/useScrollProgress.js'

const name     = import.meta.env.VITE_PARTNER_NAME
const yourName = import.meta.env.VITE_YOUR_NAME

const { wrapperRef, progress: p } = useScrollProgress()

const canvasRef  = ref(null)
const revealed   = ref(false)
const showFinal  = ref(false)
const scratchPct = ref(0)
let ctx = null, drawing = false

const headerT = computed(() => mapRange(p.value, 0, 0.08, 0, 1))
const cardT   = computed(() => easeOut(mapRange(p.value, 0.06, 0.18, 0, 1)))

onMounted(() => {
  const c = canvasRef.value
  if (!c) return
  ctx = c.getContext('2d')
  c.width = c.offsetWidth
  c.height = c.offsetHeight
  ctx.fillStyle = '#9B59B6'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.font = 'bold 15px Nunito,sans-serif'
  ctx.textAlign = 'center'
  for (let y = 28; y < c.height; y += 38)
    for (let x = 60; x < c.width; x += 110)
      ctx.fillText('💜 GOSOK', x, y)
})

function xy(e, c) {
  const r = c.getBoundingClientRect()
  return e.touches
    ? { x: (e.touches[0].clientX - r.left) * (c.width / r.width), y: (e.touches[0].clientY - r.top) * (c.height / r.height) }
    : { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) }
}

function scratch(e) {
  if (!drawing || !ctx || revealed.value) return
  e.preventDefault()
  const { x, y } = xy(e, canvasRef.value)
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath(); ctx.arc(x, y, 28, 0, Math.PI * 2); ctx.fill()
  checkReveal()
}

function checkReveal() {
  const c = canvasRef.value
  const d = ctx.getImageData(0, 0, c.width, c.height).data
  let t = 0
  for (let i = 3; i < d.length; i += 4) if (d[i] < 128) t++
  scratchPct.value = Math.round(t / (c.width * c.height) * 100)
  if (scratchPct.value > 55 && !revealed.value) triggerReveal()
}

function triggerReveal() {
  revealed.value = true
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  setTimeout(() => {
    showFinal.value = true
    confetti({ particleCount: 200, spread: 120, origin: { y: 0.45 }, colors: ['#FF6B9D','#C471ED','#FFD700','#FF1493','#fff'] })
    setTimeout(() => {
      confetti({ particleCount: 80, spread: 80, origin: { x: 0.05, y: 0.5 } })
      confetti({ particleCount: 80, spread: 80, origin: { x: 0.95, y: 0.5 } })
    }, 400)
  }, 250)
}
</script>

<template>
  <div class="surprise-wrapper" ref="wrapperRef">
    <div class="sticky-frame">

      <div class="s-header" :style="{ opacity: headerT, transform: `translateY(${(1-headerT)*20}px)` }">
        <h2 class="text-script">Ada Kejutan! 🎁</h2>
        <p>Gosok untuk membuka~</p>
      </div>

      <!-- Scratch card -->
      <div
        v-if="!showFinal"
        class="scratch-wrap"
        :style="{ opacity: cardT, transform: `scale(${0.88 + cardT * 0.12})` }"
      >
        <div class="scratch-container">
          <div class="scratch-bg">
            <span style="font-size:48px">🎊</span>
            <p class="text-script" style="font-size:22px;color:var(--hot-pink)">Buka yuk~</p>
          </div>
          <canvas
            ref="canvasRef"
            class="scratch-canvas"
            @mousedown="drawing=true"
            @mousemove="scratch"
            @mouseup="drawing=false"
            @mouseleave="drawing=false"
            @touchstart.prevent="drawing=true"
            @touchmove.prevent="scratch"
            @touchend="drawing=false"
          ></canvas>
        </div>
        <div class="scratch-bar">
          <div class="bar-fill" :style="{ width: scratchPct + '%' }"></div>
          <span>{{ scratchPct }}% tergosok</span>
        </div>
      </div>

      <!-- Final reveal -->
      <Transition name="pop-in">
        <div v-if="showFinal" class="finale">
          <div class="confetti-row">🎊 🎉 🎂 🎉 🎊</div>
          <h3 class="text-script finale-main">Aku Cinta Kamu</h3>
          <div class="heart-big pulse">❤️</div>
          <p class="text-script" style="font-size:36px;color:white">{{ name }}</p>
          <div class="finale-box">
            <p>Kamu adalah orang paling spesial di hidupku. Terima kasih sudah ada dan mau jadi milikku. Semoga kita selalu bahagia bersama~ 🥰</p>
          </div>
          <div class="finale-hearts">
            <span v-for="i in 9" :key="i" :style="{ animationDelay: i*.1+'s' }">❤️</span>
          </div>
          <p class="credits">Dibuat dengan ❤️ oleh <strong>{{ yourName }}</strong></p>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
.surprise-wrapper {
  height: 320vh;
  position: relative;
}

.sticky-frame {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #2C0A37 0%, #5B1A8A 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 52px 16px 32px;
  gap: 16px;
  border-radius: 40px 40px 0 0;
}

.s-header { text-align: center; will-change: opacity, transform; }
.s-header h2 { font-size: 32px; color: white; }
.s-header p  { color: rgba(255,255,255,0.65); font-size: 14px; font-weight: 600; }

.scratch-wrap {
  display: flex; flex-direction: column; gap: 14px;
  width: 100%; max-width: 320px;
  will-change: opacity, transform;
}

.scratch-container {
  position: relative;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 32px rgba(0,0,0,0.3);
}
.scratch-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #FFF0F8, #F3E5F5);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 8px;
}
.scratch-canvas {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  cursor: grab; touch-action: none;
  border-radius: 20px;
}

.scratch-bar {
  display: flex; align-items: center; gap: 10px;
}
.scratch-bar > div { flex: 1; height: 7px; background: rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; }
.bar-fill { height: 100%; background: linear-gradient(90deg, #FF6B9D, #C471ED); transition: width .25s ease; }
.scratch-bar span { color: rgba(255,255,255,0.5); font-size: 12px; font-weight: 600; flex-shrink: 0; }

.finale {
  display: flex; flex-direction: column;
  align-items: center; gap: 12px; text-align: center;
  width: 100%; max-width: 360px;
}
.confetti-row { font-size: 28px; letter-spacing: 4px; animation: bounce-in .8s ease; }
.finale-main  { font-size: 46px; color: var(--light-pink); text-shadow: 0 0 24px rgba(255,182,193,.4); }
.heart-big    { font-size: 72px; }
.finale-box {
  background: rgba(255,255,255,.1);
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 18px; padding: 16px 18px;
}
.finale-box p { font-size: 14px; color: rgba(255,255,255,.88); line-height: 1.65; font-weight: 500; }
.finale-hearts { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; }
.finale-hearts span { animation: pulse-love 1.5s ease-in-out infinite; font-size: 22px; }
.credits { color: rgba(255,255,255,.45); font-size: 13px; }
.credits strong { color: rgba(255,255,255,.75); }

.pop-in-enter-active { animation: bounce-in .8s cubic-bezier(.175,.885,.32,1.275); }
</style>
