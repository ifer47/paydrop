import { ref, onMounted, onUnmounted } from 'vue'

const MAX_TILT = 12

export function useCardTilt(tiltRef, cardRef) {
  const isHover = ref(false)
  const isTilting = ref(false)

  function reset() {
    const tilt = tiltRef.value
    const card = cardRef.value
    if (!tilt || !card) return
    isHover.value = false
    isTilting.value = false
    card.style.setProperty('--tilt-rx', '0deg')
    card.style.setProperty('--tilt-ry', '0deg')
  }

  function track(e) {
    const tilt = tiltRef.value
    const card = cardRef.value
    if (!tilt || !card) return

    const r = tilt.getBoundingClientRect()
    const px = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width))
    const py = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))

    isHover.value = true
    isTilting.value = true
    card.style.setProperty('--tilt-ry', ((px - 0.5) * MAX_TILT).toFixed(2) + 'deg')
    card.style.setProperty('--tilt-rx', ((0.5 - py) * MAX_TILT).toFixed(2) + 'deg')
    card.style.setProperty('--tilt-gx', (px * 100).toFixed(1) + '%')
    card.style.setProperty('--tilt-gy', (py * 100).toFixed(1) + '%')
  }

  function onPointerDown(e) {
    if (e.pointerType !== 'mouse') {
      try { tiltRef.value?.setPointerCapture(e.pointerId) } catch (_) {}
    }
  }

  function onPointerLeave(e) {
    if (e.pointerType === 'mouse') reset()
  }

  onMounted(() => {
    const tilt = tiltRef.value
    if (!tilt) return
    tilt.addEventListener('pointerdown', onPointerDown)
    tilt.addEventListener('pointermove', track)
    tilt.addEventListener('pointerup', reset)
    tilt.addEventListener('pointercancel', reset)
    tilt.addEventListener('pointerleave', onPointerLeave)
  })

  onUnmounted(() => {
    const tilt = tiltRef.value
    if (!tilt) return
    tilt.removeEventListener('pointerdown', onPointerDown)
    tilt.removeEventListener('pointermove', track)
    tilt.removeEventListener('pointerup', reset)
    tilt.removeEventListener('pointercancel', reset)
    tilt.removeEventListener('pointerleave', onPointerLeave)
  })

  return { isHover, isTilting }
}
