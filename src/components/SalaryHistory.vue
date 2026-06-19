<template>
  <div class="vault-panel rounded-xl p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-display text-lg text-vault-text tracking-wide">{{ t('historyTitle') }}</h3>
      <button
        @click="showAdd = !showAdd"
        class="text-xs font-body tracking-[0.15em] text-vault-gold hover:text-vault-gold-light transition-colors"
      >
        {{ t('addThisMonth') }}
      </button>
    </div>

    <!-- 快速记录 -->
    <Transition name="slide">
      <div v-if="showAdd" class="mb-4 p-3 rounded-lg bg-vault-black/50 border border-vault-border">
        <div class="flex gap-2">
          <span class="text-vault-gold font-body text-sm self-center">{{ config.currency }}</span>
          <input
            v-model="newAmount"
            type="number"
            :placeholder="config.salary ? `${config.salary}` : t('actualAmount')"
            class="input-vault flex-1 rounded-md px-3 py-2 text-sm font-body"
            @keyup.enter="addRecord"
          />
          <button @click="addRecord" class="btn-gold px-3 rounded-md text-sm font-body">
            {{ t('record') }}
          </button>
        </div>
      </div>
    </Transition>

    <!-- 历史列表 -->
    <div v-if="history.length" class="space-y-2">
      <div
        v-for="record in history"
        :key="record.id"
        class="flex items-center justify-between py-2 border-b border-vault-border/50 last:border-0 group"
      >
        <span class="text-vault-muted font-body text-xs">{{ formatMonth(record.month) }}</span>
        <div class="flex items-center gap-2">
          <span class="font-mono text-sm" :class="record.amount > 0 ? 'text-vault-gold' : 'text-vault-muted'">
            {{ config.currency }}{{ record.amount.toLocaleString() }}
          </span>
          <button
            @click="emit('delete', record.id)"
            class="text-vault-muted hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-0.5"
            :title="t('deleteRecord')"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-6 text-vault-muted font-body text-xs">
      {{ t('noRecords') }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()

const props = defineProps({
  history: { type: Array, default: () => [] },
  config: { type: Object, required: true }
})

const emit = defineEmits(['add', 'delete'])

const showAdd = ref(false)
const newAmount = ref('')

function addRecord() {
  if (!newAmount.value) return
  emit('add', parseFloat(newAmount.value))
  newAmount.value = ''
  showAdd.value = false
}

function formatMonth(monthStr) {
  const [y, m] = monthStr.split('-')
  return t('yearMonth')(parseInt(y), parseInt(m))
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
  max-height: 0;
}
.slide-enter-to, .slide-leave-from {
  max-height: 100px;
}
</style>
