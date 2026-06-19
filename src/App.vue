<template>
  <div class="page-bg h-screen w-screen overflow-hidden relative flex items-center justify-center noise-overlay transition-colors duration-500">
    <div class="stars"></div>
    <div
      class="fixed inset-0 pointer-events-none z-0 transition-opacity duration-[2s]"
      :style="{ background: `radial-gradient(ellipse 50% 50% at 50% 48%, ${radialGold} 0%, transparent 70%)` }"
    ></div>

    <!-- ══════════ THE CONSOLE ══════════ -->
    <div class="console-card w-full h-full md:w-[720px] md:h-[90vh] md:max-h-[760px] md:rounded-2xl md:border md:border-vault-border/25 relative z-10 overflow-hidden flex flex-col transition-all duration-500">
      <SpringToy v-if="config.setupDone" />

      <!-- ══════════ HEADER ══════════ -->
      <header class="flex-none flex items-center justify-between px-5 h-10 relative z-10 border-b border-vault-border/20">
        <div class="flex items-center gap-2">
          <div class="w-[6px] h-[6px] rounded-full bg-vault-gold/70 animate-pulse"></div>
          <span class="font-body text-[9px] tracking-[0.4em] text-vault-muted/50 uppercase select-none">PayDrop</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="hidden md:block font-mono text-[10px] text-vault-muted/60 tracking-widest select-none">{{ currentDateStr }}</span>
          <button @click="toggleLocale" class="header-btn text-[9px] font-body tracking-wider" :title="t('langLabel')">
            {{ isZh ? 'EN' : '中' }}
          </button>
          <button @click="toggle" class="header-btn" :title="isDark ? t('toggleLight') : t('toggleDark')">
            <svg v-if="isDark" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
            <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          </button>
          <button @click="showHistory = true" class="header-btn" :title="t('salaryRecords')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M4 7V4a2 2 0 012-2h8.5L20 7.5V20a2 2 0 01-2 2H6a2 2 0 01-2-2v-3M9 12h6M9 16h4" stroke-linecap="round"/>
            </svg>
          </button>
          <button @click="showCompensation = true" class="header-btn" :title="t('compensationCalc')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke-linecap="round"/>
            </svg>
          </button>
          <button @click="showSettings = true" class="header-btn" :title="t('settings')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="3"/>
              <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/>
            </svg>
          </button>
        </div>
      </header>

      <!-- ══════════ SETUP SCREEN ══════════ -->
      <Transition name="fade">
        <div v-if="!config.setupDone" class="flex-1 flex items-center justify-center relative z-10">
          <div class="text-center max-w-xs px-6">
            <div class="text-5xl mb-5 animate-float">💰</div>
            <h1 class="font-display text-4xl gold-text mb-2">{{ t('paydayCountdown') }}</h1>
            <p class="font-body text-vault-muted text-sm mb-7 leading-relaxed" v-html="t('landingDesc').replace('\n', '<br>')"></p>
            <button @click="showSettings = true" class="btn-gold px-7 py-2.5 rounded-full font-body text-sm tracking-[0.2em]">
              {{ t('startSetup') }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- ══════════ MAIN ══════════ -->
      <Transition name="fade">
        <div v-if="config.setupDone" class="flex-1 min-h-0 flex flex-col items-center justify-center relative z-10 px-6 py-4 pointer-events-none">
          <Transition name="fade">
            <div v-if="isPayday" class="absolute inset-0 flex items-center justify-center z-20 bg-vault-black/60 backdrop-blur-sm rounded-b-2xl">
              <div class="text-center">
                <div class="text-7xl mb-4 animate-float">🎉</div>
                <h1 class="font-display text-5xl gold-text mb-2">{{ t('paydayTitle') }}</h1>
                <p class="font-body text-vault-text">{{ config.name ? `${config.name}${isZh ? '，' : ', '}` : '' }}{{ t('paydayMsg') }}</p>
              </div>
            </div>
          </Transition>

          <Transition name="mood-change" mode="out-in">
            <div :key="localizedMood.level" class="text-center mb-5 md:mb-6 select-none">
              <span class="text-2xl">{{ localizedMood.emoji }}</span>
              <h2 class="font-display text-lg md:text-xl text-vault-text mt-1 tracking-wide">
                {{ config.name ? `${config.name}${isZh ? '，' : ', '}` : '' }}{{ localizedMood.title }}
              </h2>
              <p class="font-body text-[11px] text-vault-muted/70 mt-0.5 italic">{{ localizedMood.message }}</p>
            </div>
          </Transition>

          <ProgressRing :progress="monthProgress" :size="ringSize" :stroke-width="5" :isDark="isDark">
            <div class="text-center">
              <div class="font-display gold-text font-light" :style="{ fontSize: ringSize * 0.16 + 'px' }">
                {{ Math.round(monthProgress * 100) }}%
              </div>
              <div class="font-body text-vault-muted/60 uppercase tracking-[0.2em]" :style="{ fontSize: Math.max(ringSize * 0.055, 9) + 'px' }">{{ t('monthProgress') }}</div>
            </div>
          </ProgressRing>

          <div class="mt-5 md:mt-6">
            <CountdownBlock :countdown="countdown" :pad="pad" />
          </div>

          <div class="mt-5 md:mt-6 flex items-center gap-5 md:gap-7">
            <div class="text-center">
              <div class="stat-label">{{ t('nextPayday') }}</div>
              <div class="font-display text-vault-gold text-sm tracking-wider">{{ nextPaydayStr }}</div>
            </div>
            <div v-if="config.salary" class="w-px h-5 bg-vault-border/30"></div>
            <div v-if="config.salary" class="text-center">
              <div class="stat-label">{{ t('monthlySalary') }}</div>
              <div class="font-mono text-vault-gold text-sm">{{ config.currency }}{{ Number(config.salary).toLocaleString() }}</div>
            </div>
            <div v-if="config.salary" class="w-px h-5 bg-vault-border/30"></div>
            <div v-if="config.salary" class="text-center">
              <div class="stat-label">{{ t('dailyAvg') }}({{ workingDaysThisMonth }}{{ t('dayUnit') }})</div>
              <div class="font-mono text-vault-text/80 text-sm">{{ config.currency }}{{ dailyPay.toLocaleString() }}</div>
            </div>
            <div class="w-px h-5 bg-vault-border/30"></div>
            <div class="text-center">
              <div class="stat-label">{{ t('waited') }}</div>
              <div class="font-mono text-vault-text/80 text-sm">{{ cycleElapsedDays }}{{ t('dayUnit') }}</div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- ══════════ FOOTER ══════════ -->
      <footer v-if="config.setupDone" class="relative z-10 px-5 py-2.5 border-t border-vault-border/20">
        <div class="flex justify-between items-center mb-1">
          <span class="font-body text-[10px] text-vault-muted/60 tracking-wider">{{ lastPaydayStr }}</span>
          <span class="font-mono text-[10px] text-vault-muted/50 tracking-widest">{{ currentTimeStr }}</span>
          <span class="font-body text-[10px] text-vault-gold/70 tracking-wider">{{ nextPaydayStr }}</span>
        </div>
        <div class="relative h-[3px] bg-vault-border/30 rounded-full overflow-visible">
          <div
            class="absolute left-0 top-0 h-full rounded-full transition-all duration-1000"
            :style="{
              width: `${monthProgress * 100}%`,
              background: 'var(--v-progress-bar)',
              boxShadow: '0 0 8px var(--v-progress-glow)',
            }"
          ></div>
          <div
            class="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-vault-gold transition-all duration-1000"
            :style="{
              left: `calc(${monthProgress * 100}% - 4px)`,
              boxShadow: '0 0 6px var(--v-dot-glow)',
            }"
          ></div>
        </div>
        <div class="text-center mt-1">
          <span class="font-body text-[10px] text-vault-muted/60">
            {{ t('endured') }}
            <span class="text-vault-gold/80"> {{ cycleElapsedDays }} </span>{{ t('remaining') }}
            <span class="text-vault-gold/80"> {{ countdown.days }} </span>{{ t('dayUnit') }}
            <span class="text-vault-muted/50">{{ countdown.hours }}{{ t('hourUnit') }}{{ countdown.minutes }}{{ t('minuteUnit') }}</span>
          </span>
        </div>
      </footer>
    </div>

    <SetupModal :show="showSettings" :config="config" @close="showSettings = false" @save="handleSave" />
    <CompensationModal :show="showCompensation" :config="config" @close="showCompensation = false" />

    <Teleport to="body">
      <Transition name="drawer">
        <div v-if="showHistory" class="fixed inset-0 z-50 flex justify-end">
          <div class="absolute inset-0 backdrop-blur-sm" :style="{ background: 'var(--v-overlay)' }" @click="showHistory = false"></div>
          <div class="relative w-full max-w-sm flex flex-col animate-slide-in-right drawer-panel">
            <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vault-gold/40 to-transparent"></div>
            <div class="flex items-center justify-between px-5 py-4 border-b border-vault-border/30">
              <h2 class="font-display text-lg text-vault-text">{{ t('salaryRecords') }}</h2>
              <button @click="showHistory = false" class="text-vault-muted hover:text-vault-text transition-colors p-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto px-5 py-4">
              <SalaryHistory :history="salaryHistory" :config="config" @add="recordSalary" @delete="deleteRecord" />
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <div v-if="isPayday" class="fixed inset-0 pointer-events-none z-20">
      <div v-for="i in 24" :key="i" class="confetti-piece" :style="confettiStyle(i)"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWindowSize } from '@vueuse/core'
import { usePayday } from './composables/usePayday.js'
import { useHoliday } from './composables/useHoliday.js'
import { useTheme } from './composables/useTheme.js'
import { useI18n } from './composables/useI18n.js'
import SpringToy from './components/SpringToy.vue'
import CountdownBlock from './components/CountdownBlock.vue'
import ProgressRing from './components/ProgressRing.vue'
import SetupModal from './components/SetupModal.vue'
import CompensationModal from './components/CompensationModal.vue'
import SalaryHistory from './components/SalaryHistory.vue'

const {
  config, salaryHistory, now,
  nextPayday, lastPayday,
  countdown, monthProgress,
  moodInfo, isPayday, pad, recordSalary,
  deleteRecord,
} = usePayday()

const { fetchYear, getWorkingDays } = useHoliday()
const { isDark, toggle } = useTheme()
const { t, tm, isZh, toggleLocale } = useI18n()

const localizedMood = computed(() => {
  const m = moodInfo.value
  const mood = tm('mood')[m.level]
  const title = mood.title
  const message = typeof mood.message === 'function'
    ? mood.message(m.level === 'tomorrow' ? m.hours : m.days)
    : mood.message
  return { ...m, title, message }
})

const showSettings = ref(false)
const showHistory = ref(false)
const showCompensation = ref(false)
const holidayReady = ref(false)

const { width: vw, height: vh } = useWindowSize()

const radialGold = computed(() => {
  const alpha = moodInfo.value.intensity * (isDark.value ? 0.1 : 0.06)
  return isDark.value
    ? `rgba(201,168,76,${alpha})`
    : `rgba(138,109,42,${alpha})`
})

onMounted(async () => {
  document.documentElement.lang = isZh.value ? 'zh-CN' : 'en'
  document.title = isZh.value ? 'PayDrop · 发薪倒计时' : 'PayDrop · Payday Countdown'
  const year = new Date().getFullYear()
  await Promise.all([fetchYear(year), fetchYear(year + 1)])
  holidayReady.value = true
})

const workingDaysThisMonth = computed(() => {
  if (!holidayReady.value) return 22
  const d = now.value
  return getWorkingDays(d.getFullYear(), d.getMonth())
})

const dailyPay = computed(() => {
  if (!config.value.salary) return 0
  return Math.round(Number(config.value.salary) / workingDaysThisMonth.value)
})

const ringSize = computed(() => {
  const containerH = Math.min(vh.value * 0.9, 760)
  const available = containerH - 40 - 56 - 80 - 120 - 40 - 60
  if (vw.value < 768) {
    return Math.round(Math.min(available, vw.value * 0.5, 180))
  }
  return Math.round(Math.min(available, 220))
})

function formatDate(date) {
  const d = new Date(date)
  return t('monthDay')(d.getMonth() + 1, d.getDate())
}

const nextPaydayStr = computed(() => formatDate(nextPayday.value))
const lastPaydayStr = computed(() => formatDate(lastPayday.value))

const currentDateStr = computed(() => {
  const d = now.value
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())}`
})

const currentTimeStr = computed(() => {
  const d = now.value
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
})

const cycleElapsedDays = computed(() => Math.floor((now.value - lastPayday.value) / 86400000))

function handleSave(data) {
  config.value = { ...config.value, ...data, setupDone: true }
  showSettings.value = false
}

function confettiStyle(i) {
  const colors = ['#c9a84c', '#f0d080', '#e8a838', '#8a6d2a', '#b87333']
  return {
    left: `${(i / 24) * 100 + (Math.random() * 4 - 2)}%`,
    backgroundColor: colors[i % colors.length],
    animationDuration: `${2 + Math.random() * 3}s`,
    animationDelay: `${Math.random() * 2}s`,
    width: `${4 + Math.random() * 5}px`,
    height: `${4 + Math.random() * 5}px`,
    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
  }
}
</script>

<style scoped>
.page-bg {
  background-color: rgb(var(--v-black));
  transition: background-color 0.5s ease;
}

.console-card {
  background: linear-gradient(180deg, var(--v-surface), var(--v-surface-end));
  backdrop-filter: blur(30px);
  box-shadow: var(--v-shadow);
  transition: background 0.5s, box-shadow 0.5s;
}

.drawer-panel {
  background: var(--v-drawer-bg);
}

.header-btn {
  @apply w-7 h-7 rounded-full flex items-center justify-center text-vault-muted/50 hover:text-vault-gold transition-all duration-200 hover:bg-vault-gold/5;
}

.stat-label {
  @apply font-body text-[10px] tracking-[0.15em] text-vault-muted/70 mb-0.5;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

.mood-change-enter-active {
  transition: all 0.5s cubic-bezier(0.34, 1.4, 0.64, 1);
}
.mood-change-leave-active {
  transition: all 0.2s ease;
}
.mood-change-enter-from {
  opacity: 0; transform: translateY(8px) scale(0.98);
}
.mood-change-leave-to {
  opacity: 0; transform: translateY(-6px) scale(0.98);
}

.drawer-enter-active, .drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-from, .drawer-leave-to {
  opacity: 0;
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-slide-in-right {
  animation: slideInRight 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards;
}
</style>
