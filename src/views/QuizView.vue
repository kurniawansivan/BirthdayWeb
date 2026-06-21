<script setup>
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'

const rawQuestions = import.meta.env.VITE_QUIZ_QUESTIONS || ''
const yourName = import.meta.env.VITE_YOUR_NAME

const questions = computed(() => {
  return rawQuestions.split('|||').map((q, idx) => {
    const parts = q.split('|')
    const question = parts[0]
    const correct = parts[1]
    const options = [parts[1], parts[2], parts[3], parts[4]].sort(() => Math.random() - 0.5)
    return { id: idx, question, correct, options }
  })
})

const currentIndex = ref(0)
const selected = ref(null)
const answered = ref(false)
const score = ref(0)
const finished = ref(false)
const showResult = ref(false)

function selectAnswer(option) {
  if (answered.value) return
  selected.value = option
  answered.value = true
  if (option === questions.value[currentIndex.value].correct) {
    score.value++
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    selected.value = null
    answered.value = false
  } else {
    finished.value = true
    if (score.value === questions.value.length) {
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } })
    }
  }
}

function restart() {
  currentIndex.value = 0
  selected.value = null
  answered.value = false
  score.value = 0
  finished.value = false
}

const currentQ = computed(() => questions.value[currentIndex.value])
const progress = computed(() => ((currentIndex.value) / questions.value.length) * 100)

const scoreMessage = computed(() => {
  const pct = score.value / questions.value.length
  if (pct === 1) return { msg: 'SEMPURNA! Kamu tau semua tentang aku! 🥰✨', emoji: '👑', color: '#FFD700' }
  if (pct >= 0.7) return { msg: 'Bagus banget! Kamu sangat mengenalku~ 💕', emoji: '💖', color: '#FF6B9D' }
  if (pct >= 0.4) return { msg: 'Lumayan! Tapi masih perlu banyak kenalan nih~ 😄', emoji: '💝', color: '#C471ED' }
  return { msg: 'Hehe kita harus lebih sering ngobrol nih! 😂💕', emoji: '🤭', color: '#FF9A9E' }
})
</script>

<template>
  <div class="quiz-view">
    <!-- Header -->
    <div class="quiz-header">
      <h1 class="text-script">Kuis Cinta 💡</h1>
      <p>Seberapa kamu mengenalku?</p>
    </div>

    <!-- Quiz active -->
    <div v-if="!finished" class="quiz-body">
      <!-- Progress -->
      <div class="progress-section">
        <div class="progress-info">
          <span>Soal {{ currentIndex + 1 }} dari {{ questions.length }}</span>
          <span>{{ score }} benar ✨</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
      </div>

      <!-- Question card -->
      <Transition name="q-slide" mode="out-in">
        <div :key="currentIndex" class="question-card">
          <div class="q-number">Q{{ currentIndex + 1 }}</div>
          <h2 class="q-text">{{ currentQ.question }}</h2>
          <div class="options-grid">
            <button
              v-for="opt in currentQ.options"
              :key="opt"
              class="option-btn"
              :class="{
                correct: answered && opt === currentQ.correct,
                wrong: answered && opt === selected && opt !== currentQ.correct,
                selected: selected === opt
              }"
              @click="selectAnswer(opt)"
            >
              <span class="opt-icon">
                {{ !answered ? '○' : opt === currentQ.correct ? '✓' : opt === selected ? '✗' : '○' }}
              </span>
              {{ opt }}
            </button>
          </div>

          <Transition name="fade-quick">
            <div v-if="answered" class="answer-feedback">
              <p v-if="selected === currentQ.correct">
                🎉 Benar! Kamu emang kenal banget sama aku~
              </p>
              <p v-else>
                💭 Jawabannya "{{ currentQ.correct }}" ya! Inget-inget lho~
              </p>
              <button class="btn-primary next-btn" @click="nextQuestion">
                {{ currentIndex < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil 🎊' }}
              </button>
            </div>
          </Transition>
        </div>
      </Transition>
    </div>

    <!-- Result screen -->
    <div v-else class="result-screen">
      <div class="result-emoji">{{ scoreMessage.emoji }}</div>
      <div class="score-display">
        <span class="score-big text-script">{{ score }}</span>
        <span class="score-total">/ {{ questions.length }}</span>
      </div>
      <div class="score-label">Jawaban Benar</div>
      <div class="result-message" :style="{ color: scoreMessage.color }">
        {{ scoreMessage.msg }}
      </div>

      <div class="result-stars">
        <span
          v-for="i in questions.length"
          :key="i"
          class="result-star"
          :class="{ filled: i <= score }"
        >{{ i <= score ? '⭐' : '☆' }}</span>
      </div>

      <div class="result-actions">
        <button class="btn-primary" @click="restart">
          🔄 Coba Lagi
        </button>
      </div>
    </div>

    <div style="height: 90px"></div>
  </div>
</template>

<style scoped>
.quiz-view { min-height: 100vh; }

.quiz-header {
  background: linear-gradient(135deg, #C471ED, #9B59B6);
  padding: 50px 24px 32px;
  text-align: center;
  border-radius: 0 0 32px 32px;
}
.quiz-header h1 { font-size: 38px; color: white; margin-bottom: 6px; }
.quiz-header p { color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 600; }

.quiz-body { padding: 20px 16px; }

.progress-section { margin-bottom: 20px; }
.progress-info {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  font-weight: 600;
  color: #888;
  margin-bottom: 8px;
}
.progress-bar {
  height: 8px;
  background: #F0E0FF;
  border-radius: 10px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: var(--gradient-main);
  border-radius: 10px;
  transition: width 0.5s ease;
}

.question-card {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(196,113,237,0.15);
}

.q-number {
  display: inline-block;
  background: var(--gradient-main);
  color: white;
  border-radius: 50px;
  padding: 4px 14px;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 12px;
}

.q-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 20px;
  line-height: 1.4;
}

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.option-btn {
  background: #F8F0FF;
  border: 2px solid #E8D5FF;
  border-radius: 14px;
  padding: 14px 10px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--dark);
  cursor: pointer;
  transition: all 0.25s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  text-align: left;
}

.option-btn:active { transform: scale(0.97); }

.option-btn.correct {
  background: #E8F5E9;
  border-color: #4CAF50;
  color: #2E7D32;
}
.option-btn.wrong {
  background: #FFEBEE;
  border-color: #F44336;
  color: #C62828;
}
.opt-icon { font-size: 16px; flex-shrink: 0; }

.answer-feedback {
  margin-top: 16px;
  text-align: center;
}
.answer-feedback p {
  font-size: 15px;
  font-weight: 600;
  color: var(--dark);
  margin-bottom: 14px;
  padding: 12px;
  background: #FFF0F8;
  border-radius: 12px;
}
.next-btn { width: 100%; justify-content: center; }

.result-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  gap: 16px;
  text-align: center;
}

.result-emoji { font-size: 80px; animation: bounce-in 0.8s ease; }

.score-display {
  display: flex;
  align-items: baseline;
  gap: 4px;
}
.score-big { font-size: 80px; color: var(--pink); line-height: 1; }
.score-total { font-size: 32px; color: #ccc; }
.score-label { font-size: 16px; color: #888; font-weight: 600; margin-top: -8px; }

.result-message {
  font-size: 18px;
  font-weight: 700;
  max-width: 280px;
  line-height: 1.4;
}

.result-stars { display: flex; gap: 6px; font-size: 28px; margin: 8px 0; }
.result-star { transition: transform 0.3s ease; }
.result-star.filled { animation: bounce-in 0.5s ease; }

.result-actions { margin-top: 8px; }

.q-slide-enter-active, .q-slide-leave-active { transition: all 0.35s ease; }
.q-slide-enter-from { opacity: 0; transform: translateX(30px); }
.q-slide-leave-to { opacity: 0; transform: translateX(-30px); }

.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity 0.3s; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
</style>
