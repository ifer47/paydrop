<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-black/80 backdrop-blur-sm t-modal-backdrop"
        :class="{ 'is-open': isOpen, 'is-closing': isClosing }"
        @click="emit('close')"
      ></div>

      <div
        class="vault-panel relative rounded-xl p-5 w-full max-w-xs shadow-2xl t-modal"
        :class="{ 'is-open': isOpen, 'is-closing': isClosing }"
      >
        <div class="absolute top-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-vault-gold/60 to-transparent"></div>

        <div class="text-center mb-4">
          <div class="text-vault-gold/60 text-[9px] font-body tracking-[0.3em] uppercase mb-1">{{ t('setupSubtitle') }}</div>
          <h2 class="font-display text-xl gold-text">{{ t('setupTitle') }}</h2>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-body tracking-[0.15em] text-vault-muted uppercase mb-1">{{ t('nameLabel') }}</label>
            <input
              v-model="form.name"
              type="text"
              :placeholder="t('namePlaceholder')"
              class="input-vault w-full rounded-md px-3 py-2 font-body text-xs"
            />
          </div>

          <div>
            <label class="block text-[10px] font-body tracking-[0.15em] text-vault-muted uppercase mb-1">
              {{ t('payDayLabel') }} <span class="text-vault-gold">*</span>
            </label>
            <div class="grid grid-cols-7 gap-1">
              <button
                v-for="day in payDays"
                :key="day"
                @click="form.payDay = day"
                class="h-7 rounded text-xs font-body transition-all duration-200"
                :class="form.payDay == day
                  ? 'btn-gold text-vault-black font-semibold shadow-md'
                  : 'text-vault-muted hover:text-vault-text border border-vault-border/60 hover:border-vault-gold/30'"
              >
                {{ day }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-body tracking-[0.15em] text-vault-muted uppercase mb-1">{{ t('salaryLabel') }}</label>
            <div class="flex gap-1.5">
              <select
                v-model="form.currency"
                class="input-vault rounded-md px-2 py-2 font-body text-xs w-14"
              >
                <option value="¥">¥</option>
                <option value="$">$</option>
                <option value="€">€</option>
                <option value="£">£</option>
              </select>
              <input
                v-model="form.salary"
                type="number"
                :placeholder="t('salaryPlaceholder')"
                class="input-vault flex-1 rounded-md px-3 py-2 font-body text-xs"
              />
            </div>
          </div>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            v-if="showClose"
            @click="emit('close')"
            class="flex-1 py-2 rounded-md border border-vault-border text-vault-muted hover:text-vault-text hover:border-vault-gold/30 transition-all font-body text-xs tracking-wider"
          >
            {{ t('cancel') }}
          </button>
          <button
            @click="handleSave"
            class="flex-1 btn-gold py-2 rounded-md font-body text-xs tracking-[0.15em]"
            :disabled="!form.payDay"
          >
            {{ config.setupDone ? t('saveSettings') : t('startCountdown') }}
          </button>
        </div>

        <div class="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-transparent via-vault-gold/30 to-transparent"></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed, toRef } from 'vue'
import { useI18n } from '../composables/useI18n.js'
import { useModalTransition } from '../composables/useModalTransition.js'

const { t } = useI18n()

const props = defineProps({
  show: Boolean,
  config: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const { visible, isOpen, isClosing } = useModalTransition(toRef(props, 'show'))

const showClose = computed(() => props.config.setupDone)

const form = ref({
  name: props.config.name || '',
  payDay: props.config.payDay || 15,
  salary: props.config.salary || '',
  currency: props.config.currency || '¥',
})

watch(() => props.show, (val) => {
  if (val) {
    form.value = {
      name: props.config.name || '',
      payDay: props.config.payDay || 15,
      salary: props.config.salary || '',
      currency: props.config.currency || '¥',
    }
  }
})

function handleSave() {
  if (!form.value.payDay) return
  emit('save', { ...form.value })
}

const payDays = Array.from({ length: 28 }, (_, i) => i + 1)
</script>
