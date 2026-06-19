<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/85 backdrop-blur-sm" @click="emit('close')"></div>

        <!-- Panel -->
        <div class="vault-panel relative rounded-2xl p-6 md:p-8 w-full max-w-2xl animate-fade-up shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
          <!-- 顶部装饰线 -->
          <div class="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-vault-gold/60 to-transparent"></div>

          <!-- Header -->
          <div class="text-center mb-6 flex-none">
            <div class="text-vault-gold/60 text-xs font-body tracking-[0.3em] uppercase mb-1">{{ t('compSubtitle') }}</div>
            <h2 class="font-display text-3xl gold-text">{{ t('compTitle') }}</h2>
            <p class="text-[10px] font-body text-vault-muted mt-1">{{ t('compDesc') }}</p>
          </div>

          <!-- Scrollable Content -->
          <div class="flex-1 overflow-y-auto pr-1 space-y-6 min-h-0">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- ─── LEFT: INPUTS ─── -->
              <div class="space-y-4">
                <div class="border-b border-vault-border/30 pb-2">
                  <span class="text-xs font-body tracking-wider text-vault-gold">{{ t('sectionSalary') }}</span>
                </div>

                <!-- 月平均工资 -->
                <div>
                  <label class="block text-[10px] font-body tracking-wider text-vault-muted uppercase mb-1.5">
                    {{ t('avgSalaryLabel') }} <span class="text-vault-gold">*</span>
                  </label>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-vault-gold font-body text-sm">{{ config.currency }}</span>
                    <input
                      v-model="salary"
                      type="number"
                      :placeholder="t('avgSalaryPlaceholder')"
                      class="input-vault w-full rounded-lg pl-8 pr-4 py-2.5 font-body text-sm"
                    />
                  </div>
                </div>

                <!-- 当地社平工资 -->
                <div>
                  <div class="flex justify-between items-center mb-1.5">
                    <label class="block text-[10px] font-body tracking-wider text-vault-muted uppercase">
                      {{ t('socialAvgLabel') }}
                    </label>
                    <span class="text-[9px] text-vault-gold/60 cursor-help group relative">
                      [ {{ t('capRule') }} ]
                      <span class="absolute bottom-full right-0 mb-1 w-48 p-2 bg-vault-dark border border-vault-border rounded text-[9px] text-vault-muted leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-30 shadow-xl">
                        {{ t('capRuleDetail') }}
                      </span>
                    </span>
                  </div>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-vault-muted font-body text-sm">{{ config.currency }}</span>
                    <input
                      v-model="socialAverage"
                      type="number"
                      :placeholder="t('socialAvgPlaceholder')"
                      class="input-vault w-full rounded-lg pl-8 pr-4 py-2.5 font-body text-sm"
                    />
                  </div>
                </div>

                <div class="border-b border-vault-border/30 pb-2 pt-2">
                  <span class="text-xs font-body tracking-wider text-vault-gold">{{ t('sectionYears') }}</span>
                </div>

                <!-- 年限输入模式切换 -->
                <div class="flex rounded-lg mode-switch p-1 border border-vault-border/30">
                  <button
                    @click="yearsMode = 'direct'"
                    class="flex-1 py-1.5 text-xs font-body rounded transition-all"
                    :class="yearsMode === 'direct' ? 'bg-vault-gold/10 text-vault-gold border border-vault-gold/20' : 'text-vault-muted hover:text-vault-text'"
                  >
                    {{ t('directInput') }}
                  </button>
                  <button
                    @click="yearsMode = 'dates'"
                    class="flex-1 py-1.5 text-xs font-body rounded transition-all"
                    :class="yearsMode === 'dates' ? 'bg-vault-gold/10 text-vault-gold border border-vault-gold/20' : 'text-vault-muted hover:text-vault-text'"
                  >
                    {{ t('dateRange') }}
                  </button>
                </div>

                <!-- 直接输入年限 -->
                <div v-if="yearsMode === 'direct'">
                  <label class="block text-[10px] font-body tracking-wider text-vault-muted uppercase mb-1.5">
                    {{ t('yearsLabel') }}
                  </label>
                  <div class="flex gap-2">
                    <input
                      v-model="directYears"
                      type="number"
                      step="0.1"
                      min="0"
                      :placeholder="t('yearsPlaceholder')"
                      class="input-vault flex-1 rounded-lg px-4 py-2.5 font-body text-sm"
                    />
                    <span class="text-xs text-vault-muted self-center font-body">{{ t('yearUnit') }}</span>
                  </div>
                </div>

                <!-- 按日期计算 -->
                <div v-else class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] font-body tracking-wider text-vault-muted uppercase mb-1.5">{{ t('entryDate') }}</label>
                    <input
                      v-model="entryDate"
                      type="date"
                      class="input-vault w-full rounded-lg px-3 py-2 font-body text-xs"
                    />
                  </div>
                  <div>
                    <label class="block text-[10px] font-body tracking-wider text-vault-muted uppercase mb-1.5">{{ t('lastWorkDay') }}</label>
                    <input
                      v-model="endDate"
                      type="date"
                      class="input-vault w-full rounded-lg px-3 py-2 font-body text-xs"
                    />
                  </div>
                </div>

                <div class="border-b border-vault-border/30 pb-2 pt-2">
                  <span class="text-xs font-body tracking-wider text-vault-gold">{{ t('sectionScheme') }}</span>
                </div>

                <!-- 赔偿方案选择 -->
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="scheme in schemes"
                    :key="scheme.value"
                    @click="selectedScheme = scheme.value"
                    class="py-2 px-1 rounded-lg border text-xs font-body transition-all relative overflow-hidden text-center"
                    :class="selectedScheme === scheme.value
                      ? 'border-vault-gold bg-vault-gold/10 text-vault-gold font-medium shadow-md'
                      : 'border-vault-border/50 hover:border-vault-gold/30 text-vault-muted hover:text-vault-text'"
                  >
                    <div class="font-display text-sm">{{ scheme.label }}</div>
                    <div class="text-[8px] opacity-60 mt-0.5">{{ scheme.desc }}</div>
                  </button>
                </div>
              </div>

              <!-- ─── RIGHT: OUTPUTS (RECEIPT) ─── -->
              <div class="flex flex-col justify-between">
                <div class="receipt-card rounded-xl p-5 border border-vault-gold/30 relative overflow-hidden flex-1 flex flex-col justify-between shadow-lg">
                  <!-- Decorative watermark -->
                  <div class="absolute right-4 top-4 font-display text-7xl text-vault-gold/5 font-bold select-none pointer-events-none">
                    {{ selectedScheme }}
                  </div>

                  <!-- Receipt Header -->
                  <div class="border-b border-dashed border-vault-border/60 pb-3">
                    <div class="flex justify-between items-center">
                      <span class="text-[9px] font-mono text-vault-muted/70 tracking-widest">ESTIMATE RECEIPT</span>
                      <span class="text-[9px] font-mono text-vault-gold/60">VER.2026</span>
                    </div>
                    <h3 class="font-display text-lg text-vault-text mt-1">{{ t('receiptTitle') }}</h3>
                  </div>

                  <!-- Calculations -->
                  <div class="py-4 space-y-3.5 flex-1 flex flex-col justify-center">
                    <!-- 实际年限与折算年限 -->
                    <div class="flex justify-between items-baseline">
                      <span class="text-xs font-body text-vault-muted">{{ t('yearsConversion') }}</span>
                      <div class="text-right">
                        <span class="font-mono text-sm text-vault-text">
                          {{ calculatedYears.toFixed(2) }} {{ t('yearUnit') }}
                        </span>
                        <div class="text-[9px] font-body text-vault-gold/70 mt-0.5">
                          {{ t('nCoefficient')(roundedN) }}
                        </div>
                      </div>
                    </div>

                    <!-- 计算基数 -->
                    <div class="flex justify-between items-baseline">
                      <span class="text-xs font-body text-vault-muted">{{ t('compBase') }}</span>
                      <div class="text-right">
                        <span class="font-mono text-sm text-vault-text">
                          {{ config.currency }}{{ compensationBase.toLocaleString() }}
                        </span>
                        <div v-if="isCapped" class="text-[9px] font-body text-red-400/80 mt-0.5">
                          {{ t('capTriggered') }}
                        </div>
                      </div>
                    </div>

                    <!-- N部分 -->
                    <div class="flex justify-between items-baseline">
                      <span class="text-xs font-body text-vault-muted">{{ t('economicComp') }}</span>
                      <span class="font-mono text-sm text-vault-text">
                        {{ config.currency }}{{ nCompensation.toLocaleString() }}
                      </span>
                    </div>

                    <!-- +1部分 -->
                    <div class="flex justify-between items-baseline" v-if="hasPlusOne">
                      <span class="text-xs font-body text-vault-muted">{{ t('noticeComp') }}</span>
                      <span class="font-mono text-sm text-vault-text">
                        {{ config.currency }}{{ plusOneCompensation.toLocaleString() }}
                      </span>
                    </div>
                  </div>

                  <!-- Total Receipt Footer -->
                  <div class="border-t border-dashed border-vault-border/60 pt-3 mt-2">
                    <div class="text-[9px] font-mono text-vault-muted/70 tracking-widest uppercase mb-1">{{ t('totalEstimate') }}</div>
                    <div class="flex justify-between items-center">
                      <span class="font-display text-2xl lg:text-3xl gold-text font-bold">
                        {{ config.currency }}{{ totalCompensation.toLocaleString() }}
                      </span>
                      <span class="text-[9px] font-mono text-vault-gold/60 bg-vault-gold/5 border border-vault-gold/20 px-2 py-0.5 rounded">
                        SECURE
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Law Citation Footnote -->
                <div class="mt-4 p-3 rounded-lg law-footnote border border-vault-border/20">
                  <div class="text-[9px] font-body text-vault-muted/80 leading-relaxed">
                    <span class="text-vault-gold font-medium">{{ t('laborLawTitle') }}</span>
                    {{ t('laborLawText') }}
                  </div>
                </div>
              </div>

            </div>
          </div>

          <!-- Buttons -->
          <div class="mt-6 flex gap-3 flex-none border-t border-vault-border/30 pt-4">
            <button
              @click="emit('close')"
              class="flex-1 py-2.5 rounded-lg border border-vault-border text-vault-muted hover:text-vault-text hover:border-vault-gold/30 transition-all font-body text-sm tracking-wider"
            >
              {{ t('close') }}
            </button>
          </div>

          <!-- 底部装饰线 -->
          <div class="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-vault-gold/30 to-transparent"></div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()

const props = defineProps({
  show: Boolean,
  config: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// 基础输入
const salary = ref(props.config.salary || '')
const socialAverage = ref('') // 当地社平工资
const yearsMode = ref('direct') // 'direct' | 'dates'

// 年限模式：直接输入
const directYears = ref('')

// 年限模式：起止日期
const entryDate = ref('')
const endDate = ref('')

// 方案选择
const selectedScheme = ref('N+1')

const schemes = computed(() => [
  { label: 'N', value: 'N', desc: t('schemeN') },
  { label: 'N+1', value: 'N+1', desc: t('schemeN1') },
  { label: '2N', value: '2N', desc: t('scheme2N') },
])

// 监听配置中的薪资，自动同步
watch(() => props.config.salary, (newVal) => {
  if (newVal) salary.value = newVal
})

// 监听弹窗显示，自动重置或同步
watch(() => props.show, (val) => {
  if (val) {
    salary.value = props.config.salary || ''
  }
})

// 计算工作年限
const calculatedYears = computed(() => {
  if (yearsMode.value === 'direct') {
    return parseFloat(directYears.value) || 0
  }

  if (!entryDate.value || !endDate.value) return 0

  const start = new Date(entryDate.value)
  const end = new Date(endDate.value)
  if (end < start) return 0

  // 计算精确的月份差
  const yearsDiff = end.getFullYear() - start.getFullYear()
  const monthsDiff = end.getMonth() - start.getMonth()
  const daysDiff = end.getDate() - start.getDate()

  let totalMonths = yearsDiff * 12 + monthsDiff
  // 补足天数比例
  if (daysDiff > 0) {
    totalMonths += daysDiff / 30
  } else if (daysDiff < 0) {
    totalMonths += daysDiff / 30
  }

  return Math.max(totalMonths / 12, 0)
})

// 劳动法 N 折算规则：
// 满一年支付1个月；6个月以上不满一年的，按1年算；不满6个月的，按0.5个月算
const roundedN = computed(() => {
  const years = calculatedYears.value
  if (years <= 0) return 0

  const fullYears = Math.floor(years)
  const remainder = years - fullYears

  let additional = 0
  if (remainder >= 0.5) {
    additional = 1
  } else if (remainder > 0) {
    additional = 0.5
  }

  const finalN = fullYears + additional

  // 如果月薪超社平3倍，补偿年限最高不超过12年
  if (isCapped.value) {
    return Math.min(finalN, 12)
  }

  return finalN
})

// 是否触发3倍社平封顶
const isCapped = computed(() => {
  if (!socialAverage.value || !salary.value) return false
  return parseFloat(salary.value) > parseFloat(socialAverage.value) * 3
})

// 补偿月薪基数
const compensationBase = computed(() => {
  const empSalary = parseFloat(salary.value) || 0
  if (isCapped.value) {
    return parseFloat(socialAverage.value) * 3
  }
  return empSalary
})

// 经济补偿金 (N)
const nCompensation = computed(() => {
  return compensationBase.value * roundedN.value
})

// 是否包含代通知金 (+1)
const hasPlusOne = computed(() => {
  return selectedScheme.value.includes('+1')
})

// 代通知金 (+1) - 通常为实际月薪（不封顶，且为1个月）
const plusOneCompensation = computed(() => {
  if (!hasPlusOne.value) return 0
  return parseFloat(salary.value) || 0
})

// 违法解除双倍赔偿 (2N)
const isDouble = computed(() => {
  return selectedScheme.value.startsWith('2N')
})

// 总赔偿金
const totalCompensation = computed(() => {
  const baseN = nCompensation.value
  const multiplier = isDouble.value ? 2 : 1
  return (baseN * multiplier) + plusOneCompensation.value
})
</script>

<style scoped>
.receipt-card {
  background: linear-gradient(180deg, rgb(var(--v-panel) / 0.95), rgb(var(--v-black) / 0.8));
  backdrop-filter: blur(10px);
  transition: background 0.5s;
}
.law-footnote {
  background: rgb(var(--v-black) / 0.3);
  transition: background 0.5s;
}
.mode-switch {
  background: rgb(var(--v-black) / 0.4);
  transition: background 0.5s;
}

:global(.light-theme) .receipt-card {
  background: linear-gradient(180deg, rgb(var(--v-dark) / 0.6), rgb(var(--v-dark) / 0.4));
}
:global(.light-theme) .law-footnote {
  background: rgb(var(--v-dark) / 0.5);
}
:global(.light-theme) .mode-switch {
  background: rgb(var(--v-dark) / 0.5);
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .vault-panel {
  animation: modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalIn {
  0% { transform: scale(0.9) translateY(20px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}
</style>
