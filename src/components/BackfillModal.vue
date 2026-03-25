<template>
  <div class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card zootopia-modal">
      <div class="zootopia-character">🐰</div>
      <h3>{{ t('zootopia_backfill_title') }}</h3>
      <p>{{ backfillMessage }}</p>
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button class="btn-block" style="background: #6c5ce7;" @click="$emit('confirm')">
          {{ t('btn_yes') }}
        </button>
        <button class="btn-block btn-ghost" @click="$emit('close')">
          {{ t('btn_no') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BackfillModal',
  props: {
    backfillMessage: { type: String, required: true },
    t: { type: Function, required: true }
  },
  emits: ['confirm', 'close']
}
</script>
