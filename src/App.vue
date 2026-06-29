<script setup>
import FloatingHearts from './components/FloatingHearts.vue'
import HeroSection from './sections/HeroSection.vue'
import GallerySection from './sections/GallerySection.vue'
import TimelineSection from './sections/TimelineSection.vue'
import LetterSection from './sections/LetterSection.vue'
import QuizSection from './sections/QuizSection.vue'
import WishesSection from './sections/WishesSection.vue'
import SurpriseSection from './sections/SurpriseSection.vue'
</script>

<template>
  <div class="page-wrapper">
    <FloatingHearts />
    <HeroSection />
    <GallerySection />
    <TimelineSection />
    <LetterSection />
    <QuizSection />
    <WishesSection />
    <SurpriseSection />
  </div>
</template>

<style>
/* overflow-x hidden on body, NOT wrapper — sticky breaks if wrapper has overflow */
body { overflow-x: clip; }

.page-wrapper {
  max-width: 430px;
  margin: 0 auto;
  position: relative;
}
</style>
