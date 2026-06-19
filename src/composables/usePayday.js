import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useLocalStorage } from '@vueuse/core'

export function usePayday() {
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

  // 下一个发薪日计算
  const nextPayday = computed(() => {
    const d = new Date(now.value)
    const year = d.getFullYear()
    const month = d.getMonth()
    const day = d.getDate()
    const payDay = parseInt(config.value.payDay) || 15

    // 计算本月发薪日
    const thisMonthPayday = new Date(year, month, payDay, 0, 0, 0, 0)
    
    // 如果本月发薪日还没到（今天不算），用本月的
    if (thisMonthPayday > d) {
      return thisMonthPayday
    }
    
    // 否则用下个月的
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    return new Date(nextYear, nextMonth, payDay, 0, 0, 0, 0)
  })

  // 上一个发薪日
  const lastPayday = computed(() => {
    const d = new Date(now.value)
    const year = d.getFullYear()
    const month = d.getMonth()
    const day = d.getDate()
    const payDay = parseInt(config.value.payDay) || 15

    const thisMonthPayday = new Date(year, month, payDay, 0, 0, 0, 0)
    
    if (thisMonthPayday <= d) {
      return thisMonthPayday
    }
    
    // 上个月的发薪日
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    return new Date(prevYear, prevMonth, payDay, 0, 0, 0, 0)
  })

  // 倒计时
  const countdown = computed(() => {
    const diff = nextPayday.value - now.value
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
    
    const totalSeconds = Math.floor(diff / 1000)
    const days = Math.floor(totalSeconds / 86400)
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

  // 距离发薪日天数（含小数）
  const daysUntil = computed(() => {
    return countdown.value.total / 86400000
  })

  // 情绪状态和文案
  const moodInfo = computed(() => {
    const days = countdown.value.days
    const hours = countdown.value.hours

    if (countdown.value.total <= 0) {
      return {
        level: 'payday',
        emoji: '🎉',
        title: '发薪日到了！',
        message: '今天是发薪日！去看看账户余额了！',
        color: '#f0d080',
        intensity: 1,
      }
    }
    if (days === 0 && hours < 24) {
      return {
        level: 'tomorrow',
        emoji: '🔥',
        title: '明天就到了！！！',
        message: `还有 ${hours} 小时，钱钱快来！`,
        color: '#e8a838',
        intensity: 0.95,
      }
    }
    if (days <= 3) {
      return {
        level: 'soon',
        emoji: '✨',
        title: '马上就到了',
        message: `再熬 ${days} 天，梦想就要照进现实`,
        color: '#c9a84c',
        intensity: 0.85,
      }
    }
    if (days <= 7) {
      return {
        level: 'close',
        emoji: '💛',
        title: '快了快了',
        message: `只剩 ${days} 天，可以开始想买什么了`,
        color: '#c9a84c',
        intensity: 0.7,
      }
    }
    if (days <= 15) {
      return {
        level: 'mid',
        emoji: '⚡',
        title: '月中打工人',
        message: `还有 ${days} 天，继续努力吧`,
        color: '#b87333',
        intensity: 0.5,
      }
    }
    return {
      level: 'far',
      emoji: '🌑',
      title: '路漫漫其修远兮',
      message: `还有 ${days} 天，好好工作，好好生活`,
      color: '#8a6d2a',
      intensity: 0.3,
    }
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
