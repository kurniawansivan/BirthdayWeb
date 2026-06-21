<script setup>
import { ref, computed, onMounted } from 'vue'

const totalImages = parseInt(import.meta.env.VITE_TOTAL_IMAGES || '9')
const partnerName = import.meta.env.VITE_PARTNER_NAME

const images = computed(() =>
  Array.from({ length: totalImages }, (_, i) => ({
    id: i + 1,
    src: `/images/image${i + 1}.jpg`,
    alt: `Foto ${i + 1} - ${partnerName}`,
  }))
)

const selectedImg = ref(null)
const loaded = ref({})
const likes = ref({})

function openPhoto(img) {
  selectedImg.value = img
}

function closePhoto() {
  selectedImg.value = null
}

function toggleLike(id) {
  likes.value[id] = !likes.value[id]
}

function onImgLoad(id) {
  loaded.value[id] = true
}
</script>

<template>
  <div class="gallery-view">
    <!-- Header -->
    <div class="gallery-header">
      <h1 class="text-script">Galeri Kita 📷</h1>
      <p>{{ totalImages }} foto penuh kenangan indah~</p>
    </div>

    <!-- Grid -->
    <div class="photo-grid">
      <div
        v-for="img in images"
        :key="img.id"
        class="photo-item"
        @click="openPhoto(img)"
      >
        <div v-if="!loaded[img.id]" class="shimmer photo-placeholder"></div>
        <img
          :src="img.src"
          :alt="img.alt"
          @load="onImgLoad(img.id)"
          :class="{ loaded: loaded[img.id] }"
          loading="lazy"
        />
        <button class="like-btn" @click.stop="toggleLike(img.id)">
          {{ likes[img.id] ? '❤️' : '🤍' }}
        </button>
        <div class="photo-overlay">
          <span>Foto {{ img.id }}</span>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Transition name="fade-quick">
      <div v-if="selectedImg" class="lightbox" @click.self="closePhoto">
        <div class="lightbox-content">
          <button class="close-btn" @click="closePhoto">✕</button>
          <img :src="selectedImg.src" :alt="selectedImg.alt" />
          <div class="lightbox-actions">
            <button class="like-big-btn" @click="toggleLike(selectedImg.id)">
              {{ likes[selectedImg.id] ? '❤️' : '🤍' }}
              {{ likes[selectedImg.id] ? 'Disukai!' : 'Suka' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <div style="height: 90px"></div>
  </div>
</template>

<style scoped>
.gallery-view {
  min-height: 100vh;
}

.gallery-header {
  background: linear-gradient(135deg, #FF6B9D, #C471ED);
  padding: 50px 24px 32px;
  text-align: center;
  border-radius: 0 0 32px 32px;
}
.gallery-header h1 {
  font-size: 38px;
  color: white;
  text-shadow: 0 2px 10px rgba(80,0,80,0.2);
  margin-bottom: 6px;
}
.gallery-header p {
  color: rgba(255,255,255,0.85);
  font-size: 14px;
  font-weight: 600;
}

.photo-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 16px;
}

.photo-item {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  aspect-ratio: 9/16;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(196,113,237,0.2);
  background: #f8e8f8;
  transition: transform 0.2s ease;
}

.photo-item:active { transform: scale(0.97); }

.photo-placeholder {
  position: absolute;
  inset: 0;
  border-radius: 16px;
}

.photo-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  opacity: 0;
  transition: opacity 0.4s ease;
}
.photo-item img.loaded { opacity: 1; }

.photo-overlay {
  position: absolute;
  bottom: 0;
  left: 0; right: 0;
  background: linear-gradient(transparent, rgba(0,0,0,0.4));
  padding: 20px 10px 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.photo-item:hover .photo-overlay { opacity: 1; }
.photo-overlay span {
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.like-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255,255,255,0.85);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 18px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
  z-index: 2;
}
.like-btn:active { transform: scale(1.3); }

.lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.lightbox-content {
  position: relative;
  max-width: 380px;
  width: 100%;
}

.lightbox-content img {
  width: 100%;
  border-radius: 20px;
  object-fit: contain;
  max-height: 75vh;
}

.close-btn {
  position: absolute;
  top: -44px;
  right: 0;
  background: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--dark);
}

.lightbox-actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.like-big-btn {
  background: var(--gradient-main);
  color: white;
  border: none;
  border-radius: 50px;
  padding: 12px 28px;
  font-size: 16px;
  font-family: var(--font-body);
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-love);
}

.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity 0.3s; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
</style>
