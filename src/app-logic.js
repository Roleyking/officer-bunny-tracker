import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'

const DAY_MS = 24 * 60 * 60 * 1000

const I18N = {
  zh: {
    start_label: '起始',
    perfect_suffix: '天完美',
    nav_settings: '设置',
    nav_templates: '模板',
    nav_checkin: '打卡',
    nav_exports: '导出',
    nav_share: '分享',
    theme_label: '主题模式',
    theme_light: '浅色',
    theme_dark: '暗黑',
    chart_title: '当月完美天数曲线',
    chart_cumulative_label: '累计完美天数',
    chart_day_label: '日期',
    badge_tier_1: '起步徽章',
    badge_tier_2: '进阶徽章',
    badge_tier_3: '精英徽章',
    badge_tier_4: '完美徽章',
    badge_range_label: '时间范围',
    badge_image_title: '徽章自定义图片',
    badge_image_desc: '上传后覆盖四档默认徽章',
    badge_image_tip: '建议尺寸：正方形 600x600 或更高',
    badge_crop_reset: '重置裁剪',
    badge_use_default: '恢复默认徽章',
    btn_load_tpl: '从模板加载任务',
    input_task: '输入新任务...',
    settings_title: '设置',
    language: '语言',
    start_date: '起始日期 (解锁补卡)',
    img_custom_title: '图片自定义',
    btn_upload: '换图',
    fill_mode: '填充模式',
    mode_stretch: '强制拉伸 (推荐)',
    mode_cover: '居中裁切',
    mode_contain: '完整居中',
    export_config: '配置导出',
    btn_copy_code: '复制配置代码',
    export_csv_data: 'CSV打卡数据',
    btn_export_csv: '导出CSV文件',
    exports_title: '导出选项',
    share_title: '分享卡片',
    share_bg_title: '分享卡片背景',
    share_bg_desc: '用于导出分享卡片的背景',
    share_bg_reset: '使用 App 背景',
    share_quote_title: '卡片格言',
    share_quote_hint: '写一句鼓励的话',
    share_quote_random: '随机一句',
    share_download: '下载分享卡片',
    btn_close: '关闭',
    report_title: '警情通报',
    officer_comment: '局长评语',
    valid_days: '有效考核',
    perfect_days: '完美执勤',
    day_unit: '天',
    btn_roger: '收到，长官！',
    tpl_title: '每日任务模板',
    tpl_input_hint: '例如: 晨跑',
    btn_add: '添加',
    btn_done: '完成',
    bg_global: 'App外围墙纸',
    bg_global_desc: 'PC端桌面背景',
    bg_app_full: 'App全屏背景',
    bg_app_full_desc: '手机端全屏背景 (推荐9:16)',
    status_happy: '完美状态图',
    status_happy_desc: '100% 完成',
    status_light: '努力状态图',
    status_light_desc: '50%~99% 完成',
    status_heavy: '吃力状态图',
    status_heavy_desc: '1%~49% 完成',
    status_sad: '未开始图',
    status_sad_desc: '0% 完成',
    detail_future: '未来规划',
    detail_pre: '未启用日期',
    detail_all_done: '任务已全部完成！',
    detail_todo: '今日任务清单',
    comm_excellent: '神速进步！',
    comm_good: '稳步前行',
    comm_bad: '需加强',
    comm_not_started: '尚未开始',
    long_excellent: '难以置信的执行力！局里决定给你颁发‘闪电侠’勋章！继续保持！',
    long_good: '表现很稳健，就像巡逻车一样可靠。再接再厉！',
    long_bad: '听着，这个出勤率有点糟糕。别让甜甜圈耽误了任务！',
    long_not_started: '该月份还未进入你的打卡考核区间，等开始日期到了再来冲刺吧！',
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    alert_img_to_large: '图片过大 (需小于 4MB)',
    alert_img_invalid_type: '仅支持图片文件',
    alert_img_read_fail: '图片读取失败，请重试',
    alert_copy_ok: '配置代码已复制！',
    alert_copy_fail: '复制失败，请手动选择复制。',
    alert_backfill_confirm: '确认补卡？\n\n此操作将记录您已完成当日任务，确定继续吗？',
    confirm_override: '确定要覆盖当天的任务列表吗？',
    csv_header_date: '日期',
    csv_header_tasks: '任务数量',
    csv_header_completed: '完成数',
    csv_header_status: '状态',
    csv_header_task_name: '任务',
    csv_header_task_status: '完成',
    csv_status_perfect: '完美',
    csv_status_good: '良好',
    csv_status_partial: '部分',
    csv_status_none: '未开始',
    csv_no_tasks: '无任务',
    zootopia_backfill_title: '补卡提醒',
    zootopia_backfill_message: '嘿，兔子警官！你确定完成了那天的所有任务吗？',
    btn_yes: '是的，我完成了',
    btn_no: '取消',
    backfill_locked: '补卡功能已锁定',
    backfill_unlocked: '可以补卡',
    backfill_current_day: '当天打卡'
  },
  en: {
    start_label: 'Start',
    perfect_suffix: ' Days Perfect',
    nav_settings: 'Settings',
    nav_templates: 'Templates',
    nav_checkin: 'Check-in',
    nav_exports: 'Export',
    nav_share: 'Share',
    theme_label: 'Theme',
    theme_light: 'Light',
    theme_dark: 'Dark',
    chart_title: 'Monthly Perfect Curve',
    chart_cumulative_label: 'Cumulative Perfect Days',
    chart_day_label: 'Day',
    badge_tier_1: 'Rookie Badge',
    badge_tier_2: 'Advance Badge',
    badge_tier_3: 'Elite Badge',
    badge_tier_4: 'Perfect Badge',
    badge_range_label: 'Range',
    badge_image_title: 'Custom Badge Image',
    badge_image_desc: 'Override all default tier badges',
    badge_image_tip: 'Recommended size: square 600x600 or higher',
    badge_crop_reset: 'Reset Crop',
    badge_use_default: 'Use Default Badges',
    btn_load_tpl: 'Load Templates',
    input_task: 'New task...',
    settings_title: 'Settings',
    language: 'Language',
    start_date: 'Start Date',
    img_custom_title: 'Custom Images',
    btn_upload: 'Upload',
    fill_mode: 'Fill Mode',
    mode_stretch: 'Stretch (Recommended)',
    mode_cover: 'Cover',
    mode_contain: 'Contain',
    export_config: 'Export Config',
    btn_copy_code: 'Copy Config Code',
    export_csv_data: 'CSV Check-in Data',
    btn_export_csv: 'Export CSV File',
    exports_title: 'Export Options',
    share_title: 'Share Card',
    share_bg_title: 'Share Card Background',
    share_bg_desc: 'Background image for the exported card',
    share_bg_reset: 'Use App Background',
    share_quote_title: 'Card Motto',
    share_quote_hint: 'Write a short encouragement',
    share_quote_random: 'Random Quote',
    share_download: 'Download Share Card',
    btn_close: 'Close',
    report_title: 'Monthly Report',
    officer_comment: 'Officer Comment',
    valid_days: 'Valid Days',
    perfect_days: 'Perfect Days',
    day_unit: ' Days',
    btn_roger: 'Yes Sir!',
    tpl_title: 'Task Templates',
    tpl_input_hint: 'e.g. Morning Run',
    btn_add: 'Add',
    btn_done: 'Done',
    bg_global: 'Global Wallpaper',
    bg_global_desc: 'Desktop background',
    bg_app_full: 'App Background',
    bg_app_full_desc: 'Full card background (9:16)',
    status_happy: 'Perfect Image',
    status_happy_desc: '100% Done',
    status_light: 'Good Image',
    status_light_desc: '50%~99% Done',
    status_heavy: 'Struggle Image',
    status_heavy_desc: '1%~49% Done',
    status_sad: 'Start Image',
    status_sad_desc: '0% Done',
    detail_future: 'Future Plan',
    detail_pre: 'Not Started',
    detail_all_done: 'All Tasks Done!',
    detail_todo: 'To-Do List',
    comm_excellent: 'Excellent!',
    comm_good: 'Good Job',
    comm_bad: 'Needs Work',
    comm_not_started: 'Not Started Yet',
    long_excellent: 'Unbelievable execution! The department is awarding you the "Flash" medal!',
    long_good: 'Steady performance, reliable as a patrol car. Keep it up!',
    long_bad: "Listen, this attendance is poor. Don't let donuts distract you from the mission!",
    long_not_started: 'This month is before your tracking start date. Come back when your check-in period begins.',
    weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    alert_img_to_large: 'Image too large (<4MB)',
    alert_img_invalid_type: 'Only image files are supported',
    alert_img_read_fail: 'Failed to read image. Please try again.',
    alert_copy_ok: 'Config code copied!',
    alert_copy_fail: 'Copy failed, please select manually.',
    alert_backfill_confirm: "Confirm Backfill?\n\nThis will record that you have completed the day's tasks, continue?",
    confirm_override: 'Override tasks for this day?',
    csv_header_date: 'Date',
    csv_header_tasks: 'Task Count',
    csv_header_completed: 'Completed',
    csv_header_status: 'Status',
    csv_header_task_name: 'Task',
    csv_header_task_status: 'Status',
    csv_status_perfect: 'Perfect',
    csv_status_good: 'Good',
    csv_status_partial: 'Partial',
    csv_status_none: 'None',
    csv_no_tasks: 'No Tasks',
    zootopia_backfill_title: 'Backfill Alert',
    zootopia_backfill_message: 'Hey, Officer Hoppers! Are you sure you completed all tasks for that day?',
    btn_yes: 'Yes, I did',
    btn_no: 'Cancel',
    backfill_locked: 'Backfill locked',
    backfill_unlocked: 'Backfill available',
    backfill_current_day: 'Current day check-in'
  }
}

const DEFAULTS = {
  imgHappy: '/rabbit-tracker-happy.jpg',
  imgLight: '/rabbit-tracker-light.jpg',
  imgHeavy: '/rabbit-tracker-heavy.jpg',
  imgSad: '/rabbit-tracker-sad.jpg',
  bgImage: '/rabbit-tracker-bg.jpg',
  appBg: '/rabbit-tracker-appbg.jpg',
  bgMode: '100% 100%',
  lang: 'zh',
  theme: 'light',
  badgeImage: '',
  badgeImageScale: 1.0,
  badgeImageX: 0,
  badgeImageY: 0,
  shareBg: '',
  shareQuote: ''
}

const BADGE_DEFAULT_IMAGES = {
  1: '/badge-tier-1.png',
  2: '/badge-tier-2.png',
  3: '/badge-tier-3.png',
  4: '/badge-tier-4.png'
}

const SHARE_QUOTES = {
  zh: [
    '今天也要全勤出勤。',
    '自律让时间站在你这边。',
    '把小目标坚持成大成就。',
    '每一次打卡，都是对自己的承诺。',
    '稳稳前进，比速度更重要。',
    '坚持比灵感更可靠。'
  ],
  en: [
    'Show up today. That is the win.',
    'Discipline makes time your ally.',
    'Small habits build big results.',
    'Each check-in is a promise kept.',
    'Steady beats speedy.',
    'Consistency beats inspiration.'
  ]
}

const pickShareQuote = (lang = 'zh') => {
  const list = SHARE_QUOTES[lang] || SHARE_QUOTES.zh
  return list[Math.floor(Math.random() * list.length)]
}

let db
let dbInitPromise = null
const writeQueues = new Map()

const toUtcDayValue = (dateStr) => {
  const [y, m, d] = String(dateStr || '')
    .split('-')
    .map((n) => parseInt(n, 10))
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return null
  return Date.UTC(y, m - 1, d)
}

const todayUtcDayValue = () => {
  const now = new Date()
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
}

const enqueueWrite = (queueKey, task) => {
  const previous = writeQueues.get(queueKey) || Promise.resolve()
  const next = previous.catch(() => undefined).then(task)
  const tracked = next.finally(() => {
    if (writeQueues.get(queueKey) === tracked) {
      writeQueues.delete(queueKey)
    }
  })
  writeQueues.set(queueKey, tracked)
  return tracked
}

const cloneForStorage = (data) => {
  try {
    if (typeof structuredClone === 'function') {
      return structuredClone(data)
    }
  } catch (e) {
    console.warn('structuredClone failed, fallback to JSON clone.', e)
  }

  try {
    return JSON.parse(JSON.stringify(data))
  } catch (e) {
    console.warn('JSON clone failed, saving raw data may fail.', e)
    return data
  }
}

async function initDB() {
  if (db) return db
  if (dbInitPromise) return dbInitPromise

  dbInitPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open('RabbitTrackerDB', 1)

    request.onerror = () => {
      console.error('数据库打开失败')
      reject(request.error)
    }

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const upgradeDb = event.target.result

      if (!upgradeDb.objectStoreNames.contains('settings')) {
        upgradeDb.createObjectStore('settings', { keyPath: 'id' })
      }
      if (!upgradeDb.objectStoreNames.contains('records')) {
        upgradeDb.createObjectStore('records', { keyPath: 'id' })
      }
      if (!upgradeDb.objectStoreNames.contains('templates')) {
        upgradeDb.createObjectStore('templates', { keyPath: 'id' })
      }
      if (!upgradeDb.objectStoreNames.contains('startDate')) {
        upgradeDb.createObjectStore('startDate', { keyPath: 'id' })
      }
      if (!upgradeDb.objectStoreNames.contains('pwaInstall')) {
        upgradeDb.createObjectStore('pwaInstall', { keyPath: 'id' })
      }
    }
  }).finally(() => {
    if (!db) {
      dbInitPromise = null
    }
  })

  return dbInitPromise
}

async function saveToIndexedDB(storeName, data, id) {
  await initDB()
  const safeData = cloneForStorage(data)
  const queueKey = `${storeName}:${id}`

  return enqueueWrite(queueKey, () => {
    return new Promise((resolve, reject) => {
      let putResult
      const transaction = db.transaction([storeName], 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put({ id: id, data: safeData })

      request.onsuccess = () => {
        putResult = request.result
      }
      request.onerror = () => reject(request.error)
      transaction.onerror = () => reject(transaction.error || request.error)
      transaction.oncomplete = () => resolve(putResult)
    })
  })
}

async function getFromIndexedDB(storeName, id) {
  await initDB()
  const transaction = db.transaction([storeName], 'readonly')
  const store = transaction.objectStore(storeName)
  const request = store.get(id)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => {
      const result = request.result
      resolve(result ? result.data : null)
    }
    request.onerror = () => reject(request.error)
  })
}

async function deleteFromIndexedDB(storeName, id) {
  await initDB()
  const transaction = db.transaction([storeName], 'readwrite')
  const store = transaction.objectStore(storeName)
  const request = store.delete(id)

  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export default {
  setup() {
    const view = ref('calendar')
    const showSettings = ref(false)
    const showTemplates = ref(false)
    const showReport = ref(false)
    const showExports = ref(false)
    const showShare = ref(false)
    const showBackfillModal = ref(false)

    const now = new Date()
    const currentYear = ref(now.getFullYear())
    const currentMonth = ref(now.getMonth())
    const selectedDateStr = ref('')
    const tempTaskName = ref('')
    const tempTplName = ref('')

    const records = ref({})
    const templates = ref([{ name: '阅读20分钟', completed: false }])
    const settings = ref({ ...DEFAULTS })

    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`
    const startDateStr = ref(todayStr)

    const currentDayTasks = ref([])
    const deferredPrompt = ref(null)
    const showPWAInstallBanner = ref(false)
    const backfillDate = ref('')
    const backfillMessage = ref('')
    let pwaBannerTimeoutId = null

    const clearPwaBannerTimer = () => {
      if (pwaBannerTimeoutId !== null) {
        clearTimeout(pwaBannerTimeoutId)
        pwaBannerTimeoutId = null
      }
    }

    const schedulePwaBanner = () => {
      clearPwaBannerTimer()
      pwaBannerTimeoutId = setTimeout(() => {
        showPWAInstallBanner.value = true
        pwaBannerTimeoutId = null
      }, 2000)
    }

    const applyTheme = (theme) => {
      const useDark = theme === 'dark'
      document.body.classList.toggle('theme-dark', useDark)
    }

    const t = (key) => {
      const lang = settings.value.lang || 'zh'
      return I18N[lang][key] || key
    }

    const formattedDateHeader = computed(() => {
      const lang = settings.value.lang || 'zh'
      const year = currentYear.value
      const month = currentMonth.value

      if (lang === 'en') {
        const date = new Date(year, month)
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
      }
      return `${year} 年 ${month + 1} 月`
    })

    const bgLabels = {
      bgImage: { titleKey: 'bg_global', descKey: 'bg_global_desc' },
      appBg: { titleKey: 'bg_app_full', descKey: 'bg_app_full_desc' },
      shareBg: { titleKey: 'share_bg_title', descKey: 'share_bg_desc' }
    }

    const statusImgLabels = {
      imgHappy: { titleKey: 'status_happy', descKey: 'status_happy_desc' },
      imgLight: { titleKey: 'status_light', descKey: 'status_light_desc' },
      imgHeavy: { titleKey: 'status_heavy', descKey: 'status_heavy_desc' },
      imgSad: { titleKey: 'status_sad', descKey: 'status_sad_desc' }
    }

    const appBackgroundStyle = computed(() => {
      if (settings.value.appBg) {
        return {
          backgroundImage: `url(${settings.value.appBg})`,
          backgroundSize: settings.value.bgMode || 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }
      }
      return {}
    })

    const contentStyle = computed(() => {
      if (settings.value.appBg) {
        return { background: 'transparent' }
      }
      if (settings.value.theme === 'dark') {
        return { background: '#11131a' }
      }
      return { background: 'var(--light-blue)' }
    })

    const calendarStyle = computed(() => {
      return { minHeight: '100%' }
    })

    const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value + 1, 0).getDate())
    const firstDayOfWeek = computed(() => new Date(currentYear.value, currentMonth.value, 1).getDay())
    const localizedWeekdays = computed(() => I18N[settings.value.lang || 'zh'].weekdays)

    const getDateStr = (d) =>
      `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

    const getDaysDiff = (dateStr) => {
      if (!dateStr) return 0
      const targetUtc = toUtcDayValue(dateStr)
      if (targetUtc === null) return 0
      return Math.floor((todayUtcDayValue() - targetUtc) / DAY_MS)
    }

    const getStartDaysDiff = () => {
      const startUtc = toUtcDayValue(startDateStr.value)
      if (startUtc === null) return 0
      return Math.floor((todayUtcDayValue() - startUtc) / DAY_MS)
    }

    const getDayState = (day) => {
      const dateStr = getDateStr(day)
      const diff = getDaysDiff(dateStr)
      const startDiff = getStartDaysDiff()

      if (startDiff === 0) {
        if (diff < 0) return 'future'
        if (diff > 0) return 'pre-start'
        return 'normal'
      } else if (startDiff > 0) {
        if (diff < 0) return 'future'
        if (diff > startDiff) return 'pre-start'
        if (diff > 0) return 'backfill'
        return 'normal'
      } else {
        if (diff < 0) return 'future'
        return 'pre-start'
      }
    }

    const dayStateForDetail = computed(() => {
      if (!selectedDateStr.value) return 'normal'
      const diff = getDaysDiff(selectedDateStr.value)
      const startDiff = getStartDaysDiff()

      if (diff < 0) return 'future'
      if (startDiff === 0 && diff > 0) return 'pre-start'
      if (startDiff > 0 && diff > startDiff) return 'pre-start'
      if (diff > 0 && startDiff > 0 && diff <= startDiff) return 'backfill'
      return 'normal'
    })

    const monthlyStats = computed(() => {
      let perfectCount = 0
      let validDaysCount = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      try {
        let evaluationStart = new Date(
          startDateStr.value.split('-')[0],
          parseInt(startDateStr.value.split('-')[1]) - 1,
          parseInt(startDateStr.value.split('-')[2])
        )
        let evaluationEnd = today
        const daysInM = daysInMonth.value

        for (let d = 1; d <= daysInM; d++) {
          const checkDate = new Date(currentYear.value, currentMonth.value, d)
          if (checkDate >= evaluationStart && checkDate <= evaluationEnd) {
            validDaysCount++
            const dStr = getDateStr(d)
            const tasks = records.value[dStr]
            if (tasks && tasks.length > 0) {
              const done = tasks.filter((t) => t.completed).length
              if (done === tasks.length) perfectCount++
            }
          }
        }
      } catch (e) {
        console.error('计算月度统计时出错:', e)
        return { perfectDays: 0, progress: 0, validDays: 0, emoji: '⚠️', longComment: 'Error', shortComment: 'Error' }
      }

      const progress = validDaysCount === 0 ? 0 : Math.min(100, (perfectCount / validDaysCount) * 100)
      let shortComment = t('comm_not_started')
      let longComment = t('long_not_started')
      let emoji = '📅'

      if (validDaysCount > 0) {
        if (progress >= 90) {
          shortComment = t('comm_excellent')
          longComment = t('long_excellent')
          emoji = '🏆'
        } else if (progress >= 60) {
          shortComment = t('comm_good')
          longComment = t('long_good')
          emoji = '🚓'
        } else {
          shortComment = t('comm_bad')
          longComment = t('long_bad')
          emoji = '🍩'
        }
      }

      return {
        perfectDays: perfectCount,
        progress: Math.round(progress),
        validDays: validDaysCount,
        emoji,
        longComment,
        shortComment
      }
    })

    const monthlyChart = computed(() => {
      const labels = []
      const series = []
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const isCurrentMonth =
        today.getFullYear() === currentYear.value && today.getMonth() === currentMonth.value
      const endDay = isCurrentMonth ? today.getDate() : daysInMonth.value

      const startParts = startDateStr.value.split('-').map((n) => parseInt(n, 10))
      const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2])
      startDate.setHours(0, 0, 0, 0)

      let cumulative = 0
      for (let d = 1; d <= endDay; d++) {
        labels.push(String(d))
        const dateObj = new Date(currentYear.value, currentMonth.value, d)
        if (dateObj < startDate) {
          series.push(cumulative)
          continue
        }
        const tasks = records.value[getDateStr(d)]
        if (Array.isArray(tasks) && tasks.length > 0 && tasks.every((t) => t.completed)) {
          cumulative += 1
        }
        series.push(cumulative)
      }

      return { labels, series }
    })

    const formatDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const monthlyBadge = computed(() => {
      const stats = monthlyStats.value
      const validDays = stats.validDays || 0
      const rateRaw = validDays === 0 ? 0 : (stats.perfectDays / validDays) * 100
      const rate = Math.round(rateRaw)
      let tier = 1

      if (validDays > 0 && rate === 100) {
        tier = 4
      } else if (rate >= 85) {
        tier = 3
      } else if (rate >= 51) {
        tier = 2
      }

      const labelKey =
        tier === 4 ? 'badge_tier_4' : tier === 3 ? 'badge_tier_3' : tier === 2 ? 'badge_tier_2' : 'badge_tier_1'

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const monthStart = new Date(currentYear.value, currentMonth.value, 1)
      const monthEnd = new Date(currentYear.value, currentMonth.value + 1, 0)
      monthStart.setHours(0, 0, 0, 0)
      monthEnd.setHours(0, 0, 0, 0)
      const isCurrentMonth = today.getFullYear() === currentYear.value && today.getMonth() === currentMonth.value
      const showRange = isCurrentMonth && today < monthEnd

      let rangeText = ''
      if (showRange) {
        const parts = startDateStr.value.split('-').map((n) => parseInt(n, 10))
        const startDate = new Date(parts[0], parts[1] - 1, parts[2])
        startDate.setHours(0, 0, 0, 0)
        const rangeStart = startDate > monthStart ? startDate : monthStart
        const rangeEnd = today
        if (rangeStart <= rangeEnd) {
          rangeText = `${formatDate(rangeStart)} ~ ${formatDate(rangeEnd)}`
        }
      }

      const defaultImage = BADGE_DEFAULT_IMAGES[tier] || ''

      const useCustomImage = !!settings.value.badgeImage
      const imageScale = useCustomImage ? settings.value.badgeImageScale || 1.0 : 1
      const imageX = useCustomImage ? settings.value.badgeImageX || 0 : 0
      const imageY = useCustomImage ? settings.value.badgeImageY || 0 : 0

      return {
        tier,
        label: t(labelKey),
        rate,
        isLight: showRange,
        rangeText,
        rangeLabel: t('badge_range_label'),
        imageSrc: settings.value.badgeImage || defaultImage,
        imageScale,
        imageX,
        imageY,
        isCustomImage: useCustomImage
      }
    })

    const shareCardBg = computed(() => {
      return settings.value.shareBg || settings.value.appBg || settings.value.bgImage || ''
    })

    const shareQuote = computed(() => {
      const custom = (settings.value.shareQuote || '').trim()
      if (custom) return custom
      const lang = settings.value.lang || 'zh'
      const list = SHARE_QUOTES[lang] || SHARE_QUOTES.zh
      const seed = (currentYear.value * 12 + currentMonth.value) % list.length
      return list[seed]
    })

    const setShareQuote = (value) => {
      settings.value.shareQuote = value
      saveSettings()
    }

    const randomizeShareQuote = () => {
      const lang = settings.value.lang || 'zh'
      settings.value.shareQuote = pickShareQuote(lang)
      saveSettings()
    }

    const clearShareBg = () => {
      settings.value.shareBg = ''
      saveSettings()
    }

    const isDark = computed(() => settings.value.theme === 'dark')

    const getDayImg = (day) => {
      const state = getDayState(day)
      if (state === 'future' || state === 'pre-start') return null
      const tasks = records.value[getDateStr(day)]
      if (!tasks || tasks.length === 0) return null
      const done = tasks.filter((t) => t.completed).length
      const p = done / tasks.length
      if (p === 1) return settings.value.imgHappy
      if (p >= 0.5) return settings.value.imgLight
      if (p > 0) return settings.value.imgHeavy
      return settings.value.imgSad
    }

    const getCurrentImg = () => {
      if (currentDayTasks.value.length === 0) return settings.value.imgSad
      const done = currentDayTasks.value.filter((t) => t.completed).length
      const p = done / currentDayTasks.value.length
      if (p === 1) return settings.value.imgHappy
      if (p >= 0.5) return settings.value.imgLight
      if (p > 0) return settings.value.imgHeavy
      return settings.value.imgSad
    }

    const getDetailTitle = () => {
      if (dayStateForDetail.value === 'future') return t('detail_future')
      if (dayStateForDetail.value === 'pre-start') return t('detail_pre')
      if (dayStateForDetail.value === 'backfill')
        return `${t('detail_pre')} (${t('backfill_unlocked')})`
      const done = currentDayTasks.value.filter((t) => t.completed).length
      if (currentDayTasks.value.length > 0 && done === currentDayTasks.value.length) return t('detail_all_done')
      return t('detail_todo')
    }

    const openDay = (day) => {
      selectedDateStr.value = getDateStr(day)
      const dayState = getDayState(day)

      if (dayState === 'backfill') {
        backfillDate.value = selectedDateStr.value
        backfillMessage.value = settings.value.lang === 'zh' ? I18N.zh.zootopia_backfill_message : I18N.en.zootopia_backfill_message
        showBackfillModal.value = true
        return
      }

      if (dayState === 'pre-start') {
        return
      }

      if (!Array.isArray(records.value[selectedDateStr.value])) {
        records.value[selectedDateStr.value] = JSON.parse(JSON.stringify(templates.value))
      }
      currentDayTasks.value = records.value[selectedDateStr.value] || []
      view.value = 'detail'
    }

    const confirmBackfill = () => {
      if (!records.value[backfillDate.value])
        records.value[backfillDate.value] = JSON.parse(JSON.stringify(templates.value))
      currentDayTasks.value = records.value[backfillDate.value]
      view.value = 'detail'
      closeBackfillModal()
    }

    const closeBackfillModal = () => {
      showBackfillModal.value = false
      backfillDate.value = ''
    }

    const loadFromTemplate = () => {
      if (confirm(t('confirm_override'))) {
        currentDayTasks.value = JSON.parse(JSON.stringify(templates.value))
        saveData()
      }
    }

    const addTemplate = () => {
      if (tempTplName.value.trim()) {
        const newTpl = { name: tempTplName.value.trim(), completed: false }
        templates.value.push(newTpl)
        // Use the real "today" date (local) to avoid mixing UI month with today's day number.
        const todayStr = formatDate(new Date())
        if (records.value[todayStr]) {
          records.value[todayStr].push(JSON.parse(JSON.stringify(newTpl)))
          saveData()
        }
        tempTplName.value = ''
        saveTpl()
      }
    }

    const removeTemplate = (i) => {
      templates.value.splice(i, 1)
      saveTpl()
    }

    const addTask = () => {
      if (tempTaskName.value.trim()) {
        currentDayTasks.value.push({ name: tempTaskName.value.trim(), completed: false })
        tempTaskName.value = ''
        saveData()
      }
    }

    const removeTask = (idx) => {
      currentDayTasks.value.splice(idx, 1)
      saveData()
    }

    const handleTaskClick = (idx) => {
      if (dayStateForDetail.value === 'future') return
      currentDayTasks.value[idx].completed = !currentDayTasks.value[idx].completed
      saveData()
    }

    const hasTasks = (day) => {
      const t = records.value[getDateStr(day)]
      return t && t.length > 0
    }

    const handleUpload = (e, key) => {
      const file = e.target.files[0]
      if (!file) return
      if (!file.type || !file.type.startsWith('image/')) {
        alert(t('alert_img_invalid_type'))
        return
      }
      if (file.size >= 4 * 1024 * 1024) {
        alert(t('alert_img_to_large'))
        return
      }

      const reader = new FileReader()
      reader.onload = (evt) => {
        settings.value[key] = evt.target.result
        if (key === 'badgeImage') {
          settings.value.badgeImageScale = 1.0
          settings.value.badgeImageX = 0
          settings.value.badgeImageY = 0
        }
        saveSettings()
      }
      reader.onerror = () => {
        alert(t('alert_img_read_fail'))
      }
      reader.readAsDataURL(file)
    }

    const saveSettings = async () => await saveToIndexedDB('settings', settings.value, 'rabbit_s_v9_8')
    const saveData = async () => await saveToIndexedDB('records', records.value, 'rabbit_r_v9_8')
    const saveTpl = async () => await saveToIndexedDB('templates', templates.value, 'rabbit_t_v9_8')
    const saveStartDate = async () => {
      await saveToIndexedDB('startDate', startDateStr.value, 'rabbit_d_v9_8')
      selectedDateStr.value = ''
    }

    const changeMonth = (d) => {
      let m = currentMonth.value + d
      if (m > 11) {
        currentMonth.value = 0
        currentYear.value++
      } else if (m < 0) {
        currentMonth.value = 11
        currentYear.value--
      } else {
        currentMonth.value = m
      }
    }

    const isToday = (d) => {
      const t = new Date()
      return d === t.getDate() && currentMonth.value === t.getMonth() && currentYear.value === t.getFullYear()
    }

    const installPWA = async () => {
      if (deferredPrompt.value) {
        deferredPrompt.value.prompt()
        const { outcome } = await deferredPrompt.value.userChoice
        if (outcome === 'accepted') {
          console.log('用户接受了 PWA 安装提示')
        } else {
          console.log('用户拒绝了 PWA 安装提示')
        }
        deferredPrompt.value = null
        showPWAInstallBanner.value = false
      }
    }

    const hidePWAInstallBanner = async () => {
      clearPwaBannerTimer()
      showPWAInstallBanner.value = false
      await saveToIndexedDB('pwaInstall', { dismissed: true }, 'pwaInstallDismissed')
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      deferredPrompt.value = e
      getFromIndexedDB('pwaInstall', 'pwaInstallDismissed')
        .then((dismissed) => {
          if (!dismissed) {
            schedulePwaBanner()
          }
        })
        .catch(() => {
          schedulePwaBanner()
        })
    }

    const handleAppInstalled = () => {
      console.log('PWA 应用已安装')
      clearPwaBannerTimer()
      showPWAInstallBanner.value = false
      deferredPrompt.value = null
    }

    onMounted(async () => {
      const r =
        (await getFromIndexedDB('records', 'rabbit_r_v9_8')) ||
        (await getFromIndexedDB('records', 'rabbit_r_v9_7')) ||
        (await getFromIndexedDB('records', 'rabbit_r_v9_5'))
      const tpl =
        (await getFromIndexedDB('templates', 'rabbit_t_v9_8')) ||
        (await getFromIndexedDB('templates', 'rabbit_t_v9_7')) ||
        (await getFromIndexedDB('templates', 'rabbit_t_v9_5'))
      const s =
        (await getFromIndexedDB('settings', 'rabbit_s_v9_8')) ||
        (await getFromIndexedDB('settings', 'rabbit_s_v9_7')) ||
        (await getFromIndexedDB('settings', 'rabbit_s_v9_5'))
      const d =
        (await getFromIndexedDB('startDate', 'rabbit_d_v9_8')) ||
        (await getFromIndexedDB('startDate', 'rabbit_d_v9_7')) ||
        (await getFromIndexedDB('startDate', 'rabbit_d_v9_5'))

      if (r) records.value = r
      if (tpl) templates.value = tpl

      if (s) {
        try {
          const loadedSettings = s
          delete loadedSettings.calendarBg
          settings.value = { ...DEFAULTS, ...loadedSettings }
          if (!settings.value.lang) settings.value.lang = 'zh'
        } catch (e) {
          console.error('加载设置时出错:', e)
          settings.value = { ...DEFAULTS }
        }
      }
      if (d) startDateStr.value = d

      if (settings.value.bgImage) document.body.style.backgroundImage = `url(${settings.value.bgImage})`
      applyTheme(settings.value.theme || 'light')

      initPWAInstall()
    })

    const initPWAInstall = () => {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.addEventListener('appinstalled', handleAppInstalled)
    }

    onBeforeUnmount(() => {
      clearPwaBannerTimer()
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    })

    const exportCsv = () => {
      const escapeCsvCell = (value) => {
        let text = String(value ?? '')

        // Prevent CSV/Excel formula injection when the cell starts with: = + - @
        if (/^[=+\-@]/.test(text)) {
          text = `'${text}`
        }

        if (/[",\r\n]/.test(text)) {
          return `"${text.replace(/"/g, '""')}"`
        }
        return text
      }

      const rows = []
      rows.push([t('csv_header_date'), t('csv_header_task_name'), t('csv_header_task_status')])

      // Only export check-in-relevant days (exclude "future plans")
      // `dateStr` is in 'YYYY-MM-DD' format so lexical compare is safe.
      const todayStr = formatDate(new Date())
      for (const dateStr in records.value) {
        if (dateStr > todayStr) continue
        const tasks = records.value[dateStr]

        if (tasks && tasks.length > 0) {
          tasks.forEach((task) => {
            rows.push([dateStr, task.name, task.completed ? '✓' : '✗'])
          })
        } else {
          rows.push([dateStr, t('csv_no_tasks'), '-'])
        }
      }

      const header = rows[0]
      const sortedRows = [header, ...rows.slice(1).sort((a, b) => a[0].localeCompare(b[0]))]
      const csvContent =
        '\uFEFF' + sortedRows.map((row) => row.map((cell) => escapeCsvCell(cell)).join(',')).join('\r\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `detailed_checkin_data_${formatDate(new Date())}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }

    watch(
      () => settings.value.bgImage,
      (newVal) => {
        if (newVal) document.body.style.backgroundImage = `url(${newVal})`
        else document.body.style.backgroundImage = ''
      }
    )

    watch(
      () => settings.value.theme,
      (newVal) => {
        applyTheme(newVal || 'light')
      }
    )

    return {
      view,
      currentYear,
      currentMonth,
      daysInMonth,
      firstDayOfWeek,
      changeMonth,
      isToday,
      startDateStr,
      monthlyStats,
      monthlyChart,
      monthlyBadge,
      isDark,
      localizedWeekdays,
      dayStateForDetail,
      openDay,
      getDayImg,
      getDayState,
      hasTasks,
      selectedDateStr,
      currentDayTasks,
      tempTaskName,
      addTask,
      removeTask,
      handleTaskClick,
      getCurrentImg,
      getDetailTitle,
      loadFromTemplate,
      showSettings,
      settings,
      handleUpload,
      saveSettings,
      saveStartDate,
      calendarStyle,
      appBackgroundStyle,
      contentStyle,
      bgLabels,
      statusImgLabels,
      showTemplates,
      templates,
      tempTplName,
      addTemplate,
      removeTemplate,
      showReport,
      t,
      formattedDateHeader,
      showExports,
      showShare,
      shareQuote,
      shareCardBg,
      setShareQuote,
      randomizeShareQuote,
      clearShareBg,
      exportCsv,
      showBackfillModal,
      backfillMessage,
      confirmBackfill,
      closeBackfillModal,
      showPWAInstallBanner,
      installPWA,
      hidePWAInstallBanner
    }
  }
}
