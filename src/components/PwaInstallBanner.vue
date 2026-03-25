<template>
  <div class="pwa-install-banner">
    <div>
      <div style="font-weight: bold; color: #2d3436;">安装应用</div>
      <div style="font-size: 0.8rem; color: #666;">将自律警官兔添加到主屏幕</div>
    </div>
    <button @click="$emit('install')">安装</button>
    <button class="close-btn" @click="$emit('dismiss')">×</button>
  </div>
</template>

<script>
export default {
  name: 'PwaInstallBanner',
  emits: ['install', 'dismiss']
}
</script>
