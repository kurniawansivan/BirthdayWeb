<script setup>
import { ref, onMounted } from 'vue'
import confetti from 'canvas-confetti'
import { useRouter } from 'vue-router'

const router = useRouter()
const partnerName = import.meta.env.VITE_PARTNER_NAME
const yourName = import.meta.env.VITE_YOUR_NAME
const age = import.meta.env.VITE_PARTNER_AGE

const scratched = ref(false)
const scratchProgress = ref(0)
const isScratching = ref(false)
const canvasRef = ref(null)
const revealed = ref(false)
const showFinal = ref(false)

const wishes = [
  `Semoga di umur ${age} ini, ${partnerName} selalu sehat dan bahagia 🌟`,
  `Semoga semua impian dan cita-citamu tercapai dengan indah ✨`,
  `Semoga kita selalu bersama dan saling mendukung satu sama lain 💕`,
  `Semoga hari-harimu selalu dipenuhi tawa dan kebahagiaan 🌸`,
  `${yourName} akan selalu ada untukmu, apapun yang terjadi ❤️`,
]

let ctx = null
let isDrawing = false

onMounted(() => {
  setupScratchCard()
})

function setupScratchCard() {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  canvas.width = canvas.offsetWidth
  canvas.height = canvas.offsetHeight

  // Draw scratch layer
  ctx.fillStyle = '#C471ED'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Add texture text
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.font = 'bold 18px Nunito'
  ctx.textAlign = 'center'
  for (let y = 30; y < canvas.height; y += 40) {
    for (let x = 40; x < canvas.width; x += 80) {
      ctx.fillText('❤️ GOSOK', x, y)
    }
  }
}

function getPos(e, canvas) {
  const rect = canvas.getBoundingClientRect()
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    }
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top }
}

function startScratch(e) {
  isDrawing = true
  isScratching.value = true
}

function doScratch(e) {
  if (!isDrawing || !ctx) return
  e.preventDefault()
  const pos = getPos(e, canvasRef.value)
  ctx.globalCompositeOperation = 'destination-out'
  ctx.beginPath()
  ctx.arc(pos.x, pos.y, 28, 0, Math.PI * 2)
  ctx.fill()
  checkProgress()
}

function stopScratch() {
  isDrawing = false
}

function checkProgress() {
  const canvas = canvasRef.value
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  let transparent = 0
  for (let i = 3; i < imgData.data.length; i += 4) {
    if (imgData.data[i] < 128) transparent++
  }
  const total = canvas.width * canvas.height
  scratchProgress.value = Math.round((transparent / total) * 100)

  if (scratchProgress.value > 60 && !revealed.value) {
    revealed.value = true
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setTimeout(() => {
      showFinal.value = true
      confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } })
      setTimeout(() => {
        confetti({ particleCount: 100, spread: 70, origin: { x: 0.1, y: 0.5 } })
        confetti({ particleCount: 100, spread: 70, origin: { x: 0.9, y: 0.5 } })
      }, 500)
    }, 300)
  }
}
</script>

<template>
  <div class="surprise-view">
    <!-- Header -->
    <div class="surprise-header">
      <h1 class="text-script">Kejutan! 🎁</h1>
      <p>Ada yang spesial untukmu, {{ partnerName }}~</p>
    </div>

    <!-- Scratch card section -->
    <div v-if="!showFinal" class="scratch-section">
      <div class="scratch-instruction">
        <span class="si-emoji">💅</span>
        <p>Gosok kartu di bawah ini untuk melihat kejutanmu!</p>
        <div class="scratch-bar">
          <div class="scratch-fill" :style="{ width: scratchProgress + '%' }"></div>
        </div>
        <span class="scratch-pct">{{ scratchProgress }}% tergosok</span>
      </div>

      <div class="scratch-card-wrapper">
        <!-- Hidden content behind -->
        <div class="scratch-reveal">
          <div class="reveal-inner">
            <div class="reveal-emoji">🎊</div>
            <h2 class="text-script">Muat sebentar...</h2>
          </div>
        </div>

        <!-- Scratch canvas on top -->
        <canvas
          ref="canvasRef"
          class="scratch-canvas"
          :class="{ scratching: isScratching }"
          @mousedown="startScratch"
          @mousemove="doScratch"
          @mouseup="stopScratch"
          @mouseleave="stopScratch"
          @touchstart.prevent="startScratch"
          @touchmove.prevent="doScratch"
          @touchend="stopScratch"
        ></canvas>
      </div>
    </div>

    <!-- Final surprise reveal -->
    <Transition name="surprise-reveal">
      <div v-if="showFinal" class="final-reveal">
        <!-- Big celebration -->
        <div class="celebration-emoji">🎂✨🎊</div>
        <h2 class="text-script main-wish">
          Selamat Ulang Tahun,<br/>{{ partnerName }}!
        </h2>

        <!-- Wishes cards -->
        <div class="wishes-list">
          <div
            v-for="(wish, i) in wishes"
            :key="i"
            class="wish-card"
            :style="{ animationDelay: (i * 0.15) + 's' }"
          >
            <div class="wish-num text-script">{{ i + 1 }}</div>
            <p>{{ wish }}</p>
          </div>
        </div>

        <!-- Love count -->
        <div class="love-counter">
          <div class="lc-label">Betapa banyak cintaku untukmu:</div>
          <div class="lc-number text-script">∞</div>
          <div class="lc-hearts">
            <span v-for="i in 9" :key="i" :style="{ animationDelay: (i*0.1)+'s' }">❤️</span>
          </div>
        </div>

        <!-- Final message -->
        <div class="final-message">
          <p class="text-script">
            "Kamu adalah hadiah terindah yang pernah aku dapatkan. Terima kasih sudah ada~"
          </p>
          <p class="fm-sign">— {{ yourName }} 💕</p>
        </div>

        <!-- Back button -->
        <button class="btn-primary" @click="router.push('/home')">
          🏠 Kembali ke Beranda
        </button>
      </div>
    </Transition>

    <div style="height: 90px"></div>
  </div>
</template>

<style scoped>
.surprise-view { min-height: 100vh; }

.surprise-header {
  background: linear-gradient(135deg, #FFB347, #FF6B9D);
  padding: 50px 24px 32px;
  text-align: center;
  border-radius: 0 0 32px 32px;
}
.surprise-header h1 { font-size: 38px; color: white; margin-bottom: 6px; }
.surprise-header p { color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 600; }

.scratch-section { padding: 24px 16px; }

.scratch-instruction {
  text-align: center;
  margin-bottom: 20px;
}
.si-emoji { font-size: 32px; display: block; margin-bottom: 8px; }
.scratch-instruction p { color: var(--dark); font-size: 16px; font-weight: 600; margin-bottom: 12px; }

.scratch-bar {
  height: 8px;
  background: #F0E0FF;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto 6px;
  max-width: 200px;
}
.scratch-fill {
  height: 100%;
  background: var(--gradient-main);
  border-radius: 10px;
  transition: width 0.2s;
}
.scratch-pct { font-size: 12px; color: #aaa; font-weight: 600; }

.scratch-card-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(196,113,237,0.3);
}

.scratch-reveal {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #FFF0F8, #F3E5F5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.reveal-inner { text-align: center; }
.reveal-emoji { font-size: 60px; margin-bottom: 12px; }
.reveal-inner h2 { font-size: 28px; color: var(--hot-pink); }

.scratch-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: grab;
  border-radius: 24px;
}
.scratch-canvas.scratching { cursor: grabbing; }

.final-reveal {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  gap: 20px;
  text-align: center;
}

.celebration-emoji { font-size: 52px; animation: bounce-in 0.8s ease; }
.main-wish { font-size: 38px; color: var(--hot-pink); line-height: 1.2; }

.wishes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.wish-card {
  background: white;
  border-radius: 18px;
  padding: 16px 20px;
  box-shadow: 0 3px 15px rgba(196,113,237,0.12);
  display: flex;
  align-items: flex-start;
  gap: 14px;
  text-align: left;
  animation: slide-up 0.5s ease both;
}
.wish-num {
  font-size: 28px;
  color: var(--pink);
  flex-shrink: 0;
  line-height: 1;
}
.wish-card p { font-size: 15px; color: var(--dark); font-weight: 600; line-height: 1.5; }

.love-counter {
  background: linear-gradient(135deg, #FF6B9D, #C471ED);
  border-radius: 24px;
  padding: 24px;
  color: white;
  width: 100%;
}
.lc-label { font-size: 14px; font-weight: 600; opacity: 0.85; margin-bottom: 8px; }
.lc-number { font-size: 72px; line-height: 1; margin-bottom: 12px; }
.lc-hearts { font-size: 22px; display: flex; justify-content: center; gap: 4px; flex-wrap: wrap; }
.lc-hearts span { animation: pulse-love 1.5s ease-in-out infinite; }

.final-message {
  background: #FFF0F8;
  border-radius: 20px;
  padding: 24px;
  border: 2px dashed rgba(255, 107, 157, 0.3);
  width: 100%;
}
.final-message p:first-child { font-size: 20px; color: var(--dark); line-height: 1.6; margin-bottom: 12px; }
.fm-sign { color: var(--pink); font-weight: 700; font-size: 16px; }

.surprise-reveal-enter-active { animation: bounce-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
</style>
