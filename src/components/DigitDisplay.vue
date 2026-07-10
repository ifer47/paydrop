<template>
  <span
    ref="groupRef"
    class="t-digit-group"
    :class="{ 'is-animating': animating }"
  >
    <span
      v-for="(ch, i) in digits"
      :key="`${displayKey}-${i}`"
      class="t-digit"
      :data-stagger="staggerFor(i)"
    >{{ ch }}</span>
  </span>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  value: { type: [String, Number], required: true },
  pad: { type: Boolean, default: true },
  padLength: { type: Number, default: 2 },
})

const groupRef = ref(null)
const animating = ref(false)
const digits = ref([])
const displayKey = ref(0)

function formatValue(val) {
  const str = String(val)
  return props.pad ? str.padStart(props.padLength, '0') : str
}

function staggerFor(i) {
  const len = digits.value.length
  if (i === len - 2) return '1'
  if (i === len - 1) return '2'
  return undefined
}

async function replay(val) {
  animating.value = false
  digits.value = formatValue(val).split('')
  displayKey.value++
  await nextTick()
  void groupRef.value?.offsetHeight
  animating.value = true
}

watch(() => props.value, (val) => {
  replay(val)
}, { immediate: true })
</script>
