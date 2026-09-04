import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import { useHoliday } from './useHoliday.js'

function startOfDay(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function usePayday() {
  const { countWorkingDaysBetween, getActualPayday } = useHoliday()
  // 持久化配置
  const config = useLocalStorage('payday-config', {
    payDay: 15,           // 每月几号发薪
    salary: '',           // 月薪（可选，用于展示）
    currency: '¥',
    name: '',             // 昵称
    setupDone: false,
  })

  // 薪资历史记录
  const salaryHistory = useLocalStorage('payday-history', [])

  // 实时时间
  const now = ref(new Date())
  let timer = null

  // 下一个发薪日计算（遇周末/节假日提前到最近工作日）
  const nextPayday = computed(() => {
    const today = startOfDay(now.value)
    const year = today.getFullYear()
    const month = today.getMonth()
    const payDay = parseInt(config.value.payDay) || 15

    const thisMonthPayday = getActualPayday(year, month, payDay)

    // 本月实际发薪日尚未过去（含当天）
    if (thisMonthPayday >= today) {
      return thisMonthPayday
    }

    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    return getActualPayday(nextYear, nextMonth, payDay)
  })

  // 上一个发薪日
  const lastPayday = computed(() => {
    const today = startOfDay(now.value)
    const year = today.getFullYear()
    const month = today.getMonth()
    const payDay = parseInt(config.value.payDay) || 15

    const thisMonthPayday = getActualPayday(year, month, payDay)

    if (today > thisMonthPayday) {
      return thisMonthPayday
    }

    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    return getActualPayday(prevYear, prevMonth, payDay)
  })

  // 倒计时（天数按剩余工作日计算，时分秒仍为距发薪日的实际时间）
  const countdown = computed(() => {
    const diff = nextPayday.value - now.value
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
    
    const totalSeconds = Math.floor(diff / 1000)
    const days = countWorkingDaysBetween(now.value, nextPayday.value)
    const hours = Math.floor((totalSeconds % 86400) / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    
    return { days, hours, minutes, seconds, total: diff }
  })

  // 月份进度（从上个发薪日到下个发薪日）
  const monthProgress = computed(() => {
    const totalCycle = nextPayday.value - lastPayday.value
    const elapsed = now.value - lastPayday.value
    return Math.min(Math.max(elapsed / totalCycle, 0), 1)
  })

  // 距离发薪日剩余工作日
  const daysUntil = computed(() => countdown.value.days)

  // 情绪状态（仅 level / emoji / color / intensity，文案由外层根据 i18n 填充）
  const moodInfo = computed(() => {
    const days = countdown.value.days
    const hours = countdown.value.hours

    if (countdown.value.total <= 0) {
      return { level: 'payday', emoji: '🎉', color: '#f0d080', intensity: 1, days, hours }
    }
    if (days === 0 && hours < 24) {
      return { level: 'tomorrow', emoji: '🔥', color: '#e8a838', intensity: 0.95, days, hours }
    }
    if (days <= 3) {
      return { level: 'soon', emoji: '✨', color: '#c9a84c', intensity: 0.85, days, hours }
    }
    if (days <= 7) {
      return { level: 'close', emoji: '💛', color: '#c9a84c', intensity: 0.7, days, hours }
    }
    if (days <= 15) {
      return { level: 'mid', emoji: '⚡', color: '#b87333', intensity: 0.5, days, hours }
    }
    return { level: 'far', emoji: '🌑', color: '#8a6d2a', intensity: 0.3, days, hours }
  })

  // 是否是发薪日
  const isPayday = computed(() => countdown.value.total <= 0)

  // 格式化数字为两位
  const pad = (n) => String(n).padStart(2, '0')

  // 记录薪资历史
  function recordSalary(amount, date = new Date()) {
    salaryHistory.value.unshift({
      id: Date.now(),
      amount: parseFloat(amount),
      date: date.toISOString(),
      month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
    })
    // 只保留最近12条
    if (salaryHistory.value.length > 12) {
      salaryHistory.value = salaryHistory.value.slice(0, 12)
    }
  }

  // 删除薪资记录
  function deleteRecord(id) {
    salaryHistory.value = salaryHistory.value.filter(r => r.id !== id)
  }

  function start() {
    timer = setInterval(() => {
      now.value = new Date()
    }, 1000)
  }

  function stop() {
    if (timer) clearInterval(timer)
  }

  onMounted(start)
  onUnmounted(stop)

  return {
    config,
    salaryHistory,
    now,
    nextPayday,
    lastPayday,
    countdown,
    monthProgress,
    daysUntil,
    moodInfo,
    isPayday,
    pad,
    recordSalary,
    deleteRecord,
  }
}
