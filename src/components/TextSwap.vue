<template>
  <span ref="elRef" class="t-text-swap" :class="phaseClass">
    {{ displayText }}
  </span>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
})

const elRef = ref(null)
const displayText = ref(props.text)
const phaseClass = ref('')

function getDur() {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--text-swap-dur')
  ) || 150
}

function swapText(next) {
  if (next === displayText.value) return
  phaseClass.value = 'is-exit'
  setTimeout(() => {
    displayText.value = next
    phaseClass.value = 'is-enter-start'
    void elRef.value?.offsetHeight
    phaseClass.value = ''
  }, getDur())
}

watch(() => props.text, swapText)

onMounted(() => {
  displayText.value = props.text
})
</script>
