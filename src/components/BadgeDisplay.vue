<template>
  <div
    class="badge-display"
    :class="[
      sizeClass,
      tierClass,
      { 'badge-light': isLight, 'badge-custom': isCustomImage, 'badge-default': !isCustomImage }
    ]"
  >
    <div class="badge-shield">
      <picture v-if="showImage && !isCustomImage">
        <source v-if="defaultWebpSrc" :srcset="defaultWebpSrc" type="image/webp" />
        <img
          class="badge-default-image"
          :src="imageSrc"
          :alt="label"
          :fetchpriority="fetchPriority"
          @error="onImageError"
        />
      </picture>
      <div v-else-if="showImage" class="badge-icon">
        <div
          v-if="showImageBg"
          class="badge-image-bg"
          :style="{ backgroundImage: `url(${imageSrc})` }"
        ></div>
        <img
          class="badge-image-hero"
          :src="imageSrc"
          :alt="label"
          :fetchpriority="fetchPriority"
          :style="{ transform: `translate(${imageX}px, ${imageY}px) scale(${imageScale})` }"
          @error="onImageError"
        />
      </div>
      <div v-else class="badge-fallback">{{ crest }}</div>
    </div>
    <div class="badge-meta-row">
      <span class="badge-crest">{{ crest }}</span>
      <div class="badge-meta-text">
        <div class="badge-label">{{ label }}</div>
        <div class="badge-rate">{{ rate }}%</div>
      </div>
    </div>
    <div v-if="rangeText" class="badge-range">
      {{ rangeLabel }}: {{ rangeText }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'BadgeDisplay',
  props: {
    tier: { type: Number, required: true },
    label: { type: String, required: true },
    rate: { type: Number, required: true },
    isLight: { type: Boolean, default: false },
    rangeText: { type: String, default: '' },
    rangeLabel: { type: String, default: '' },
    size: { type: String, default: 'md' },
    imageSrc: { type: String, default: '' },
    imageScale: { type: Number, default: 1.4 },
    imageX: { type: Number, default: 0 },
    imageY: { type: Number, default: 0 },
    isCustomImage: { type: Boolean, default: false },
    fetchPriority: { type: String, default: 'auto' }
  },
  data() {
    return {
      imageError: false
    }
  },
  computed: {
    tierClass() {
      return `badge-tier-${this.tier}`
    },
    sizeClass() {
      return this.size === 'sm' ? 'badge-sm' : 'badge-md'
    },
    crest() {
      if (this.tier === 1) return 'I'
      if (this.tier === 2) return 'II'
      if (this.tier === 3) return 'III'
      return 'IV'
    },
    showImage() {
      return !!this.imageSrc && !this.imageError
    },
    showImageBg() {
      return this.isCustomImage
    },
    defaultWebpSrc() {
      if (this.isCustomImage || !this.imageSrc) return ''
      if (this.imageSrc.startsWith('data:')) return ''
      if (this.imageSrc.endsWith('.png')) return this.imageSrc.replace('.png', '.webp')
      return ''
    }
  },
  watch: {
    imageSrc() {
      this.imageError = false
    }
  },
  methods: {
    onImageError() {
      this.imageError = true
    }
  }
}
</script>
