<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useScrollProgress, mapRange } from '../composables/useScrollProgress.js'

const total = parseInt(import.meta.env.VITE_TOTAL_IMAGES || '9')
const { wrapperRef, progress: p } = useScrollProgress()

const loaded = ref({})
const likes  = ref({})

// Which photo is active (0-indexed)
const activeIdx = computed(() =>
  Math.round(mapRange(p.value, 0.05, 0.95, 0, total - 1))
)

// For crossfade: track prev idx to animate
const prevIdx = ref(0)
const transitioning = ref(false)

watch(activeIdx, async (newVal, oldVal) => {
  if (newVal !== oldVal) {
    prevIdx.value = oldVal
    transitioning.value = true
    setTimeout(() => { transitioning.value = false }, 400)
  }
  // Cached images don't fire @load — check complete flag after DOM update
  await nextTick()
  if (!loaded.value[newVal]) {
    const img = document.querySelector('.photo-slot.active img')
    if (img?.complete && img.naturalWidth > 0) loaded.value[newVal] = true
  }
}, { immediate: true })

// Entrance opacity (fade in at top, fade out near bottom)
const sectionOpacity = computed(() =>
  Math.min(mapRange(p.value, 0, 0.04, 0, 1), mapRange(p.value, 0.97, 1, 1, 0))
)

function photoSrc(i) { return `/images/image${i + 1}.jpg` }
function onLoad(i) { loaded.value[i] = true }
</script>

<template>
  <div class="gallery-wrapper" ref="wrapperRef">
    <div class="sticky-frame" :style="{ opacity: sectionOpacity }">

      <!-- Title -->
      <div class="g-header">
        <h2 class="text-script">Foto Kita 📷</h2>
        <div class="g-counter">{{ activeIdx + 1 }} / {{ total }}</div>
      </div>

      <!-- Photo stage -->
      <div class="photo-stage">
        <!-- Previous photo (fades out) -->
        <div
          class="photo-slot"
          :class="{ fading: transitioning }"
          :key="'prev-' + prevIdx"
        >
          <img :src="photoSrc(prevIdx)" @load="onLoad(prevIdx)" :style="{ opacity: loaded[prevIdx] ? 1 : 0 }" />
        </div>

        <!-- Active photo (fades in) -->
        <div class="photo-slot active" :key="'active-' + activeIdx">
          <img :src="photoSrc(activeIdx)" @load="onLoad(activeIdx)" :style="{ opacity: loaded[activeIdx] ? 1 : 0 }" />
          <button
            class="like-btn"
            @click.stop="likes[activeIdx] = !likes[activeIdx]"
            :class="{ liked: likes[activeIdx] }"
          >{{ likes[activeIdx] ? '❤️' : '🤍' }}</button>
        </div>
      </div>

      <!-- Dots -->
      <div class="g-dots">
        <span
          v-for="i in total"
          :key="i"
          class="dot"
          :class="{ active: i - 1 === activeIdx }"
        ></span>
      </div>

      <!-- Scroll nudge -->
      <div class="scroll-nudge" :style="{ opacity: p < 0.08 ? 1 : 0 }">
        scroll untuk lihat foto~
      </div>
    </div>
  </div>
</template>

<style scoped>
.gallery-wrapper {
  height: 350vh;
  position: relative;
}

.sticky-frame {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  background: #FFF0FA;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
  border-radius: 40px 40px 0 0;
  will-change: opacity;
}

.g-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: min(320px, 88vw);
  padding: 0 4px;
}
.g-header h2 { font-size: 30px; color: var(--dark); }
.g-counter {
  font-size: 13px;
  font-weight: 700;
  color: var(--pink);
  background: rgba(255,107,157,0.1);
  border-radius: 50px;
  padding: 4px 12px;
}

/* Photo display */
.photo-stage {
  position: relative;
  width: min(260px, 70vw);
  aspect-ratio: 9/16;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 16px 48px rgba(196,113,237,0.3);
}

.photo-slot {
  position: absolute;
  inset: 0;
  border-radius: 22px;
  overflow: hidden;
  transition: opacity 0.4s ease;
  opacity: 0;
}
.photo-slot img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
  transition: opacity 0.3s;
}
.photo-slot.active { opacity: 1; }
.photo-slot.fading { opacity: 0; }

.like-btn {
  position: absolute;
  top: 10px; right: 10px;
  background: rgba(255,255,255,0.9);
  border: none;
  border-radius: 50%;
  width: 40px; height: 40px;
  font-size: 20px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform .2s ease;
}
.like-btn:active { transform: scale(1.35); }
.like-btn.liked { animation: bounce-in .4s ease; }

.g-dots {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: min(280px, 80vw);
}
.dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #E0C0F0;
  transition: all .3s ease;
}
.dot.active {
  width: 20px;
  border-radius: 10px;
  background: var(--pink);
}

.scroll-nudge {
  font-size: 13px;
  font-weight: 600;
  color: #ccc;
  transition: opacity .4s;
}
</style>
