import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/NateScarlet/holiday-cn@master'

// 模块级缓存，避免多次实例化重复请求
const yearCache = {}
const loadingYears = new Set()

export function useHoliday() {
  // 本地持久缓存：{ [year]: { days: [...], fetchedAt: timestamp } }
  const cache = useLocalStorage('holiday-cache', {})
  const holidayMap = ref({}) // { 'YYYY-MM-DD': { name, isOffDay } }

  async function fetchYear(year) {
    const key = String(year)

    // 内存缓存命中
    if (yearCache[key]) {
      mergeToMap(yearCache[key])
      return
    }

    // localStorage 缓存命中（7天内有效）
    const cached = cache.value[key]
    if (cached && Date.now() - cached.fetchedAt < 7 * 86400000) {
      yearCache[key] = cached.days
      mergeToMap(cached.days)
      return
    }

    if (loadingYears.has(key)) return
    loadingYears.add(key)

    try {
      const res = await fetch(`${CDN_BASE}/${year}.json`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const days = data.days || []
      yearCache[key] = days
      cache.value = { ...cache.value, [key]: { days, fetchedAt: Date.now() } }
      mergeToMap(days)
    } catch (e) {
      console.warn(`节假日数据加载失败 (${year}):`, e.message)
    } finally {
      loadingYears.delete(key)
    }
  }

  function mergeToMap(days) {
    const m = { ...holidayMap.value }
    for (const d of days) {
      m[d.date] = { name: d.name, isOffDay: d.isOffDay }
    }
    holidayMap.value = m
  }

  /**
   * 判断某天是否为工作日
   * 优先级：节假日数据 > 周末判断
   */
  function isWorkDay(date) {
    const d = new Date(date)
    const key = formatDate(d)
    const holiday = holidayMap.value[key]

    if (holiday) {
      // isOffDay=true 放假, isOffDay=false 调休补班（上班）
      return !holiday.isOffDay
    }

    // 无特殊安排：周一~周五为工作日
    const dow = d.getDay()
    return dow >= 1 && dow <= 5
  }

  /**
   * 计算指定月份的工作日天数
   * @param {number} year
   * @param {number} month 0-indexed
   */
  function getWorkingDays(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let count = 0
    for (let day = 1; day <= daysInMonth; day++) {
      if (isWorkDay(new Date(year, month, day))) {
        count++
      }
    }
    return count
  }

  function formatDate(d) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  return {
    holidayMap,
    fetchYear,
    isWorkDay,
    getWorkingDays,
  }
}
