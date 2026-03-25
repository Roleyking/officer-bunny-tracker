<template>
  <div class="slide-panel">
    <div class="header">
      <button class="btn-icon" @click="$emit('back')"><i class="ri-arrow-left-line"></i></button>
      <h2>{{ selectedDateStr }}</h2>
      <div style="width:30px"></div>
    </div>

    <div class="detail-hero">
      <img :src="getCurrentImg()" class="detail-img" :alt="getDetailTitle()" />
      <div style="font-weight:bold; color:#2d3436; font-size:1.1rem; margin-top:10px;">
        {{ getDetailTitle() }}
      </div>
    </div>

    <div style="flex:1; padding:20px; overflow-y:auto;">
      <div v-if="currentDayTasks.length === 0 && dayStateForDetail !== 'pre-start'" style="text-align:center; margin-bottom:20px;">
        <button class="btn-block btn-ghost" style="padding:10px; margin:0;" @click="$emit('load-template')">
          <i class="ri-download-2-line"></i> {{ t('btn_load_tpl') }}
        </button>
      </div>

      <div v-if="dayStateForDetail !== 'pre-start'" style="display:flex; margin-bottom:15px; gap:10px;">
        <input
          :value="tempTaskName"
          @input="$emit('update:temp-task-name', $event.target.value)"
          id="task-input"
          name="taskInput"
          style="flex:1; padding:12px; border:1px solid #ddd; border-radius:12px; outline:none;"
          :placeholder="t('input_task')"
          @keyup.enter="$emit('add-task')"
        />
        <button
          @click="$emit('add-task')"
          style="width:50px; background:var(--primary); color:white; border:none; border-radius:12px;"
        >
          <i class="ri-add-line"></i>
        </button>
      </div>

      <div
        v-for="(task, idx) in currentDayTasks"
        :key="idx"
        class="task-item"
        :class="{ done: task.completed }"
        @click="$emit('toggle-task', idx)"
      >
        <div class="check-circle"><i v-if="task.completed" class="ri-check-line"></i></div>
        <span style="flex:1; font-weight:500;">{{ task.name }}</span>
        <i
          class="ri-close-line"
          style="color:#ff7675; padding:5px; font-size:1.2rem;"
          @click.stop="$emit('remove-task', idx)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DetailView',
  props: {
    selectedDateStr: { type: String, required: true },
    currentDayTasks: { type: Array, required: true },
    dayStateForDetail: { type: String, required: true },
    tempTaskName: { type: String, required: true },
    getCurrentImg: { type: Function, required: true },
    getDetailTitle: { type: Function, required: true },
    t: { type: Function, required: true }
  },
  emits: [
    'back',
    'load-template',
    'update:temp-task-name',
    'add-task',
    'toggle-task',
    'remove-task'
  ]
}
</script>
