<script setup>
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'
import { useScrollProgress, mapRange } from '../composables/useScrollProgress.js'

const raw = import.meta.env.VITE_QUIZ_QUESTIONS || ''
const { wrapperRef, progress: p } = useScrollProgress()

const questions = computed(() =>
  raw.split('|||').map((q, idx) => {
    const parts = q.split('|')
    return {
      id: idx,
      question: parts[0],
      correct: parts[1],
      opts: [parts[1], parts[2], parts[3], parts[4]].sort(() => Math.random() - 0.5),
    }
  })
)

const idx       = ref(0)
const selected  = ref(null)
const answered  = ref(false)
const score     = ref(0)
const finished  = ref(false)
const shaking   = ref(null)
const done      = ref(false) // user done, scroll continues

function pick(opt) {
  if (answered.value) return
  selected.value = opt
  answered.value = true
  if (opt === questions.value[idx.value].correct) {
    score.value++
  } else {
    shaking.value = opt
    setTimeout(() => { shaking.value = null }, 600)
  }
}
function next() {
  if (idx.value < questions.value.length - 1) {
    idx.value++; selected.value = null; answered.value = false
  } else {
    finished.value = true
    if (score.value === questions.value.length)
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } })
  }
}
function scrollContinue() { done.value = true }

const headerOpacity = computed(() => mapRange(p.value, 0, 0.06, 0, 1))
const cardOpacity   = computed(() => mapRange(p.value, 0.04, 0.12, 0, 1))
const cardY         = computed(() => (1 - cardOpacity.value) * 30)

const current = computed(() => questions.value[idx.value])
const progress_bar = computed(() => (idx.value / questions.value.length) * 100)

const rating = computed(() => {
  const pct = score.value / questions.value.length
  if (pct === 1)   return { label: 'SEMPURNA! Kamu tau semua~ 👑', color: '#FFD700' }
  if (pct >= 0.7)  return { label: 'Bagus! Kamu kenal aku~ 💖',    color: '#FF6B9D' }
  if (pct >= 0.4)  return { label: 'Lumayan, masih bisa lebih baik~ 😄', color: '#C471ED' }
  return { label: 'Hehe, kita harus lebih sering ngobrol~ 😂', color: '#FF9A9E' }
})
</script>

<template>
  <div class="quiz-wrapper" ref="wrapperRef">
    <div class="sticky-frame">

      <div class="q-header" :style="{ opacity: headerOpacity }">
        <h2 class="text-script">Kuis Cinta 💡</h2>
        <p>Seberapa kamu mengenalku?</p>
      </div>

      <!-- Quiz card -->
      <div
        v-if="!finished"
        class="quiz-card"
        :style="{ opacity: cardOpacity, transform: `translateY(${cardY}px)` }"
      >
        <div class="prog-row">
          <div class="prog-bar"><div class="prog-fill" :style="{ width: progress_bar + '%' }"></div></div>
          <span>{{ idx + 1 }}/{{ questions.length }}</span>
        </div>

        <Transition name="q-swap" mode="out-in">
          <div :key="idx" class="q-body">
            <div class="q-tag">Q{{ idx + 1 }}</div>
            <p class="q-text">{{ current.question }}</p>
            <div class="opts">
              <button
                v-for="opt in current.opts"
                :key="opt"
                class="opt"
                :class="{
                  correct: answered && opt === current.correct,
                  wrong:   answered && opt === selected && opt !== current.correct,
                  shake:   shaking === opt,
                }"
                @click="pick(opt)"
              >{{ opt }}</button>
            </div>
            <Transition name="fb-in">
              <div v-if="answered" class="feedback">
                <p v-if="selected === current.correct">🎉 Benar! Makasih udah kenal aku~</p>
                <p v-else>💭 Jawabannya "{{ current.correct }}" — inget ya~</p>
                <button class="btn-primary next-btn" @click="next">
                  {{ idx < questions.length - 1 ? 'Lanjut →' : 'Lihat Hasil 🎊' }}
                </button>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>

      <!-- Result -->
      <div
        v-else
        class="result-card"
        :style="{ opacity: cardOpacity, transform: `translateY(${cardY}px)` }"
      >
        <div class="r-emoji">{{ score === questions.length ? '👑' : '💝' }}</div>
        <div class="r-score">
          <span class="text-script" style="font-size:64px;color:var(--pink)">{{ score }}</span>
          <span style="font-size:24px;color:#ccc"> / {{ questions.length }}</span>
        </div>
        <p class="r-msg" :style="{ color: rating.color }">{{ rating.label }}</p>
        <div class="r-stars">
          <span v-for="i in questions.length" :key="i">{{ i <= score ? '⭐' : '☆' }}</span>
        </div>
        <button class="btn-secondary" @click="idx=0;selected=null;answered=false;score=0;finished=false">🔄 Coba Lagi</button>
        <p class="continue-hint">scroll ke bawah untuk lanjut~</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.quiz-wrapper {
  height: 300vh;
  position: relative;
}

.sticky-frame {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #C471ED 0%, #7B1FA2 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 52px 16px 32px;
  gap: 16px;
  border-radius: 40px 40px 0 0;
}

.q-header { text-align: center; will-change: opacity; }
.q-header h2 { font-size: 32px; color: white; }
.q-header p  { color: rgba(255,255,255,0.78); font-size: 14px; font-weight: 600; }

.quiz-card, .result-card {
  width: 100%; max-width: 380px;
  background: rgba(255,255,255,0.96);
  border-radius: 24px;
  padding: 20px;
  box-shadow: 0 10px 36px rgba(0,0,0,0.15);
  will-change: opacity, transform;
}

.prog-row { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.prog-bar { flex: 1; height: 7px; background: #F0E0FF; border-radius: 10px; overflow: hidden; }
.prog-fill { height: 100%; background: var(--gradient-main); border-radius: 10px; transition: width .5s ease; }
.prog-row span { font-size: 12px; font-weight: 700; color: #aaa; flex-shrink: 0; }

.q-tag {
  display: inline-block;
  background: var(--gradient-main);
  color: white; border-radius: 50px;
  padding: 2px 12px; font-size: 12px; font-weight: 700;
  margin-bottom: 8px;
}
.q-text { font-size: 18px; font-weight: 700; color: var(--dark); margin-bottom: 16px; line-height: 1.4; }

.opts { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; }
.opt {
  background: #F8F0FF;
  border: 2px solid #E8D5FF;
  border-radius: 12px;
  padding: 13px 8px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: var(--dark);
  cursor: pointer;
  transition: all .2s;
}
.opt:active { transform: scale(.96); }
.opt.correct { background: #E8F5E9; border-color: #4CAF50; color: #2E7D32; }
.opt.wrong   { background: #FFEBEE; border-color: #F44336; color: #C62828; }
.opt.shake   { animation: shake .5s ease; }

@keyframes shake {
  0%,100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

.feedback { margin-top: 12px; text-align: center; }
.feedback p {
  font-size: 13px; font-weight: 600; color: var(--dark);
  background: #FFF0F8; border-radius: 10px; padding: 9px;
  margin-bottom: 10px;
}
.next-btn { width: 100%; justify-content: center; }

.result-card { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.r-emoji { font-size: 64px; animation: bounce-in .8s ease; }
.r-score { display: flex; align-items: baseline; }
.r-msg   { font-size: 16px; font-weight: 700; }
.r-stars { font-size: 26px; display: flex; gap: 4px; }
.continue-hint { color: #bbb; font-size: 12px; font-weight: 600; }

.q-swap-enter-active, .q-swap-leave-active { transition: all .3s ease; }
.q-swap-enter-from { opacity: 0; transform: translateX(24px); }
.q-swap-leave-to   { opacity: 0; transform: translateX(-24px); }

.fb-in-enter-active { transition: opacity .4s, transform .4s; }
.fb-in-enter-from   { opacity: 0; transform: translateY(10px); }
</style>
