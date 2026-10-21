<template>
  <section class="bg-[#5d6c51] dark:bg-[#304530] pt-8 px-4 pb-8">
    <div class="max-w-7xl mx-auto text-center text-white mb-12">
      <h2 class="text-3xl md:text-4xl font-light">
        Lo que dicen de nosotros
      </h2>
      <p class="text-base md:text-lg mt-2">
        Descubrí por qué nuestros clientes aman nuestros servicios y unite a
        nuestra comunidad.
      </p>
    </div>
    <div class="max-w-7xl mx-auto flex flex-col items-center">
      <div class="w-[350px] md:w-[400px] rounded-xl overflow-hidden relative h-[350px]">
        <div
          :key="current"
          :class="[
            'bg-white dark:bg-[#E2E0D4] rounded-t-full rounded-b-xl p-6 text-center text-[#304530] dark:text-[#304530] shadow-md absolute w-full transition-transform duration-500',
            direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          ]"
        >
          <img
            :src="testimonials[current].img"
            :alt="testimonials[current].name"
            class="mx-auto rounded-full w-22 h-22 object-cover mb-4"
          />
          <h3 class="font-bold">{{ testimonials[current].name }}</h3>
          <div class="flex justify-center my-2">
            <span class="text-yellow-500 dark:text-yellow-400">★★★★★</span>
          </div>
          <p class="text-sm">{{ testimonials[current].text }}</p>
        </div>
      </div>
      <div class="flex justify-center items-center space-x-4">
        <button
          type="button"
          @click="prev"
          class="rotate-180 text-white bg-[#5d6c51] hover:bg-[#304530] dark:bg-[#304530] dark:hover:bg-[#E2E0D4] dark:hover:text-[#304530] font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
          <span class="sr-only">Icon description</span>
        </button>
        <button
          type="button"
          @click="next"
          class="text-white bg-[#5d6c51] hover:bg-[#304530] dark:bg-[#304530] dark:hover:bg-[#E2E0D4] dark:hover:text-[#304530] font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 transition-all duration-300 ease-in-out hover:scale-105 shadow-lg"
        >
          <svg
            class="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
          <span class="sr-only">Icon description</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { testimonials } from '../../data/testimonials.js'

// Reactive state
const current = ref(0)
const direction = ref('right')
const isAutoPlaying = ref(true)
let autoSlideInterval: NodeJS.Timeout | null = null
let resumeTimeout: NodeJS.Timeout | null = null

// Auto-slide functionality
const startAutoSlide = () => {
  if (!isAutoPlaying.value) return
  
  autoSlideInterval = setInterval(() => {
    direction.value = 'right'
    current.value = (current.value + 1) % testimonials.length
  }, 5000) // 5 seconds
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

const clearResumeTimeout = () => {
  if (resumeTimeout) {
    clearTimeout(resumeTimeout)
    resumeTimeout = null
  }
}

// Navigation functions
const prev = () => {
  isAutoPlaying.value = false // Stop auto-play when user interacts
  stopAutoSlide()
  clearResumeTimeout()
  
  direction.value = 'left'
  current.value = (current.value - 1 + testimonials.length) % testimonials.length
  
  // Resume auto-play after 10 seconds of inactivity
  resumeTimeout = setTimeout(() => {
    isAutoPlaying.value = true
    startAutoSlide()
  }, 10000)
}

const next = () => {
  isAutoPlaying.value = false // Stop auto-play when user interacts
  stopAutoSlide()
  clearResumeTimeout()
  
  direction.value = 'right'
  current.value = (current.value + 1) % testimonials.length
  
  // Resume auto-play after 10 seconds of inactivity
  resumeTimeout = setTimeout(() => {
    isAutoPlaying.value = true
    startAutoSlide()
  }, 10000)
}

// Watch for changes in isAutoPlaying to start/stop auto-slide
watch(isAutoPlaying, (newValue) => {
  if (newValue) {
    startAutoSlide()
  } else {
    stopAutoSlide()
  }
})

// Lifecycle hooks
onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
  clearResumeTimeout()
})
</script>

<style scoped>
@keyframes slide-in-right {
  0% { 
    transform: translateX(100%); 
    opacity: 0; 
  }
  100% { 
    transform: translateX(0); 
    opacity: 1; 
  }
}

@keyframes slide-in-left {
  0% { 
    transform: translateX(-100%); 
    opacity: 0; 
  }
  100% { 
    transform: translateX(0); 
    opacity: 1; 
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s;
}

.animate-slide-in-left {
  animation: slide-in-left 0.5s;
}
</style>