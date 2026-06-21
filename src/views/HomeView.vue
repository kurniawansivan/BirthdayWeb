<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = import.meta.env.VITE_PARTNER_NAME
const yourName = import.meta.env.VITE_YOUR_NAME
const age = import.meta.env.VITE_PARTNER_AGE
const birthdayDate = import.meta.env.VITE_BIRTHDAY_DATE
const mainMessage = import.meta.env.VITE_MAIN_MESSAGE
const startDate = import.meta.env.VITE_RELATIONSHIP_START_DATE
const specialPlace = import.meta.env.VITE_SPECIAL_PLACE

const daysTogetherCount = computed(() => {
  const start = new Date(startDate)
  const now = new Date()
  const diff = Math.floor((now - start) / (1000 * 60 * 60 * 24))
  return diff > 0 ? diff : 0
})

const features = [
  { path: '/galeri', icon: '📷', title: 'Galeri Foto', desc: 'Momen-momen indah kita', color: '#FF6B9D' },
  { path: '/kuis', icon: '💡', title: 'Kuis Cinta', desc: 'Seberapa kamu kenalku?', color: '#C471ED' },
  { path: '/game', icon: '🎮', title: 'Mini Game', desc: 'Tangkap hati yang terbang!', color: '#FF7F7F' },
  { path: '/perjalanan', icon: '💑', title: 'Perjalanan Kita', desc: 'Kisah cinta kita bersama', color: '#9B59B6' },
  { path: '/surat', icon: '💌', title: 'Surat Cinta', desc: 'Pesan spesial dariku', color: '#FF6B9D' },
  { path: '/kejutan', icon: '🎁', title: 'Kejutan!', desc: 'Ada yang spesial untukmu~', color: '#FFB6C1' },
]

const visible = ref(false)
onMounted(() => {
  setTimeout(() => { visible.value = true }, 100)
})
</script>

<template>
  <div class="home-view">
    <!-- Header hero -->
    <div class="hero-section">
      <div class="hero-bg-orbs">
        <div class="orb o1"></div>
        <div class="orb o2"></div>
      </div>

      <div class="hero-content" :class="{ visible }">
        <div class="greeting-badge">🎉 Hari Spesialmu! 🎉</div>

        <h1 class="hero-title text-script">
          Hei, {{ name }}!
        </h1>
        <p class="hero-subtitle">{{ mainMessage }}</p>

        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-number text-script">{{ age }}</span>
            <span class="stat-label">Tahun</span>
          </div>
          <div class="stat-divider">💕</div>
          <div class="stat-card">
            <span class="stat-number text-script">{{ daysTogetherCount }}</span>
            <span class="stat-label">Hari Bersama</span>
          </div>
        </div>

        <div class="birthday-date">
          📅 {{ birthdayDate }} • 📍 {{ specialPlace }}
        </div>
      </div>
    </div>

    <!-- Section title -->
    <div class="section-header">
      <h2 class="text-script">Ada apa hari ini?</h2>
      <p>Pilih yang mau kamu buka dulu~ 🥰</p>
    </div>

    <!-- Feature grid -->
    <div class="features-grid">
      <div
        v-for="(feat, i) in features"
        :key="feat.path"
        class="feature-card"
        :style="{ '--card-color': feat.color, animationDelay: (i * 0.08) + 's' }"
        @click="router.push(feat.path)"
      >
        <div class="feat-icon">{{ feat.icon }}</div>
        <div class="feat-info">
          <h3>{{ feat.title }}</h3>
          <p>{{ feat.desc }}</p>
        </div>
        <div class="feat-arrow">›</div>
      </div>
    </div>

    <div class="bottom-message">
      <p>Dibuat dengan <span class="pulse" style="display:inline-block">❤️</span> oleh {{ yourName }}</p>
    </div>

    <div style="height: 90px"></div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(160deg, #FF9ADE 0%, #C471ED 60%, #9B59B6 100%);
  padding: 50px 24px 40px;
  position: relative;
  overflow: hidden;
  border-radius: 0 0 40px 40px;
}

.hero-bg-orbs { position: absolute; inset: 0; pointer-events: none; }
.orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0.15;
}
.o1 { width: 250px; height: 250px; background: white; top: -80px; right: -60px; }
.o2 { width: 150px; height: 150px; background: #FFE4F3; bottom: 10px; left: -40px; }

.hero-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.7s ease;
}
.hero-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.greeting-badge {
  display: inline-block;
  background: rgba(255,255,255,0.25);
  border: 1px solid rgba(255,255,255,0.4);
  color: white;
  border-radius: 50px;
  padding: 6px 18px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero-title {
  font-size: 46px;
  color: white;
  text-shadow: 0 2px 15px rgba(80,0,80,0.25);
  margin-bottom: 8px;
}

.hero-subtitle {
  color: rgba(255,255,255,0.9);
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.stat-card {
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 16px;
  padding: 12px 20px;
  text-align: center;
  flex: 1;
}

.stat-number {
  display: block;
  font-size: 36px;
  color: white;
  font-weight: 700;
  line-height: 1;
}

.stat-label {
  font-size: 12px;
  color: rgba(255,255,255,0.8);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-divider { font-size: 24px; flex-shrink: 0; }

.birthday-date {
  color: rgba(255,255,255,0.8);
  font-size: 13px;
  font-weight: 600;
}

.section-header {
  padding: 28px 24px 8px;
}
.section-header h2 {
  font-size: 28px;
  color: var(--dark);
  margin-bottom: 4px;
}
.section-header p {
  color: #888;
  font-size: 14px;
}

.features-grid {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-card {
  background: white;
  border-radius: 20px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(196,113,237,0.12);
  animation: slide-up 0.5s ease both;
  border-left: 4px solid var(--card-color);
}

.feature-card:active {
  transform: scale(0.98);
  box-shadow: 0 4px 20px rgba(196,113,237,0.25);
}

.feat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.feat-info {
  flex: 1;
}
.feat-info h3 {
  font-size: 16px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 2px;
}
.feat-info p {
  font-size: 13px;
  color: #999;
}

.feat-arrow {
  font-size: 24px;
  color: var(--card-color);
  font-weight: 700;
}

.bottom-message {
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
}
</style>
