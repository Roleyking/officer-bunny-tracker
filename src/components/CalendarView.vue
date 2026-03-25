<template>
  <div style="display:flex; flex-direction:column; height:100%;">
    <div class="header">
      <button class="btn-icon" @click="$emit('change-month', -1)" aria-label="上个月">
        <i class="ri-arrow-left-s-line"></i>
      </button>

      <h2>{{ formattedDateHeader }}</h2>

      <button class="btn-icon" @click="$emit('change-month', 1)" aria-label="下个月">
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>

    <div class="status-card" @click="$emit('open-report')">
      <div class="status-header">
        <div class="status-label">
          <i class="ri-flag-2-fill" style="color:var(--primary)"></i>
          {{ t('start_label') }}: {{ startDateStr }}
        </div>
        <BadgeDisplay
          class="status-badge"
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
          fetch-priority="high"
          size="sm"
        />
      </div>
      <div class="status-days">
        {{ monthlyStats.perfectDays }}<span>{{ t('perfect_suffix') }}</span>
      </div>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: monthlyStats.progress + '%' }"></div>
      </div>
      <div class="status-footer">
        {{ monthlyStats.shortComment }} >
      </div>
    </div>

    <div class="calendar-wrapper" :style="calendarStyle">
      <div class="weekdays">
        <div v-for="(d, index) in localizedWeekdays" :key="'weekday-' + index">{{ d }}</div>
      </div>

      <div class="calendar-grid">
        <div v-for="n in firstDayOfWeek" :key="'e' + n" class="empty-day"></div>
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="day-cell"
          :class="{
            'is-today': isToday(day),
            'is-future': getDayState(day) === 'future',
            'is-pre-start': getDayState(day) === 'pre-start',
            'is-expired': getDayState(day) === 'expired',
            'is-backfill': getDayState(day) === 'backfill'
          }"
          @click="$emit('open-day', day)"
        >
          <span class="day-num">{{ day }}</span>
          <div class="day-img-container">
            <img v-if="getDayImg(day)" :src="getDayImg(day)" class="day-rabbit-img" :alt="`Day ${day}`" />
          </div>

          <div v-if="getDayState(day) !== 'normal' && !getDayImg(day)" class="overlay-icon">
            <i v-if="getDayState(day) === 'future' && !hasTasks(day)" class="ri-lock-2-line"></i>
            <i
              v-if="getDayState(day) === 'future' && hasTasks(day)"
              class="ri-file-edit-line"
              style="color:var(--primary)"
            ></i>
            <i v-if="getDayState(day) === 'expired'" class="ri-history-line"></i>
            <i
              v-if="getDayState(day) === 'backfill'"
              class="ri-time-line"
              style="color:#e17055"
            ></i>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom-nav-container">
      <div class="bottom-nav">
        <button class="nav-btn" @click="$emit('open-settings')">
          <i class="ri-settings-4-line"></i><span>{{ t('nav_settings') }}</span>
        </button>
        <button class="nav-btn" @click="$emit('open-templates')">
          <i class="ri-list-check-2"></i><span>{{ t('nav_templates') }}</span>
        </button>
        <button class="nav-btn" @click="$emit('open-share')">
          <i class="ri-share-forward-line"></i><span>{{ t('nav_share') }}</span>
        </button>
        <button class="nav-btn" @click="$emit('open-exports')">
          <i class="ri-upload-cloud-line"></i><span>{{ t('nav_exports') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import BadgeDisplay from './BadgeDisplay.vue'

export default {
  name: 'CalendarView',
  components: { BadgeDisplay },
  props: {
    formattedDateHeader: { type: String, required: true },
    startDateStr: { type: String, required: true },
    monthlyStats: { type: Object, required: true },
    monthlyBadge: { type: Object, required: true },
    calendarStyle: { type: Object, required: true },
    localizedWeekdays: { type: Array, required: true },
    firstDayOfWeek: { type: Number, required: true },
    daysInMonth: { type: Number, required: true },
    isToday: { type: Function, required: true },
    getDayState: { type: Function, required: true },
    getDayImg: { type: Function, required: true },
    hasTasks: { type: Function, required: true },
    t: { type: Function, required: true }
  },
  emits: ['change-month', 'open-report', 'open-day', 'open-settings', 'open-templates', 'open-share', 'open-exports']
}
</script>
