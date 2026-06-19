<template>
  <div class="flex items-end gap-2.5 md:gap-4 justify-center">
    <template v-for="(unit, idx) in units" :key="unit.label">
      <div class="flex flex-col items-center gap-1.5">
        <div class="num-card rounded-lg min-w-[60px] md:min-w-[76px] h-[68px] md:h-[84px] relative overflow-hidden flex items-center justify-center">
          <div class="absolute top-0 left-1/2 -translate-x-1/2 w-2/5 h-px bg-gradient-to-r from-transparent via-vault-gold/50 to-transparent"></div>
          <Transition name="flip" mode="out-in">
            <div
              :key="unit.value"
              class="font-display text-[42px] md:text-5xl font-light tracking-tight leading-[0.82] select-none"
              :class="idx === 0 ? 'gold-text' : 'text-vault-text/90'"
            >
              {{ pad(unit.value) }}
            </div>
          </Transition>
          <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vault-border/60 to-transparent"></div>
        </div>
        <span class="font-body text-[10px] tracking-[0.25em] text-vault-muted/50 uppercase select-none">{{ unit.label }}</span>
      </div>

      <div
        v-if="idx < units.length - 1"
        class="flex flex-col gap-1.5 mb-7 opacity-30"
      >
        <div class="w-[3px] h-[3px] rounded-full bg-vault-gold animate-tick"></div>
        <div class="w-[3px] h-[3px] rounded-full bg-vault-gold animate-tick" style="animation-delay: 0.5s"></div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()

const props = defineProps({
  countdown: { type: Object, required: true },
  pad: { type: Function, required: true }
})

const units = computed(() => [
  { value: props.countdown.days, label: t('days') },
  { value: props.countdown.hours, label: t('hours') },
  { value: props.countdown.minutes, label: t('minutes') },
  { value: props.countdown.seconds, label: t('seconds') },
])
</script>

<style scoped>
.flip-enter-active {
  transition: transform 0.25s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.2s ease;
}
.flip-leave-active {
  transition: transform 0.15s ease-in, opacity 0.15s ease;
}
.flip-enter-from {
  transform: translateY(-14px);
  opacity: 0;
}
.flip-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
