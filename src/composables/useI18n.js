import { computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'

const locale = useLocalStorage('paydrop-locale', 'zh')

const messages = {
  zh: {
    // App header
    toggleLight: '切换亮色',
    toggleDark: '切换暗色',
    salaryRecords: '薪资记录',
    compensationCalc: '赔偿计算器',
    settings: '设置',

    // Setup landing
    paydayCountdown: '发薪倒计时',
    landingDesc: '每个月最期待的那一天\n让我们一起数着日子过',
    startSetup: '开始设置',

    // Payday celebration
    paydayTitle: '发薪日！',
    paydayMsg: '钱到账了！',

    // Main stats
    monthProgress: '本月进度',
    nextPayday: '下次发薪',
    monthlySalary: '月薪',
    dailyAvg: '日均',
    dayUnit: '天',
    waited: '已等待',

    // Footer
    endured: '已熬过',
    remaining: '天，还剩',
    hourUnit: '时',
    minuteUnit: '分',

    // Countdown units
    days: '天',
    hours: '时',
    minutes: '分',
    seconds: '秒',

    // Date format
    monthDay: (m, d) => `${m}月${d}日`,
    yearMonth: (y, m) => `${y}年${m}月`,

    // Mood messages
    mood: {
      payday: { title: '发薪日到了！', message: '今天是发薪日！去看看账户余额了！' },
      tomorrow: { title: '明天就到了！！！', message: (h) => `还有 ${h} 小时，钱钱快来！` },
      soon: { title: '马上就到了', message: (d) => `再熬 ${d} 天，梦想就要照进现实` },
      close: { title: '快了快了', message: (d) => `只剩 ${d} 天，可以开始想买什么了` },
      mid: { title: '月中打工人', message: (d) => `还有 ${d} 天，继续努力吧` },
      far: { title: '路漫漫其修远兮', message: (d) => `还有 ${d} 天，好好工作，好好生活` },
    },

    // Setup modal
    setupSubtitle: 'PAYDROP SETTINGS',
    setupTitle: '设置发薪信息',
    nameLabel: '你的名字（可选）',
    namePlaceholder: '打工人',
    payDayLabel: '每月几号发薪',
    salaryLabel: '月薪（可选，仅本地展示）',
    salaryPlaceholder: '输入月薪金额',
    cancel: '取消',
    saveSettings: '保存设置',
    startCountdown: '开始倒计时',

    // Compensation modal
    compSubtitle: 'COMPENSATION CALCULATOR',
    compTitle: '裁员赔偿计算器',
    compDesc: '基于《中华人民共和国劳动合同法》标准设计',
    sectionSalary: '1. 基础薪资与社平',
    avgSalaryLabel: '前12个月平均工资 (税前)',
    avgSalaryPlaceholder: '请输入月平均工资',
    socialAvgLabel: '当地上年度社平工资 (选填)',
    capRule: '封顶规则',
    capRuleDetail: '若月薪超社平3倍，基数按3倍社平封顶，且补偿年限最高不超过12年。',
    socialAvgPlaceholder: '用于计算3倍封顶限额',
    sectionYears: '2. 工作年限',
    directInput: '直接输入年限',
    dateRange: '按起止日期计算',
    yearsLabel: '实际工作年限 (年)',
    yearsPlaceholder: '例如: 2.5',
    yearUnit: '年',
    entryDate: '入职日期',
    lastWorkDay: '最后工作日',
    sectionScheme: '3. 赔偿方案',
    schemeN: '标准协商解除',
    schemeN1: '标准无提前通知',
    scheme2N: '违法解除/双倍',
    receiptTitle: '赔偿金明细账单',
    yearsConversion: '工作年限折算:',
    nCoefficient: (n) => `折算补偿系数: ${n} 个月 (N)`,
    compBase: '月补偿基数:',
    capTriggered: '⚠️ 已触发3倍社平限额封顶',
    economicComp: '经济补偿金 (N):',
    noticeComp: '代通知金 (+1):',
    totalEstimate: 'TOTAL ESTIMATED COMPENSATION',
    close: '关闭',
    laborLawTitle: '《劳动合同法》第四十七条：',
    laborLawText: '经济补偿按劳动者在本单位工作年限，每满一年支付一个月工资的标准向劳动者支付。六个月以上不满一年的，按一年计算；不满六个月的，向劳动者支付半个月工资的经济补偿。',

    // Salary history
    historyTitle: '薪资记录',
    addThisMonth: '+ 记录本月',
    actualAmount: '实际到手金额',
    record: '记',
    noRecords: '还没有记录，等发了薪水来记一笔吧',
    deleteRecord: '删除记录',

    // Language
    langLabel: '中/EN',
  },

  en: {
    toggleLight: 'Light mode',
    toggleDark: 'Dark mode',
    salaryRecords: 'Salary Records',
    compensationCalc: 'Compensation Calculator',
    settings: 'Settings',

    paydayCountdown: 'Payday Countdown',
    landingDesc: 'That one day you look forward to\nLet\'s count down together',
    startSetup: 'Get Started',

    paydayTitle: 'Payday!',
    paydayMsg: 'Money has arrived!',

    monthProgress: 'Monthly Progress',
    nextPayday: 'Next Payday',
    monthlySalary: 'Salary',
    dailyAvg: 'Daily Avg',
    dayUnit: 'd',
    waited: 'Waited',

    endured: 'Endured',
    remaining: 'd, ',
    hourUnit: 'h',
    minuteUnit: 'm left',

    days: 'Days',
    hours: 'Hrs',
    minutes: 'Min',
    seconds: 'Sec',

    monthDay: (m, d) => `${m}/${d}`,
    yearMonth: (y, m) => `${y}/${m}`,

    mood: {
      payday: { title: 'It\'s Payday!', message: 'Time to check your bank account!' },
      tomorrow: { title: 'Tomorrow!!!', message: (h) => `Only ${h} hours left, money is coming!` },
      soon: { title: 'Almost There', message: (d) => `${d} more days, dreams are about to come true` },
      close: { title: 'Getting Close', message: (d) => `Only ${d} days, start thinking about what to buy` },
      mid: { title: 'Halfway There', message: (d) => `${d} days to go, keep pushing` },
      far: { title: 'The Long Road', message: (d) => `${d} days left, work hard, live well` },
    },

    setupSubtitle: 'PAYDROP SETTINGS',
    setupTitle: 'Payday Settings',
    nameLabel: 'Your Name (optional)',
    namePlaceholder: 'Worker',
    payDayLabel: 'Payday (day of month)',
    salaryLabel: 'Monthly Salary (optional, local only)',
    salaryPlaceholder: 'Enter salary amount',
    cancel: 'Cancel',
    saveSettings: 'Save',
    startCountdown: 'Start Countdown',

    compSubtitle: 'COMPENSATION CALCULATOR',
    compTitle: 'Severance Calculator',
    compDesc: 'Based on PRC Labor Contract Law standards',
    sectionSalary: '1. Salary & Social Average',
    avgSalaryLabel: 'Avg. Monthly Salary (pre-tax, last 12 months)',
    avgSalaryPlaceholder: 'Enter average monthly salary',
    socialAvgLabel: 'Local Social Average Salary (optional)',
    capRule: 'Cap Rule',
    capRuleDetail: 'If salary exceeds 3× social average, the base is capped at 3× and max compensation years is 12.',
    socialAvgPlaceholder: 'For calculating 3× cap limit',
    sectionYears: '2. Years of Service',
    directInput: 'Enter Years',
    dateRange: 'Calculate by Dates',
    yearsLabel: 'Years of Service',
    yearsPlaceholder: 'e.g. 2.5',
    yearUnit: 'yr',
    entryDate: 'Start Date',
    lastWorkDay: 'Last Working Day',
    sectionScheme: '3. Compensation Scheme',
    schemeN: 'Standard (mutual)',
    schemeN1: 'Standard (no notice)',
    scheme2N: 'Unlawful / Double',
    receiptTitle: 'Compensation Breakdown',
    yearsConversion: 'Years Converted:',
    nCoefficient: (n) => `Compensation factor: ${n} months (N)`,
    compBase: 'Monthly Base:',
    capTriggered: '⚠️ 3× social average cap applied',
    economicComp: 'Severance (N):',
    noticeComp: 'Notice Pay (+1):',
    totalEstimate: 'TOTAL ESTIMATED COMPENSATION',
    close: 'Close',
    laborLawTitle: 'Labor Contract Law, Article 47:',
    laborLawText: 'Severance shall be paid at one month\'s salary per year of service. Service of six months or more but less than one year counts as one full year; less than six months entitles half a month\'s salary.',

    historyTitle: 'Salary Records',
    addThisMonth: '+ Add This Month',
    actualAmount: 'Actual amount received',
    record: 'Add',
    noRecords: 'No records yet. Come back after payday!',
    deleteRecord: 'Delete record',

    langLabel: '中/EN',
  },
}

export function useI18n() {
  function t(key) {
    const msg = messages[locale.value]
    return msg?.[key] ?? messages.zh[key] ?? key
  }

  function tm(key) {
    const msg = messages[locale.value]
    return msg?.[key] ?? messages.zh[key]
  }

  function toggleLocale() {
    locale.value = locale.value === 'zh' ? 'en' : 'zh'
    document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
    document.title = locale.value === 'zh' ? 'PayDrop · 发薪倒计时' : 'PayDrop · Payday Countdown'
  }

  const isZh = computed(() => locale.value === 'zh')

  return { t, tm, locale, isZh, toggleLocale }
}
