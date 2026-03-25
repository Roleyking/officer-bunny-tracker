<template>
  <div class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card share-modal">
      <h3>🔗 {{ t('share_title') }}</h3>

      <div class="share-controls">
        <div class="share-control">
          <label class="setting-label">{{ t('share_bg_title') }}</label>
          <div class="upload-row">
            <img :src="shareCardBgPreview" class="preview-box" :alt="t('share_bg_title')" />
            <div style="flex:1;">
              <div style="font-size:0.85rem; font-weight:bold;">{{ t('share_bg_title') }}</div>
              <div style="font-size:0.7rem; color:#999;">{{ t('share_bg_desc') }}</div>
            </div>
            <div class="share-upload-actions">
              <label class="btn-mini">
                {{ t('btn_upload') }}
                <input type="file" accept="image/*" style="display:none" @change="(e) => handleUpload(e, 'shareBg')" />
              </label>
              <button class="btn-ghost btn-mini" type="button" @click="clearShareBg">
                {{ t('share_bg_reset') }}
              </button>
            </div>
          </div>
        </div>

        <div class="share-control">
          <label class="setting-label">{{ t('share_quote_title') }}</label>
          <input
            v-model="localQuote"
            type="text"
            class="share-quote-input"
            :placeholder="t('share_quote_hint')"
            @change="applyQuote"
          />
          <button class="btn-ghost btn-mini" type="button" @click="randomizeQuote">
            {{ t('share_quote_random') }}
          </button>
        </div>
      </div>

      <div class="share-preview">
        <div ref="cardEl" class="share-card" :style="shareCardStyle">
          <div class="share-card-overlay" :class="{ 'is-dark': isDark }">
            <div class="share-card-header">
              <div class="share-card-kicker">{{ t('officer_comment') }}</div>
              <div class="share-card-comment">{{ monthlyStats.longComment }}</div>
            </div>

            <div class="share-card-badge">
              <BadgeDisplay
                :tier="monthlyBadge.tier"
                :label="monthlyBadge.label"
                :rate="monthlyBadge.rate"
                :is-light="monthlyBadge.isLight"
                :range-text="monthlyBadge.rangeText"
                :range-label="monthlyBadge.rangeLabel"
                :image-src="monthlyBadge.imageSrc"
                :image-scale="monthlyBadge.imageScale"
                :image-x="monthlyBadge.imageX"
                :image-y="monthlyBadge.imageY"
                :is-custom-image="monthlyBadge.isCustomImage"
                size="md"
              />
            </div>

            <div class="share-card-chart">
              <div class="share-card-chart-title">{{ t('chart_title') }}</div>
              <canvas ref="chartEl"></canvas>
            </div>

            <div class="share-card-quote">“{{ shareQuote }}”</div>
          </div>
        </div>
      </div>

      <button class="btn-block" :disabled="isExporting" @click="downloadCard">
        {{ t('share_download') }}
      </button>
      <button class="btn-block" @click="$emit('close')">{{ t('btn_close') }}</button>
    </div>
  </div>
</template>

<script>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BadgeDisplay from './BadgeDisplay.vue'

export default {
  name: 'ShareCardModal',
  components: { BadgeDisplay },
  props: {
    monthlyStats: { type: Object, required: true },
    monthlyBadge: { type: Object, required: true },
    chartLabels: { type: Array, required: true },
    chartSeries: { type: Array, required: true },
    shareQuote: { type: String, required: true },
    shareCardBg: { type: String, required: true },
    isDark: { type: Boolean, required: true },
    t: { type: Function, required: true },
    handleUpload: { type: Function, required: true },
    setShareQuote: { type: Function, required: true },
    randomizeShareQuote: { type: Function, required: true },
    clearShareBg: { type: Function, required: true }
  },
  emits: ['close'],
  setup(props) {
    const chartEl = ref(null)
    const cardEl = ref(null)
    const isExporting = ref(false)
    const localQuote = ref(props.shareQuote || '')
    let chartInstance = null
    let ChartLib = null
    const formatLocalDate = (date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    }

    const ensureChartLib = async () => {
      if (!ChartLib) {
        const mod = await import('chart.js/auto')
        ChartLib = mod.default || mod
      }
      return ChartLib
    }

    const shareCardStyle = computed(() => {
      if (props.shareCardBg) {
        return {
          backgroundImage: `url(${props.shareCardBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      }
      return {
        background: 'linear-gradient(160deg, #cfe8ff 0%, #fff0f5 100%)'
      }
    })

    const shareCardBgPreview = computed(() => props.shareCardBg || '/rabbit-tracker-appbg.jpg')

    const getThemeColors = () => {
      return props.isDark
        ? { grid: 'rgba(255, 255, 255, 0.12)', ticks: '#c8ceda' }
        : { grid: 'rgba(0, 0, 0, 0.08)', ticks: '#636e72' }
    }

    const buildChart = async () => {
      if (!chartEl.value) return
      const Chart = await ensureChartLib()
      const existing = Chart.getChart ? Chart.getChart(chartEl.value) : null
      if (existing) {
        existing.destroy()
      }
      destroyChart()
      const { grid, ticks } = getThemeColors()
      chartInstance = new Chart(chartEl.value, {
        type: 'line',
        data: {
          labels: props.chartLabels,
          datasets: [
            {
              label: props.t('chart_cumulative_label'),
              data: props.chartSeries,
              borderColor: 'rgba(108, 92, 231, 0.95)',
              backgroundColor: 'rgba(108, 92, 231, 0.2)',
              borderWidth: 2,
              tension: 0.35,
              fill: true,
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          scales: {
            x: {
              grid: { color: grid },
              ticks: { color: ticks, maxTicksLimit: 6 },
              title: { display: false }
            },
            y: {
              beginAtZero: true,
              grid: { color: grid },
              ticks: { color: ticks, precision: 0, maxTicksLimit: 5 },
              title: { display: false }
            }
          }
        }
      })
    }

    const updateChartData = () => {
      if (!chartInstance) {
        void buildChart()
        return
      }
      chartInstance.data.labels = props.chartLabels
      chartInstance.data.datasets[0].data = props.chartSeries
      chartInstance.update()
    }

    const updateChartTheme = () => {
      if (!chartInstance) return
      const { grid, ticks } = getThemeColors()
      chartInstance.options.scales.x.grid.color = grid
      chartInstance.options.scales.y.grid.color = grid
      chartInstance.options.scales.x.ticks.color = ticks
      chartInstance.options.scales.y.ticks.color = ticks
      chartInstance.update()
    }

    const applyQuote = () => {
      props.setShareQuote(localQuote.value.trim())
    }

    const randomizeQuote = () => {
      props.randomizeShareQuote()
    }

    const downloadCard = async () => {
      if (!cardEl.value || isExporting.value) return
      isExporting.value = true
      await nextTick()
      try {
        const mod = await import('html2canvas')
        const html2canvas = mod.default || mod
        const canvas = await html2canvas(cardEl.value, {
          backgroundColor: null,
          scale: 2,
          useCORS: true
        })
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png', 1))
        if (!blob) return
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `rabbit-share-${formatLocalDate(new Date())}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      } finally {
        isExporting.value = false
      }
    }

    onMounted(() => {
      void buildChart()
    })

    onBeforeUnmount(() => {
      destroyChart()
    })

    watch(
      () => props.chartSeries,
      () => updateChartData()
    )

    watch(
      () => props.chartLabels,
      () => updateChartData()
    )

    watch(
      () => props.isDark,
      () => updateChartTheme()
    )

    watch(
      () => props.shareQuote,
      (val) => {
        localQuote.value = val || ''
      }
    )

    return {
      chartEl,
      cardEl,
      isExporting,
      shareCardStyle,
      shareCardBgPreview,
      localQuote,
      applyQuote,
      randomizeQuote,
      downloadCard
    }
  }
}
</script>
