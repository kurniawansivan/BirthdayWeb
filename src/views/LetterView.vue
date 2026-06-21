<script setup>
import { ref, computed, onMounted } from 'vue'

const partnerName = import.meta.env.VITE_PARTNER_NAME
const yourName = import.meta.env.VITE_YOUR_NAME
const rawLetter = import.meta.env.VITE_LOVE_LETTER || ''

const paragraphs = computed(() => rawLetter.split('|||').filter(p => p.trim()))

const opened = ref(false)
const revealed = ref(0)
const fullRevealed = ref(false)

function openLetter() {
  opened.value = true
  revealNextParagraph()
}

function revealNextParagraph() {
  if (revealed.value < paragraphs.value.length) {
    setTimeout(() => {
      revealed.value++
      if (revealed.value < paragraphs.value.length) {
        revealNextParagraph()
      } else {
        fullRevealed.value = true
      }
    }, 800)
  }
}

const scrollTop = ref(false)
onMounted(() => {
  window.addEventListener('scroll', () => {
    scrollTop.value = window.scrollY > 200
  })
})
</script>

<template>
  <div class="letter-view">
    <!-- Header -->
    <div class="letter-header">
      <h1 class="text-script">Surat Cinta 💌</h1>
      <p>Untukmu, dari hatiku~</p>
    </div>

    <!-- Envelope (pre-open) -->
    <Transition name="fade">
      <div v-if="!opened" class="envelope-section">
        <div class="envelope" @click="openLetter">
          <div class="envelope-top">
            <div class="flap">💌</div>
          </div>
          <div class="envelope-body">
            <div class="seal pulse">❤️</div>
            <p class="env-to">Kepada: {{ partnerName }}</p>
            <p class="env-from">Dari: {{ yourName }} 💕</p>
          </div>
        </div>
        <p class="tap-hint-text">Tap amplop untuk membuka surat~ 💌</p>
      </div>
    </Transition>

    <!-- Letter content -->
    <Transition name="letter-open">
      <div v-if="opened" class="letter-content">
        <!-- Letter paper -->
        <div class="letter-paper">
          <div class="paper-header">
            <span class="sparkle">✨</span>
            <h2 class="text-script">Untuk {{ partnerName }} Tercinta</h2>
            <span class="sparkle" style="animation-delay: 0.7s">✨</span>
          </div>

          <div class="letter-body">
            <TransitionGroup name="para-reveal">
              <p
                v-for="(para, i) in paragraphs.slice(0, revealed)"
                :key="i"
                class="para"
              >{{ para }}</p>
            </TransitionGroup>

            <!-- Typing indicator -->
            <div v-if="revealed < paragraphs.length" class="typing-dots">
              <span></span><span></span><span></span>
            </div>
          </div>

          <Transition name="fade">
            <div v-if="fullRevealed" class="letter-footer">
              <div class="footer-hearts">
                <span v-for="i in 5" :key="i" :style="{ animationDelay: (i*0.2)+'s' }">💕</span>
              </div>
              <p class="sign-off text-script">Dengan sepenuh cinta,</p>
              <p class="signature text-script">{{ yourName }}</p>
              <div class="seal-bottom">💝</div>
            </div>
          </Transition>
        </div>

        <!-- Decoration stickers -->
        <div class="sticker s1">🌸</div>
        <div class="sticker s2">💫</div>
        <div class="sticker s3">🦋</div>
      </div>
    </Transition>

    <div style="height: 90px"></div>
  </div>
</template>

<style scoped>
.letter-view { min-height: 100vh; }

.letter-header {
  background: linear-gradient(135deg, #FF6B9D, #FF1493);
  padding: 50px 24px 32px;
  text-align: center;
  border-radius: 0 0 32px 32px;
}
.letter-header h1 { font-size: 38px; color: white; margin-bottom: 6px; }
.letter-header p { color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 600; }

.envelope-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  gap: 24px;
}

.envelope {
  width: 280px;
  cursor: pointer;
  filter: drop-shadow(0 8px 24px rgba(255, 107, 157, 0.4));
  transition: transform 0.3s ease;
  animation: pulse-love 2s ease-in-out infinite;
}
.envelope:active { transform: scale(0.95); }

.envelope-top {
  width: 100%;
  height: 120px;
  background: linear-gradient(135deg, #FF6B9D, #FF1493);
  border-radius: 12px 12px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}
.flap { font-size: 56px; }

.envelope-body {
  background: #FFF0F8;
  border: 2px solid #FFB6C1;
  border-top: none;
  border-radius: 0 0 12px 12px;
  padding: 20px;
  text-align: center;
}
.seal { font-size: 36px; margin-bottom: 10px; }
.env-to { font-family: var(--font-script); font-size: 20px; color: var(--dark); }
.env-from { font-size: 14px; color: var(--pink); font-weight: 600; margin-top: 4px; }

.tap-hint-text { color: #aaa; font-size: 14px; font-weight: 600; }

.letter-content {
  padding: 20px 16px;
  position: relative;
}

.letter-paper {
  background: #FFFDF9;
  border-radius: 24px;
  padding: 28px 24px;
  box-shadow: 0 4px 20px rgba(196,113,237,0.15);
  border: 1px solid rgba(255, 182, 193, 0.4);
  background-image: repeating-linear-gradient(
    transparent,
    transparent 31px,
    rgba(255, 182, 193, 0.15) 31px,
    rgba(255, 182, 193, 0.15) 32px
  );
  line-height: 32px;
}

.paper-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px dashed rgba(255, 107, 157, 0.3);
}
.paper-header h2 { font-size: 26px; color: var(--hot-pink); }

.letter-body {
  min-height: 100px;
}

.para {
  font-size: 16px;
  color: var(--dark);
  line-height: 1.9;
  margin-bottom: 16px;
  font-weight: 500;
}

.typing-dots {
  display: flex;
  gap: 6px;
  padding: 8px 0;
}
.typing-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--pink);
  animation: dot-pulse 1.4s ease-in-out infinite;
}
.typing-dots span:nth-child(2) { animation-delay: 0.2s; }
.typing-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes dot-pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

.letter-footer {
  text-align: center;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 2px dashed rgba(255, 107, 157, 0.3);
}
.footer-hearts { font-size: 22px; margin-bottom: 12px; display: flex; justify-content: center; gap: 4px; }
.footer-hearts span { animation: pulse-love 1.5s ease-in-out infinite; }
.sign-off { font-size: 18px; color: #888; margin-bottom: 4px; }
.signature { font-size: 36px; color: var(--hot-pink); }
.seal-bottom { font-size: 40px; margin-top: 12px; }

.sticker {
  position: absolute;
  font-size: 32px;
  animation: sparkle 2s ease-in-out infinite;
}
.s1 { top: 10px; right: 10px; animation-delay: 0s; }
.s2 { bottom: 100px; left: 5px; animation-delay: 0.7s; }
.s3 { bottom: 150px; right: 5px; animation-delay: 1.3s; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.letter-open-enter-active { animation: slide-up 0.6s ease; }

.para-reveal-enter-active { animation: slide-up 0.5s ease; }
</style>
