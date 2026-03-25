<template>
  <div class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card">
      <h3 style="margin-top:0">⚙️ {{ t('settings_title') }}</h3>

      <div style="margin-bottom:15px;">
        <label class="setting-label">🌐 {{ t('language') }} / Language</label>
        <select
          v-model="localLang"
          id="language-select"
          name="language"
          style="width:100%; padding:8px; border:1px solid #ddd; border-radius:8px;"
          @change="onLangChange"
        >
          <option value="zh">🇨🇳 中文 (Chinese)</option>
          <option value="en">🇺🇸 English</option>
        </select>
      </div>

      <div style="margin-bottom:15px;">
        <label class="setting-label">{{ t('theme_label') }}</label>
        <select
          v-model="localTheme"
          id="theme-mode"
          name="theme"
          style="width:100%; padding:8px; border:1px solid #ddd; border-radius:8px;"
          @change="onThemeChange"
        >
          <option value="light">{{ t('theme_light') }}</option>
          <option value="dark">{{ t('theme_dark') }}</option>
        </select>
      </div>

      <div style="border-bottom:1px dashed #eee; padding-bottom:15px; margin-bottom:15px;">
        <label class="setting-label">📅 {{ t('start_date') }}</label>
        <input
          type="date"
          v-model="localStartDate"
          id="start-date"
          name="startDate"
          style="width:100%; padding:8px; border:1px solid #ddd; border-radius:8px;"
          @change="onStartDateChange"
        />
      </div>

      <div style="margin-bottom:20px;">
        <label class="setting-label">🖼️ {{ t('img_custom_title') }}</label>
        <div class="upload-row" v-for="(label, key) in statusImgLabels" :key="key">
          <img :src="settings[key]" class="preview-box" :alt="t(label.titleKey)" />
          <div style="flex:1;">
            <div style="font-size:0.85rem; font-weight:bold;">{{ t(label.titleKey) }}</div>
            <div style="font-size:0.7rem; color:#999;">{{ t(label.descKey) }}</div>
          </div>
          <label
            style="background:var(--primary); color:white; padding:5px 10px; border-radius:6px; font-size:0.75rem; cursor:pointer;"
          >
            {{ t('btn_upload') }}
            <input type="file" accept="image/*" style="display:none" @change="(e) => handleUpload(e, key)" />
          </label>
        </div>

        <div class="upload-row" v-for="(label, key) in bgLabels" :key="key">
          <img :src="getPreviewSrc(key)" class="preview-box" :alt="t(label.titleKey)" />
          <div style="flex:1;">
            <div style="font-size:0.85rem; font-weight:bold;">{{ t(label.titleKey) }}</div>
            <div style="font-size:0.7rem; color:#999;">{{ t(label.descKey) }}</div>
          </div>
          <label
            style="background:var(--primary); color:white; padding:5px 10px; border-radius:6px; font-size:0.75rem; cursor:pointer;"
          >
            {{ t('btn_upload') }}
            <input type="file" accept="image/*" style="display:none" @change="(e) => handleUpload(e, key)" />
          </label>
        </div>

        <div class="upload-row">
          <div class="badge-crop-preview">
            <div class="badge-shield badge-preview-shield" @pointerdown="onBadgePointerDown">
              <div
                v-if="settings.badgeImage"
                class="badge-image-bg"
                :style="{ backgroundImage: `url(${settings.badgeImage})` }"
              ></div>
              <img
                v-if="settings.badgeImage"
                class="badge-image-hero"
                :src="settings.badgeImage"
                alt="badge preview"
                :style="badgePreviewStyle"
              />
            </div>
          </div>
          <div style="flex:1;">
            <div style="font-size:0.85rem; font-weight:bold;">{{ t('badge_image_title') }}</div>
            <div style="font-size:0.7rem; color:#999;">{{ t('badge_image_desc') }}</div>
            <div style="font-size:0.7rem; color:#999; margin-top:2px;">{{ t('badge_image_tip') }}</div>
            <div style="margin-top:8px;">
              <input
                type="range"
                min="1"
                max="2.4"
                step="0.05"
                v-model.number="localBadgeScale"
                @input="onBadgeScaleChange"
                :disabled="!settings.badgeImage"
              />
            </div>
            <button
              type="button"
              class="btn-ghost"
              style="margin-top:6px; padding:6px 10px; border-radius:8px; border:none;"
              @click="resetBadgeCrop"
              :disabled="!settings.badgeImage"
            >
              {{ t('badge_crop_reset') }}
            </button>
            <button
              type="button"
              class="btn-ghost"
              style="margin-top:6px; padding:6px 10px; border-radius:8px; border:none;"
              @click="clearBadgeImage"
              :disabled="!settings.badgeImage"
            >
              {{ t('badge_use_default') }}
            </button>
          </div>
          <label
            style="background:var(--primary); color:white; padding:5px 10px; border-radius:6px; font-size:0.75rem; cursor:pointer;"
          >
            {{ t('btn_upload') }}
            <input type="file" accept="image/*" style="display:none" @change="(e) => handleUpload(e, 'badgeImage')" />
          </label>
        </div>

        <label class="setting-label">{{ t('fill_mode') }}</label>
        <select
          v-model="localBgMode"
          id="bg-mode"
          name="bgMode"
          style="width:100%; padding:8px; margin-top:5px; border-radius:8px; border:1px solid #ddd;"
          @change="onBgModeChange"
        >
          <option value="100% 100%">{{ t('mode_stretch') }}</option>
          <option value="cover">{{ t('mode_cover') }}</option>
          <option value="contain">{{ t('mode_contain') }}</option>
        </select>
      </div>

      <button class="btn-block" @click="$emit('close')">{{ t('btn_close') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsModal',
  props: {
    settings: { type: Object, required: true },
    startDateStr: { type: String, required: true },
    bgLabels: { type: Object, required: true },
    statusImgLabels: { type: Object, required: true },
    t: { type: Function, required: true },
    handleUpload: { type: Function, required: true },
    saveSettings: { type: Function, required: true },
    saveStartDate: { type: Function, required: true }
  },
  emits: ['close', 'update:start-date'],
  data() {
    return {
      localLang: this.settings.lang,
      localStartDate: this.startDateStr,
      localBgMode: this.settings.bgMode,
      localTheme: this.settings.theme || 'light',
      localBadgeScale: this.settings.badgeImageScale || 1.0,
      badgeDragStart: null
    }
  },
  watch: {
    startDateStr(next) {
      this.localStartDate = next
    },
    'settings.lang'(next) {
      this.localLang = next
    },
    'settings.theme'(next) {
      this.localTheme = next
    },
    'settings.bgMode'(next) {
      this.localBgMode = next
    },
    'settings.badgeImageScale'(next) {
      this.localBadgeScale = next || 1.0
    }
  },
  computed: {
    badgePreviewStyle() {
      const scale = this.localBadgeScale || 1.4
      const x = this.settings.badgeImageX || 0
      const y = this.settings.badgeImageY || 0
      return { transform: `translate(${x}px, ${y}px) scale(${scale})` }
    }
  },
  methods: {
    onLangChange() {
      this.settings.lang = this.localLang
      this.saveSettings()
    },
    onStartDateChange() {
      this.$emit('update:start-date', this.localStartDate)
      this.saveStartDate()
    },
    onThemeChange() {
      this.settings.theme = this.localTheme
      this.saveSettings()
    },
    onBgModeChange() {
      this.settings.bgMode = this.localBgMode
      this.saveSettings()
    },
    onBadgeScaleChange() {
      this.settings.badgeImageScale = this.localBadgeScale
      this.saveSettings()
    },
    onBadgePointerDown(e) {
      if (!this.settings.badgeImage) return
      e.preventDefault()
      this.badgeDragStart = {
        x: e.clientX,
        y: e.clientY,
        startX: this.settings.badgeImageX || 0,
        startY: this.settings.badgeImageY || 0
      }
      const move = (evt) => this.onBadgePointerMove(evt)
      const up = () => this.onBadgePointerUp(move, up)
      window.addEventListener('pointermove', move)
      window.addEventListener('pointerup', up, { once: true })
    },
    onBadgePointerMove(e) {
      if (!this.badgeDragStart) return
      const dx = e.clientX - this.badgeDragStart.x
      const dy = e.clientY - this.badgeDragStart.y
      this.settings.badgeImageX = this.badgeDragStart.startX + dx
      this.settings.badgeImageY = this.badgeDragStart.startY + dy
    },
    onBadgePointerUp(move, up) {
      window.removeEventListener('pointermove', move)
      if (typeof up === 'function') window.removeEventListener('pointerup', up)
      this.badgeDragStart = null
      this.saveSettings()
    },
    resetBadgeCrop() {
      this.localBadgeScale = 1.0
      this.settings.badgeImageScale = 1.0
      this.settings.badgeImageX = 0
      this.settings.badgeImageY = 0
      this.saveSettings()
    },
    clearBadgeImage() {
      this.settings.badgeImage = ''
      this.localBadgeScale = 1.0
      this.settings.badgeImageScale = 1.0
      this.settings.badgeImageX = 0
      this.settings.badgeImageY = 0
      this.saveSettings()
    },
    getPreviewSrc(key) {
      if (key === 'shareBg') {
        return this.settings.shareBg || this.settings.appBg || this.settings.bgImage
      }
      return this.settings[key]
    }
  }
}
</script>
