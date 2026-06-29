<script setup>
import { computed } from 'vue'
import { useScrollProgress, mapRange, easeOut } from '../composables/useScrollProgress.js'

const name = import.meta.env.VITE_PARTNER_NAME
const yourName = import.meta.env.VITE_YOUR_NAME
const raw = import.meta.env.VITE_LOVE_LETTER || ''
const paragraphs = raw.split('|||').filter(p => p.trim())

const { wrapperRef, progress: p } = useScrollProgress()

// Stage 1 (0.00–0.12): envelope fades in
const envOpacity = computed(() => mapRange(p.value, 0, 0.12, 0, 1))
const envScale  = computed(() => mapRange(p.value, 0, 0.12, 0.75, 1))

// Stage 2 (0.18–0.52): flap rotates open
const flapAngle  = computed(() => mapRange(p.value, 0.18, 0.52, 0, -178))
const flapBehind = computed(() => flapAngle.value < -88)

// Stage 3 (0.50–0.68): letter paper rises out of envelope
const letterRise   = computed(() => easeOut(mapRange(p.value, 0.50, 0.68, 0, 1)))
const letterY      = computed(() => (1 - letterRise.value) * 72)  // % translateY
const letterOpacity= computed(() => mapRange(p.value, 0.50, 0.62, 0, 1))

// Stage 4 (0.68–0.82): envelope shrinks away, letter fills frame
const envShrink    = computed(() => easeOut(mapRange(p.value, 0.68, 0.82, 0, 1)))
const letterGrow   = computed(() => easeOut(mapRange(p.value, 0.68, 0.82, 0, 1)))

// Stage 5 (0.84–1.00): paragraphs appear one by one
const paraCount    = computed(() => {
  const t = mapRange(p.value, 0.84, 1.0, 0, paragraphs.length)
  return Math.min(paragraphs.length, Math.ceil(t))
})
const signatureVis = computed(() => p.value >= 0.99)

// Derived composite styles
const envelopeStyle = computed(() => ({
  opacity: envOpacity.value,
  transform: `scale(${envScale.value - envShrink.value * 0.3}) translateY(${envShrink.value * 40}px)`,
  pointerEvents: p.value > 0.82 ? 'none' : 'auto',
}))

const flapStyle = computed(() => ({
  transformOrigin: 'top center',
  transform: `perspective(600px) rotateX(${flapAngle.value}deg)`,
  zIndex: flapBehind.value ? 0 : 2,
}))

const letterPaperStyle = computed(() => ({
  opacity: letterOpacity.value,
  transform: `translateY(${letterY.value}%) scale(${0.82 + letterGrow.value * 0.18})`,
  // Move letter up out of envelope frame once expanding
  position: p.value > 0.68 ? 'absolute' : 'absolute',
  zIndex: 3,
}))

const letterContentOpacity = computed(() => mapRange(p.value, 0.82, 0.88, 0, 1))
</script>

<template>
  <div class="letter-wrapper" ref="wrapperRef">
    <div class="sticky-frame letter-bg">

      <!-- Section label -->
      <div class="section-label" :style="{ opacity: mapRange(p, 0, 0.08, 0, 1) }">
        <h2 class="text-script">Surat Untukmu 💌</h2>
        <p>scroll untuk membuka surat~</p>
      </div>

      <!-- Envelope scene -->
      <div class="envelope-scene" :style="{ opacity: p < 0.85 ? 1 : mapRange(p, 0.85, 0.90, 1, 0) }">
        <div class="envelope-wrap" :style="envelopeStyle">

          <!-- Flap (opens upward) -->
          <div class="env-flap" :style="flapStyle">
            <div class="flap-inner">
              <div class="flap-triangle"></div>
            </div>
          </div>

          <!-- Envelope body -->
          <div class="env-body">
            <div class="env-chevrons">
              <div class="chev left"></div>
              <div class="chev right"></div>
            </div>
            <div class="env-seal" :style="{ opacity: flapAngle.value < -60 ? 0 : 1 }">❤️</div>
          </div>

          <!-- Letter paper inside -->
          <div class="letter-inside" :style="letterPaperStyle">
            <p class="text-script letter-greeting">Untuk {{ name }}~</p>
            <div class="letter-lines">
              <div v-for="i in 5" :key="i" class="letter-line"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Full letter view -->
      <Transition name="letter-expand">
        <div v-if="p >= 0.82" class="letter-full" :style="{ opacity: letterContentOpacity }">
          <div class="paper">
            <div class="paper-top">
              <span class="sparkle">✨</span>
              <span class="text-script" style="font-size:22px;color:var(--hot-pink)">Untuk {{ name }} Tercinta</span>
              <span class="sparkle" style="animation-delay:.8s">✨</span>
            </div>

            <div class="paper-body">
              <TransitionGroup name="para-in">
                <p v-for="i in paraCount" :key="i" class="para">
                  {{ paragraphs[i - 1] }}
                </p>
              </TransitionGroup>
              <div v-if="paraCount < paragraphs.length" class="dots">
                <span></span><span></span><span></span>
              </div>
            </div>

            <Transition name="sign-in">
              <div v-if="signatureVis" class="signature">
                <div class="hearts">
                  <span v-for="i in 5" :key="i" :style="{ animationDelay: i*.15+'s' }">💕</span>
                </div>
                <p class="text-script" style="font-size:18px;color:#999">Dengan sepenuh cinta,</p>
                <p class="text-script" style="font-size:34px;color:var(--hot-pink)">{{ yourName }}</p>
                <span style="font-size:32px">💝</span>
              </div>
            </Transition>
          </div>
        </div>
      </Transition>

    </div>
  </div>
</template>

<style scoped>
.letter-wrapper {
  height: 420vh;
  position: relative;
}

.sticky-frame {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.letter-bg {
  background: #FFFAF5;
}

.section-label {
  position: absolute;
  top: 52px;
  text-align: center;
  transition: opacity 0.3s;
  z-index: 10;
}
.section-label h2 { font-size: 32px; color: var(--dark); margin-bottom: 4px; }
.section-label p { color: #bbb; font-size: 13px; font-weight: 600; }

/* === ENVELOPE === */
.envelope-scene {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  transition: opacity 0.4s;
}

.envelope-wrap {
  position: relative;
  width: min(300px, 80vw);
  height: min(210px, 56vw);
  will-change: transform, opacity;
}

/* Flap */
.env-flap {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  z-index: 2;
  will-change: transform;
  backface-visibility: hidden;
}
.flap-inner {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.flap-triangle {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #FF9ADE 0%, #C471ED 100%);
  clip-path: polygon(0 0, 100% 0, 50% 100%);
}

/* Envelope body */
.env-body {
  position: absolute;
  inset: 0;
  border: 3px solid rgba(196,113,237,0.3);
  border-radius: 12px;
  background: linear-gradient(160deg, #FFF0F8 0%, #F3E5F5 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.env-chevrons {
  position: absolute;
  inset: 0;
}
.chev {
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 100%;
}
.chev.left {
  left: 0;
  background: rgba(196,113,237,0.08);
  clip-path: polygon(0 100%, 100% 100%, 100% 40%);
}
.chev.right {
  right: 0;
  background: rgba(255,107,157,0.08);
  clip-path: polygon(0 100%, 100% 100%, 0 40%);
}
.env-seal {
  font-size: 32px;
  position: relative;
  z-index: 1;
  transition: opacity 0.3s;
  animation: pulse-love 2s ease-in-out infinite;
}

/* Letter inside envelope */
.letter-inside {
  position: absolute;
  top: 10%;
  left: 50%;
  transform-origin: bottom center;
  transform: translateX(-50%) translateY(100%);
  width: 88%;
  background: #FFFDF9;
  border-radius: 8px 8px 0 0;
  padding: 12px;
  box-shadow: 0 -4px 16px rgba(0,0,0,0.1);
  will-change: transform, opacity;
}
.letter-greeting {
  font-size: 16px;
  color: var(--hot-pink);
  margin-bottom: 8px;
}
.letter-lines { display: flex; flex-direction: column; gap: 6px; }
.letter-line {
  height: 2px;
  background: rgba(255,182,193,0.4);
  border-radius: 2px;
}

/* === FULL LETTER VIEW === */
.letter-full {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 80px 16px 32px;
  overflow-y: auto;
  scrollbar-width: none;
  z-index: 5;
}
.letter-full::-webkit-scrollbar { display: none; }

.paper {
  width: 100%;
  max-width: 380px;
  background: #FFFDF9;
  border-radius: 20px;
  padding: 24px 22px;
  box-shadow: 0 6px 32px rgba(196,113,237,0.15);
  border: 1px solid rgba(255,182,193,0.3);
  background-image: repeating-linear-gradient(
    transparent, transparent 31px,
    rgba(255,182,193,0.12) 31px, rgba(255,182,193,0.12) 32px
  );
  line-height: 32px;
}

.paper-top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 2px dashed rgba(255,107,157,0.2);
}

.para {
  font-size: 15px;
  color: var(--dark);
  line-height: 1.85;
  margin-bottom: 14px;
  font-weight: 500;
}

.dots {
  display: flex; gap: 5px; padding: 8px 0;
}
.dots span {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--pink);
  animation: dot-pulse 1.4s ease-in-out infinite;
}
.dots span:nth-child(2) { animation-delay: .2s; }
.dots span:nth-child(3) { animation-delay: .4s; }

@keyframes dot-pulse {
  0%,80%,100% { transform: scale(.6); opacity: .4; }
  40% { transform: scale(1); opacity: 1; }
}

.signature {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 2px dashed rgba(255,107,157,0.2);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}
.hearts { display: flex; gap: 4px; font-size: 20px; margin-bottom: 6px; }
.hearts span { animation: pulse-love 1.5s ease-in-out infinite; }

/* Transitions */
.para-in-enter-active { animation: slide-up .5s ease; }
.sign-in-enter-active { animation: slide-up .6s ease; }
.letter-expand-enter-active { animation: bounce-in .5s ease; }
</style>
