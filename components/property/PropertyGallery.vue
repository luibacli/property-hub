<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Thumbs } from 'swiper/modules'
import type { Swiper as SwiperClass } from 'swiper/types'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

defineProps<{ images: string[]; title: string }>()

const thumbsSwiper = ref<SwiperClass | null>(null)
const modules = [Navigation, Pagination, Thumbs]

function setThumbs(swiper: SwiperClass) {
  thumbsSwiper.value = swiper
}
</script>

<template>
  <div class="gallery-root select-none">
    <!-- Main slider -->
    <Swiper
      :modules="modules"
      :navigation="{ nextEl: '.swiper-next', prevEl: '.swiper-prev' }"
      :pagination="{ clickable: true }"
      :thumbs="{ swiper: thumbsSwiper }"
      :loop="images.length > 1"
      class="main-swiper rounded-2xl overflow-hidden aspect-[16/10] bg-zinc-100 dark:bg-zinc-800"
    >
      <SwiperSlide v-for="(img, i) in images" :key="i">
        <NuxtImg
          :src="img"
          :alt="`${title} — image ${i + 1}`"
          class="size-full object-cover"
          :loading="i === 0 ? 'eager' : 'lazy'"
          width="1280"
          height="800"
        />
      </SwiperSlide>

      <!-- Custom nav buttons -->
      <button
        class="swiper-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow flex items-center justify-center transition hover:scale-105 active:scale-95"
        aria-label="Previous image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <button
        class="swiper-next absolute right-3 top-1/2 -translate-y-1/2 z-10 size-9 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm shadow flex items-center justify-center transition hover:scale-105 active:scale-95"
        aria-label="Next image"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </Swiper>

    <!-- Thumbnails -->
    <Swiper
      v-if="images.length > 1"
      :modules="modules"
      :slides-per-view="Math.min(images.length, 5)"
      :space-between="8"
      watch-slides-progress
      class="thumb-swiper mt-2"
      @swiper="setThumbs"
    >
      <SwiperSlide
        v-for="(img, i) in images"
        :key="i"
        class="!h-16 rounded-lg overflow-hidden cursor-pointer opacity-50 transition-opacity [&.swiper-slide-thumb-active]:opacity-100"
      >
        <NuxtImg
          :src="img"
          :alt="`Thumbnail ${i + 1}`"
          class="size-full object-cover"
          loading="lazy"
          width="160"
          height="120"
        />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
.main-swiper :deep(.swiper-pagination-bullet) {
  @apply bg-white opacity-60;
}
.main-swiper :deep(.swiper-pagination-bullet-active) {
  @apply opacity-100;
}
</style>
