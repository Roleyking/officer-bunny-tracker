<template>
  <div class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card">
      <h3>📤 {{ t('exports_title') }}</h3>

      <div class="export-section">
        <h4>📊 {{ t('export_csv_data') }}</h4>
        <button class="export-btn" @click="$emit('export-csv')">
          <span>{{ t('btn_export_csv') }}</span>
          <i class="ri-file-text-line"></i>
        </button>
      </div>

      <button class="btn-block" @click="$emit('close')">{{ t('btn_close') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExportsModal',
  props: {
    t: { type: Function, required: true }
  },
  emits: ['close', 'export-csv']
}
</script>
