import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollProgress() {
  const wrapperRef = ref(null)
  const progress = ref(0)

  function update() {
    const el = wrapperRef.value
    if (!el) return
    const rect = el.getBoundingClientRect()
    const scrollable = el.offsetHeight - window.innerHeight
    if (scrollable <= 0) return
    progress.value = Math.max(0, Math.min(1, -rect.top / scrollable))
  }

  onMounted(() => {
    window.addEventListener('scroll', update, { passive: true })
    update()
  })
  onUnmounted(() => window.removeEventListener('scroll', update))

  return { wrapperRef, progress }
}

// Helper: clamp + ease
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
export const mapRange = (v, inMin, inMax, outMin, outMax) => {
  const p = clamp((v - inMin) / (inMax - inMin), 0, 1)
  return outMin + (outMax - outMin) * p
}
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)
export const easeInOut = (t) => t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2
