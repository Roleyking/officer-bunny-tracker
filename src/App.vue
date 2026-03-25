<template>
  <div id="app-container">
    <div
      id="app-background"
      :style="appBackgroundStyle"
      v-show="settings.appBg"
    ></div>

    <main id="app-content" :style="contentStyle">
      <CalendarView
        v-if="view === 'calendar'"
        :formatted-date-header="formattedDateHeader"
        :start-date-str="startDateStr"
        :monthly-stats="monthlyStats"
        :monthly-badge="monthlyBadge"
        :calendar-style="calendarStyle"
        :localized-weekdays="localizedWeekdays"
        :first-day-of-week="firstDayOfWeek"
        :days-in-month="daysInMonth"
        :is-today="isToday"
        :get-day-state="getDayState"
        :get-day-img="getDayImg"
        :has-tasks="hasTasks"
        :t="t"
        @change-month="changeMonth"
        @open-report="showReport = true"
        @open-day="openDay"
        @open-settings="showSettings = true"
        @open-templates="showTemplates = true"
        @open-exports="showExports = true"
        @open-share="showShare = true"
      />

      <DetailView
        v-if="view === 'detail'"
        :selected-date-str="selectedDateStr"
        :current-day-tasks="currentDayTasks"
        :day-state-for-detail="dayStateForDetail"
        :temp-task-name="tempTaskName"
        :get-current-img="getCurrentImg"
        :get-detail-title="getDetailTitle"
        :t="t"
        @back="view = 'calendar'"
        @load-template="loadFromTemplate"
        @update:temp-task-name="tempTaskName = $event"
        @add-task="addTask"
        @toggle-task="handleTaskClick"
        @remove-task="removeTask"
      />

      <SettingsModal
        v-if="showSettings"
        :settings="settings"
        :start-date-str="startDateStr"
        :bg-labels="bgLabels"
        :status-img-labels="statusImgLabels"
        :t="t"
        :handle-upload="handleUpload"
        :save-settings="saveSettings"
        :save-start-date="saveStartDate"
        @close="showSettings = false"
        @update:start-date="startDateStr = $event"
      />

      <ReportModal
        v-if="showReport"
        :monthly-stats="monthlyStats"
        :chart-labels="monthlyChart.labels"
        :chart-series="monthlyChart.series"
        :is-dark="isDark"
        :monthly-badge="monthlyBadge"
        :t="t"
        @close="showReport = false"
      />

      <TemplatesModal
        v-if="showTemplates"
        :templates="templates"
        :temp-tpl-name="tempTplName"
        :t="t"
        @close="showTemplates = false"
        @update:temp-tpl-name="tempTplName = $event"
        @add-template="addTemplate"
        @remove-template="removeTemplate"
      />

      <ExportsModal
        v-if="showExports"
        :t="t"
        @close="showExports = false"
        @export-csv="exportCsv"
      />

      <ShareCardModal
        v-if="showShare"
        :monthly-stats="monthlyStats"
        :monthly-badge="monthlyBadge"
        :chart-labels="monthlyChart.labels"
        :chart-series="monthlyChart.series"
        :share-quote="shareQuote"
        :share-card-bg="shareCardBg"
        :is-dark="isDark"
        :t="t"
        :handle-upload="handleUpload"
        :set-share-quote="setShareQuote"
        :randomize-share-quote="randomizeShareQuote"
        :clear-share-bg="clearShareBg"
        @close="showShare = false"
      />

      <BackfillModal
        v-if="showBackfillModal"
        :backfill-message="backfillMessage"
        :t="t"
        @confirm="confirmBackfill"
        @close="closeBackfillModal"
      />

      <PwaInstallBanner
        v-if="showPWAInstallBanner"
        @install="installPWA"
        @dismiss="hidePWAInstallBanner"
      />
    </main>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import appLogic from './app-logic'
import CalendarView from './components/CalendarView.vue'
import DetailView from './components/DetailView.vue'
import SettingsModal from './components/SettingsModal.vue'
import TemplatesModal from './components/TemplatesModal.vue'
import ExportsModal from './components/ExportsModal.vue'
import ReportModal from './components/ReportModal.vue'
import BackfillModal from './components/BackfillModal.vue'
import PwaInstallBanner from './components/PwaInstallBanner.vue'

const ShareCardModal = defineAsyncComponent(() => import('./components/ShareCardModal.vue'))

export default {
  ...appLogic,
  components: {
    CalendarView,
    DetailView,
    SettingsModal,
    TemplatesModal,
    ExportsModal,
    ReportModal,
    ShareCardModal,
    BackfillModal,
    PwaInstallBanner
  }
}
</script>
