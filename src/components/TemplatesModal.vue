<template>
  <div class="modal-mask" @click.self="$emit('close')">
    <div class="modal-card">
      <h3>📝 {{ t('tpl_title') }}</h3>
      <input
        :value="tempTplName"
        @input="$emit('update:temp-tpl-name', $event.target.value)"
        id="template-input"
        name="templateInput"
        style="width:100%; padding:10px; border:1px solid #ddd; border-radius:6px; box-sizing:border-box;"
        :placeholder="t('tpl_input_hint')"
        @keyup.enter="$emit('add-template')"
      />
      <button class="btn-block btn-primary" style="margin-top:5px;" @click="$emit('add-template')">
        {{ t('btn_add') }}
      </button>

      <div style="max-height:200px; overflow-y:auto; margin-top:10px; text-align:left;">
        <div
          v-for="(tpl, i) in templates"
          :key="i"
          style="padding:10px; border-bottom:1px solid #eee; display:flex; justify-content:space-between;"
        >
          <span>{{ tpl.name }}</span>
          <i class="ri-delete-bin-line" style="color:#ff7675; cursor:pointer;" @click="$emit('remove-template', i)"></i>
        </div>
      </div>
      <button class="btn-block" @click="$emit('close')">{{ t('btn_done') }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TemplatesModal',
  props: {
    templates: { type: Array, required: true },
    tempTplName: { type: String, required: true },
    t: { type: Function, required: true }
  },
  emits: ['close', 'update:temp-tpl-name', 'add-template', 'remove-template']
}
</script>
