<template>
  <div class="relative flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`" class="absolute top-0 left-0 -rotate-90">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" :stop-color="gradStops[0]" />
          <stop offset="50%" :stop-color="gradStops[1]" />
          <stop offset="100%" :stop-color="gradStops[2]" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle
        :cx="center" :cy="center" :r="radius"
        fill="none"
        stroke="var(--v-ring-track)"
        :stroke-width="strokeWidth"
      />

      <g v-for="i in 30" :key="i">
        <line
          :x1="center + (radius - strokeWidth/2 - 2) * Math.cos((i - 1) * 12 * Math.PI / 180 - Math.PI/2)"
          :y1="center + (radius - strokeWidth/2 - 2) * Math.sin((i - 1) * 12 * Math.PI / 180 - Math.PI/2)"
          :x2="center + (radius + strokeWidth/2 + 2) * Math.cos((i - 1) * 12 * Math.PI / 180 - Math.PI/2)"
          :y2="center + (radius + strokeWidth/2 + 2) * Math.sin((i - 1) * 12 * Math.PI / 180 - Math.PI/2)"
          :stroke="(i - 1) / 30 <= progress ? tickOn : tickOff"
          stroke-width="1"
        />
      </g>

      <circle
        :cx="center" :cy="center" :r="radius"
        fill="none"
        stroke="url(#goldGradient)"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        stroke-linecap="round"
        filter="url(#glow)"
        style="transition: stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)"
      />

      <circle
        v-if="progress > 0.01"
        :cx="dotX" :cy="dotY" r="4"
        :fill="gradStops[1]"
        filter="url(#glow)"
      />
    </svg>

    <div class="flex flex-col items-center justify-center z-10">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'

const props = defineProps({
  progress: { type: Number, default: 0 },
  size: { type: Number, default: 260 },
  strokeWidth: { type: Number, default: 6 },
})

const center = computed(() => props.size / 2)
const radius = computed(() => (props.size - props.strokeWidth * 2 - 20) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => circumference.value * (1 - props.progress))

const dotAngle = computed(() => props.progress * 2 * Math.PI - Math.PI / 2)
const dotX = computed(() => center.value + radius.value * Math.cos(dotAngle.value))
const dotY = computed(() => center.value + radius.value * Math.sin(dotAngle.value))

function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

const gradStops = ref(['#8a6d2a', '#f0d080', '#c9a84c'])
const tickOn = ref('rgba(201,168,76,0.4)')
const tickOff = ref('rgba(201,168,76,0.08)')

function updateColors() {
  const gd = getCssVar('--v-gold-dark')
  const gl = getCssVar('--v-gold-light')
  const g = getCssVar('--v-gold')
  if (gd && gl && g) {
    gradStops.value = [`rgb(${gd})`, `rgb(${gl})`, `rgb(${g})`]
    tickOn.value = `rgb(${g} / 0.4)`
    tickOff.value = `rgb(${g} / 0.08)`
  }
}

onMounted(() => {
  updateColors()
  const observer = new MutationObserver(() => updateColors())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})
</script>
