import { ref, watch, onMounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const isDark = useLocalStorage('theme-dark', true)

export function useTheme() {
  function apply() {
    document.documentElement.classList.toggle('light-theme', !isDark.value)
  }

  function toggle() {
    isDark.value = !isDark.value
    apply()
  }

  onMounted(apply)
  watch(isDark, apply)

  return { isDark, toggle }
}
