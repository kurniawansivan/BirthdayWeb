import { createRouter, createWebHistory } from 'vue-router'
import SplashView from '../views/SplashView.vue'
import HomeView from '../views/HomeView.vue'
import GalleryView from '../views/GalleryView.vue'
import QuizView from '../views/QuizView.vue'
import GameView from '../views/GameView.vue'
import TimelineView from '../views/TimelineView.vue'
import LetterView from '../views/LetterView.vue'
import SurpriseView from '../views/SurpriseView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: SplashView },
    { path: '/home', component: HomeView },
    { path: '/galeri', component: GalleryView },
    { path: '/kuis', component: QuizView },
    { path: '/game', component: GameView },
    { path: '/perjalanan', component: TimelineView },
    { path: '/surat', component: LetterView },
    { path: '/kejutan', component: SurpriseView },
  ]
})

export default router
