import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal(threshold = 0.18) {
  const el = ref(null)
  const visible = ref(false)
  let observer = null

  onMounted(() => {
    if (!el.value) return
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          visible.value = true
          observer.unobserve(el.value)
        }
      },
      { threshold }
    )
    observer.observe(el.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { el, visible }
}

export function useScrollRevealItems(threshold = 0.1) {
  const containerEl = ref(null)
  const visibleItems = ref(new Set())

  onMounted(() => {
    if (!containerEl.value) return
    const items = containerEl.value.querySelectorAll('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            visibleItems.value.add(e.target.dataset.reveal)
            observer.unobserve(e.target)
          }
        })
      },
      { threshold }
    )
    items.forEach(item => observer.observe(item))
  })

  return { containerEl, visibleItems }
}
