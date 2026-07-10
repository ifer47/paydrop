import { ref, watch, onUnmounted } from 'vue'

function getCloseMs() {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--modal-close-dur')
  ) || 150
}

export function useModalTransition(showRef) {
  const visible = ref(false)
  const isOpen = ref(false)
  const isClosing = ref(false)
  let closeTimer = null

  watch(showRef, (val) => {
    if (val) {
      clearTimeout(closeTimer)
      isClosing.value = false
      visible.value = true
      requestAnimationFrame(() => { isOpen.value = true })
    } else if (visible.value) {
      isOpen.value = false
      isClosing.value = true
      closeTimer = setTimeout(() => {
        isClosing.value = false
        visible.value = false
      }, getCloseMs())
    }
  }, { immediate: true })

  onUnmounted(() => clearTimeout(closeTimer))

  return { visible, isOpen, isClosing }
}
