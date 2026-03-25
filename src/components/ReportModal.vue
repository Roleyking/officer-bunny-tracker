<template>
  <div class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card" style="text-align:center;">
      <div style="font-size:3rem; margin-bottom:10px;">{{ monthlyStats.emoji }}</div>
      <h3>{{ t('report_title') }}</h3>
      <div class="report-comment">
        <p class="report-comment-title">👮 <strong>{{ t('officer_comment') }}:</strong></p>
        <p class="report-comment-text">{{ monthlyStats.longComment }}</p>
      </div>

      <div class="report-badge">
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

      <div class="report-chart">
        <div class="report-chart-title">{{ t('chart_title') }}</div>
        <canvas ref="chartEl" height="160"></canvas>
      </div>
      <p>
        {{ t('valid_days') }}:
        <strong style="color:#2d3436">{{ monthlyStats.validDays }} {{ t('day_unit') }}</strong>
      </p>
      <p>
        {{ t('perfect_days') }}:
        <strong style="color:var(--primary)">{{ monthlyStats.perfectDays }} {{ t('day_unit') }}</strong>
      </p>
      <button class="btn-block" @click="$emit('close')">{{ t('btn_roger') }}</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import BadgeDisplay from './BadgeDisplay.vue'

export default {
  name: 'ReportModal',
  components: { BadgeDisplay },
  props: {
    monthlyStats: { type: Object, required: true },
    monthlyBadge: { type: Object, required: true },
    chartLabels: { type: Array, required: true },
    chartSeries: { type: Array, required: true },
    isDark: { type: Boolean, required: true },
    t: { type: Function, required: true }
  },
  emits: ['close'],
  setup(props) {
    const chartEl = ref(null)
    let chartInstance = null
    let ChartLib = null

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
              pointRadius: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
          },
          scales: {
            x: {
              grid: { color: grid },
              ticks: { color: ticks },
              title: { display: true, text: props.t('chart_day_label'), color: ticks, font: { size: 11 } }
            },
            y: {
              beginAtZero: true,
              grid: { color: grid },
              ticks: { color: ticks, precision: 0 },
              title: {
                display: true,
                text: props.t('chart_cumulative_label'),
                color: ticks,
                font: { size: 11 }
              }
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

    return { chartEl }
  }
}
</script>
