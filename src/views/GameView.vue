<script setup>
import { ref, onUnmounted, computed } from 'vue'
import confetti from 'canvas-confetti'

const GAME_DURATION = 30

const hearts = ref([])
const score = ref(0)
const gameStarted = ref(false)
const gameOver = ref(false)
const timeLeft = ref(GAME_DURATION)
const combo = ref(0)
const maxCombo = ref(0)
const intervalId = ref(null)
const timerInterval = ref(null)
const heartId = ref(0)
const showComboText = ref('')

const emojis = ['❤️', '💕', '💖', '💗', '💝', '🌸', '💞']
const bonusEmojis = ['⭐', '💫', '✨', '🎁']

function startGame() {
  score.value = 0
  timeLeft.value = GAME_DURATION
  hearts.value = []
  combo.value = 0
  maxCombo.value = 0
  gameStarted.value = true
  gameOver.value = false

  intervalId.value = setInterval(spawnHeart, 600)
  timerInterval.value = setInterval(() => {
    timeLeft.value--
    if (timeLeft.value <= 0) endGame()
  }, 1000)
}

function spawnHeart() {
  const isBonus = Math.random() < 0.15
  hearts.value.push({
    id: heartId.value++,
    emoji: isBonus ? bonusEmojis[Math.floor(Math.random() * bonusEmojis.length)] : emojis[Math.floor(Math.random() * emojis.length)],
    x: 5 + Math.random() * 80,
    size: isBonus ? 44 : 28 + Math.random() * 24,
    speed: 3 + Math.random() * 4,
    points: isBonus ? 5 : 1,
    isBonus,
    alive: true,
  })
  // Remove hearts that fall off screen
  hearts.value = hearts.value.filter(h => h.alive)
}

function catchHeart(h) {
  if (!h.alive) return
  h.alive = false
  score.value += h.points * (combo.value >= 3 ? 2 : 1)
  combo.value++
  if (combo.value > maxCombo.value) maxCombo.value = combo.value

  if (combo.value >= 5) {
    showComboText.value = `🔥 COMBO x${combo.value}!`
    setTimeout(() => { showComboText.value = '' }, 800)
  }

  hearts.value = hearts.value.filter(hh => hh.id !== h.id)
}

function missHeart(h) {
  if (!h.alive) return
  h.alive = false
  combo.value = 0
  hearts.value = hearts.value.filter(hh => hh.id !== h.id)
}

function endGame() {
  clearInterval(intervalId.value)
  clearInterval(timerInterval.value)
  gameStarted.value = false
  gameOver.value = true
  hearts.value = []
  if (score.value >= 30) {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } })
  }
}

function resetGame() {
  gameOver.value = false
}

onUnmounted(() => {
  clearInterval(intervalId.value)
  clearInterval(timerInterval.value)
})

const scoreRating = computed(() => {
  if (score.value >= 50) return { label: 'LUAR BIASA! 🏆', color: '#FFD700' }
  if (score.value >= 30) return { label: 'Bagus banget! 🎉', color: '#FF6B9D' }
  if (score.value >= 15) return { label: 'Lumayan nih~ 💕', color: '#C471ED' }
  return { label: 'Coba lagi ya~ 😄', color: '#FF9A9E' }
})

const timerColor = computed(() => {
  if (timeLeft.value > 15) return '#4CAF50'
  if (timeLeft.value > 7) return '#FF9800'
  return '#F44336'
})
</script>

<template>
  <div class="game-view">
    <!-- Header -->
    <div class="game-header">
      <h1 class="text-script">Tangkap Hati! 🎮</h1>
      <p>Tap semua hati yang jatuh sebelum waktu habis!</p>
    </div>

    <!-- Pre-game -->
    <div v-if="!gameStarted && !gameOver" class="pre-game">
      <div class="instruction-card">
        <div class="inst-icon">🫀</div>
        <h2>Cara Main</h2>
        <div class="inst-list">
          <div class="inst-item">
            <span>❤️</span>
            <span>Tap hati biasa = +1 poin</span>
          </div>
          <div class="inst-item">
            <span>⭐</span>
            <span>Tap bintang emas = +5 poin</span>
          </div>
          <div class="inst-item">
            <span>🔥</span>
            <span>Combo 3+ = poin x2!</span>
          </div>
          <div class="inst-item">
            <span>⏱️</span>
            <span>Waktu: 30 detik</span>
          </div>
        </div>
      </div>
      <button class="btn-primary start-btn" @click="startGame">
        🎮 Mulai Game!
      </button>
    </div>

    <!-- Game area -->
    <div v-if="gameStarted" class="game-arena">
      <!-- HUD -->
      <div class="game-hud">
        <div class="hud-item">
          <span class="hud-label">Skor</span>
          <span class="hud-value text-script">{{ score }}</span>
        </div>
        <div class="hud-timer" :style="{ color: timerColor }">
          <span class="hud-label">Waktu</span>
          <span class="hud-value-big">{{ timeLeft }}</span>
        </div>
        <div class="hud-item">
          <span class="hud-label">Combo</span>
          <span class="hud-value text-script">{{ combo }}</span>
        </div>
      </div>

      <!-- Combo text -->
      <Transition name="pop">
        <div v-if="showComboText" class="combo-popup">{{ showComboText }}</div>
      </Transition>

      <!-- Play field -->
      <div class="play-field">
        <TransitionGroup name="heart-fall">
          <div
            v-for="h in hearts"
            :key="h.id"
            class="falling-heart"
            :class="{ bonus: h.isBonus }"
            :style="{
              left: h.x + '%',
              fontSize: h.size + 'px',
              '--speed': h.speed + 's',
            }"
            @click="catchHeart(h)"
            @animationend="missHeart(h)"
          >{{ h.emoji }}</div>
        </TransitionGroup>

        <div class="tap-hint">Tap hati yang jatuh! 👆</div>
      </div>
    </div>

    <!-- Game over -->
    <div v-if="gameOver" class="game-over">
      <div class="go-emoji">{{ score >= 30 ? '🏆' : '💝' }}</div>
      <h2 class="text-script">Waktu Habis!</h2>

      <div class="go-score">
        <span class="go-score-num text-script">{{ score }}</span>
        <span class="go-score-label">poin</span>
      </div>

      <div class="go-rating" :style="{ color: scoreRating.color }">
        {{ scoreRating.label }}
      </div>

      <div class="go-stats">
        <div class="go-stat">
          <span class="go-stat-val">{{ maxCombo }}</span>
          <span class="go-stat-lbl">Max Combo</span>
        </div>
      </div>

      <div class="go-actions">
        <button class="btn-primary" @click="startGame">
          🔄 Main Lagi
        </button>
      </div>
    </div>

    <div style="height: 90px"></div>
  </div>
</template>

<style scoped>
.game-view { min-height: 100vh; }

.game-header {
  background: linear-gradient(135deg, #FF7F7F, #FF6B9D);
  padding: 50px 24px 32px;
  text-align: center;
  border-radius: 0 0 32px 32px;
}
.game-header h1 { font-size: 38px; color: white; margin-bottom: 6px; }
.game-header p { color: rgba(255,255,255,0.85); font-size: 14px; font-weight: 600; }

.pre-game {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  gap: 20px;
}

.instruction-card {
  background: white;
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 4px 20px rgba(196,113,237,0.15);
  width: 100%;
  text-align: center;
}
.inst-icon { font-size: 52px; margin-bottom: 12px; }
.instruction-card h2 { font-size: 22px; color: var(--dark); margin-bottom: 18px; }
.inst-list { display: flex; flex-direction: column; gap: 12px; text-align: left; }
.inst-item {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 15px;
  font-weight: 600;
  color: var(--dark);
}
.inst-item span:first-child { font-size: 24px; flex-shrink: 0; }
.start-btn { font-size: 18px; padding: 16px 48px; }

.game-arena { padding: 16px; }

.game-hud {
  background: white;
  border-radius: 20px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px rgba(196,113,237,0.12);
}
.hud-item { display: flex; flex-direction: column; align-items: center; }
.hud-label { font-size: 11px; color: #aaa; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.hud-value { font-size: 28px; color: var(--pink); line-height: 1.1; }
.hud-timer { display: flex; flex-direction: column; align-items: center; }
.hud-value-big { font-size: 40px; font-weight: 800; line-height: 1; font-family: var(--font-script); transition: color 0.3s; }

.combo-popup {
  position: fixed;
  top: 30%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--gradient-main);
  color: white;
  padding: 10px 24px;
  border-radius: 50px;
  font-size: 20px;
  font-weight: 800;
  z-index: 50;
  pointer-events: none;
  box-shadow: var(--shadow-love);
}

.play-field {
  background: linear-gradient(180deg, #FFF0F8 0%, #F3E5F5 100%);
  border-radius: 24px;
  height: 450px;
  position: relative;
  overflow: hidden;
  border: 2px dashed rgba(196,113,237,0.2);
}

.tap-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(196,113,237,0.5);
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
}

.falling-heart {
  position: absolute;
  cursor: pointer;
  user-select: none;
  animation: fallDown var(--speed) linear forwards;
  top: -50px;
  z-index: 10;
  transition: transform 0.1s;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}
.falling-heart:active { transform: scale(0.7); }
.falling-heart.bonus { filter: drop-shadow(0 0 8px gold); }

@keyframes fallDown {
  from { top: -60px; }
  to { top: 110%; }
}

.heart-fall-leave-active { transition: all 0.2s ease; }
.heart-fall-leave-to { opacity: 0; transform: scale(2); }

.game-over {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  gap: 16px;
  text-align: center;
}

.go-emoji { font-size: 80px; animation: bounce-in 0.8s ease; }
.game-over h2 { font-size: 40px; color: var(--dark); }

.go-score {
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.go-score-num { font-size: 72px; color: var(--pink); line-height: 1; }
.go-score-label { font-size: 24px; color: #ccc; }

.go-rating { font-size: 20px; font-weight: 700; }

.go-stats {
  display: flex;
  gap: 24px;
  background: white;
  border-radius: 20px;
  padding: 16px 32px;
  box-shadow: 0 2px 12px rgba(196,113,237,0.12);
}
.go-stat { display: flex; flex-direction: column; align-items: center; }
.go-stat-val { font-size: 32px; font-weight: 800; color: var(--purple); font-family: var(--font-script); }
.go-stat-lbl { font-size: 12px; color: #aaa; font-weight: 600; }

.go-actions { margin-top: 8px; }

.pop-enter-active { animation: bounce-in 0.4s ease; }
.pop-leave-active { transition: opacity 0.3s; }
.pop-leave-to { opacity: 0; }
</style>
