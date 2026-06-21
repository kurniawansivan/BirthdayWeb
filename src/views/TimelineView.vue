<script setup>
import { ref, onMounted, computed } from 'vue'

const partnerName = import.meta.env.VITE_PARTNER_NAME
const yourName = import.meta.env.VITE_YOUR_NAME
const startDate = import.meta.env.VITE_RELATIONSHIP_START_DATE
const specialPlace = import.meta.env.VITE_SPECIAL_PLACE

const daysTogether = computed(() => {
  const start = new Date(startDate)
  const now = new Date()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
})

const events = ref([
  {
    id: 1,
    emoji: '💫',
    title: 'Pertama Kali Ketemu',
    desc: `Hari itu kita pertama bertemu dan sejak saat itu semuanya berbeda~`,
    date: 'Awal kisah kita',
    color: '#FF9A9E',
  },
  {
    id: 2,
    emoji: '📱',
    title: 'Pertama Chat',
    desc: 'Chat pertama yang bikin deg-degan nungguin balasannya~',
    date: 'Satu langkah kecil',
    color: '#C471ED',
  },
  {
    id: 3,
    emoji: '🌟',
    title: 'Jadian!',
    desc: `${partnerName} jadi orang paling spesial di hidupku sejak hari itu!`,
    date: 'Hari paling bahagia',
    color: '#FF6B9D',
  },
  {
    id: 4,
    emoji: '🌅',
    title: 'Kencan Pertama',
    desc: `Pertama kali jalan bareng di ${specialPlace}. Nervous banget tapi indah~`,
    date: 'Momen tak terlupakan',
    color: '#FFB347',
  },
  {
    id: 5,
    emoji: '🎂',
    title: `Ulang Tahun ${partnerName}`,
    desc: 'Dan sekarang, kita rayakan hari spesialmu bersama! 🎉',
    date: 'Hari ini!',
    color: '#FFD700',
    highlight: true,
  },
])

const visible = ref(new Set())

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        visible.value.add(parseInt(e.target.dataset.id))
      }
    })
  }, { threshold: 0.3 })

  document.querySelectorAll('[data-id]').forEach(el => observer.observe(el))
})
</script>

<template>
  <div class="timeline-view">
    <!-- Header -->
    <div class="timeline-header">
      <h1 class="text-script">Perjalanan Kita 💑</h1>
      <p>{{ daysTogether }} hari penuh cinta bersama~ ❤️</p>
    </div>

    <!-- Days counter -->
    <div class="days-badge">
      <span class="days-num text-script">{{ daysTogether }}</span>
      <span class="days-label">hari bersama</span>
      <span class="pulse" style="font-size:24px;display:inline-block">❤️</span>
    </div>

    <!-- Timeline -->
    <div class="timeline">
      <div class="timeline-line"></div>

      <div
        v-for="(event, i) in events"
        :key="event.id"
        :data-id="event.id"
        class="timeline-item"
        :class="{ visible: visible.has(event.id), right: i % 2 === 0, highlight: event.highlight }"
        :style="{ '--event-color': event.color }"
      >
        <div class="timeline-dot">
          <span class="dot-emoji">{{ event.emoji }}</span>
        </div>

        <div class="event-card">
          <div class="event-date">{{ event.date }}</div>
          <h3 class="event-title">{{ event.title }}</h3>
          <p class="event-desc">{{ event.desc }}</p>
        </div>
      </div>
    </div>

    <!-- Love note -->
    <div class="love-note">
      <div class="ln-emoji">💕</div>
      <p class="text-script">Terima kasih sudah jadi bagian dari hidupku, {{ partnerName }}. Setiap hari bersamamu adalah hadiah terbaik.</p>
      <div class="ln-sig">— {{ yourName }}</div>
    </div>

    <div style="height: 90px"></div>
  </div>
</template>

<style scoped>
.timeline-view { min-height: 100vh; }

.timeline-header {
  background: linear-gradient(135deg, #9B59B6, #C471ED);
  padding: 50px 24px 32px;
  text-align: center;
  border-radius: 0 0 32px 32px;
}
.timeline-header h1 { font-size: 38px; color: white; margin-bottom: 6px; }
.timeline-header p { color: rgba(255,255,255,0.85); font-size: 15px; font-weight: 600; }

.days-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: white;
  border-radius: 20px;
  margin: 20px 16px 0;
  padding: 18px 24px;
  box-shadow: 0 4px 20px rgba(196,113,237,0.15);
}
.days-num { font-size: 52px; color: var(--pink); line-height: 1; }
.days-label { font-size: 18px; font-weight: 700; color: var(--dark); }

.timeline {
  padding: 32px 16px;
  position: relative;
}

.timeline-line {
  position: absolute;
  left: 50%;
  top: 0; bottom: 0;
  width: 2px;
  background: linear-gradient(180deg, transparent, var(--light-pink) 10%, var(--pink) 50%, var(--purple), transparent);
  transform: translateX(-50%);
}

.timeline-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 28px;
  opacity: 0;
  transform: translateX(-40px);
  transition: all 0.6s ease;
}
.timeline-item.right {
  flex-direction: row-reverse;
  transform: translateX(40px);
}
.timeline-item.visible {
  opacity: 1;
  transform: translateX(0);
}

.timeline-dot {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: white;
  border: 3px solid var(--event-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  position: relative;
  z-index: 1;
}
.dot-emoji { font-size: 24px; }

.event-card {
  flex: 1;
  background: white;
  border-radius: 18px;
  padding: 16px 18px;
  box-shadow: 0 3px 15px rgba(196,113,237,0.12);
  border-left: 4px solid var(--event-color);
}
.timeline-item.right .event-card {
  border-left: none;
  border-right: 4px solid var(--event-color);
  text-align: right;
}

.event-date {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--event-color);
  font-weight: 700;
  margin-bottom: 4px;
}
.event-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 6px;
}
.event-desc {
  font-size: 13px;
  color: #888;
  line-height: 1.5;
}

.timeline-item.highlight .event-card {
  background: linear-gradient(135deg, #FFF0F8, #F3E5F5);
  border-color: var(--gold);
  box-shadow: 0 4px 20px rgba(255,215,0,0.2);
}
.timeline-item.highlight .event-title { color: var(--hot-pink); }

.love-note {
  margin: 8px 16px 24px;
  background: linear-gradient(135deg, #FFF0F8, #F3E5F5);
  border-radius: 24px;
  padding: 28px 24px;
  text-align: center;
  border: 2px dashed rgba(196,113,237,0.3);
}
.ln-emoji { font-size: 40px; margin-bottom: 12px; }
.love-note p {
  font-size: 20px;
  color: var(--dark);
  line-height: 1.6;
  margin-bottom: 12px;
}
.ln-sig {
  font-style: italic;
  color: var(--pink);
  font-weight: 600;
  font-family: var(--font-script);
  font-size: 20px;
}
</style>
