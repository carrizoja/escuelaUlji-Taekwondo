<template>
  <section id="gallery" class="tone-dark py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="n in 12" 
          :key="n"
          class="bg-card rounded-lg animate-shimmer"
          :style="{ height: `${getSkeletonHeight(n)}px` }"
        ></div>
      </div>

      <!-- Photo Grid -->
      <div 
        v-else-if="photos.length > 0"
        :class="[
          'transition-all duration-500',
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
        ]"
      >
        <div
          v-for="(photo, index) in filteredPhotos"
          :key="photo.id"
          :class="[
            'group cursor-pointer overflow-hidden rounded-lg border border-line bg-card shadow-lg hover:shadow-xl transition-all duration-300 transform',
            viewMode === 'masonry' ? 'break-inside-avoid' : ''
          ]"
          @click="openLightbox(index)"
        >
          <div class="relative overflow-hidden">
            <img
              :src="thumbnailUrl(photo.thumbnail)"
              :alt="photo.alt"
              class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            <!-- Overlay on Hover -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center transform translate-y-2 group-hover:translate-y-0">
                <svg class="w-12 h-12 mx-auto mb-2 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p class="text-sm font-medium">Ver imagen</p>
              </div>
            </div>

            <!-- Category Badge -->
            <div class="absolute top-3 left-3">
              <span class="px-2 py-1 text-xs font-semibold rounded-full bg-black/80 text-white border border-white/25">
                {{ getCategoryName(photo.category) }}
              </span>
            </div>

            <!-- Date Badge -->
            <div class="absolute top-3 right-3">
              <span class="bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded-full">
                {{ formatDate(photo.date) }}
              </span>
            </div>
          </div>

          <!-- Photo Info -->
          <div class="p-4">
            <h3 class="font-semibold text-fg text-sm mb-1 line-clamp-2">
              {{ photo.title }}
            </h3>
            <p class="text-muted text-xs line-clamp-2">
              {{ photo.description }}
            </p>
            <p v-if="photo.tags && photo.tags.length > 0" class="text-muted text-xs line-clamp-2">
              {{ Array.isArray(photo.tags) ? photo.tags.join(', ') : '' }}
            </p>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-xs text-muted">{{ photo.likes }}</span>
              </div>
              <button 
                @click.stop="sharePhoto(photo)"
                class="text-muted hover:text-red-500 transition-colors duration-200"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMorePhotos && !loading" class="text-center mt-12">
        <button
          @click="loadMorePhotos"
          :disabled="loadingMore"
          class="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 inline-flex items-center"
        >
          <svg v-if="loadingMore" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ loadingMore ? 'Cargando...' : 'Cargar más fotos' }}
        </button>
      </div>

      <!-- No Results -->
      <div v-if="!loading && filteredPhotos.length === 0" class="text-center py-16">
        <svg class="w-16 h-16 text-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-fg mb-2">No se encontraron fotos</h3>
        <p class="text-muted mb-4">Intenta con diferentes filtros o términos de búsqueda</p>
        <button
          @click="clearFilters"
          class="text-eyebrow hover:text-fg font-medium"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body" v-if="isMounted">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4"
        @click="closeLightbox"
      >
        <div class="relative max-w-full max-h-full w-full h-full flex items-center justify-center" @click.stop>
          <!-- Close Button -->
          <button
            @click="closeLightbox"
            class="absolute top-4 right-4 z-10 text-white hover:text-red-400 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-2"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Zoom Controls -->
          <div class="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            <button
              @click="zoomIn"
              class="text-white hover:text-red-400 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-2"
              title="Zoom In (+)"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
            <button
              @click="zoomOut"
              class="text-white hover:text-red-400 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-2"
              title="Zoom Out (-)"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 12H6"></path>
              </svg>
            </button>
            <button
              @click="resetZoom"
              class="text-white hover:text-red-400 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-2"
              title="Reset Zoom (0)"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>
            <button
              @click="fitToScreen"
              class="text-white hover:text-red-400 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-2"
              title="Fit to Screen (F)"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h4V4m12 4h-4V4M4 16h4v4m12-4h-4v4"></path>
              </svg>
            </button>
          </div>

          <!-- Zoom Level Indicator -->
          <div class="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 text-white bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm">
            {{ Math.round(imageScale * 100) }}%
          </div>

          <!-- Navigation Buttons -->
          <button
            v-if="currentPhotoIndex > 0"
            @click="previousPhoto"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-3 z-10"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <button
            v-if="currentPhotoIndex < filteredPhotos.length - 1"
            @click="nextPhoto"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 transition-colors duration-200 bg-black bg-opacity-50 rounded-full p-3 z-10"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Image Container -->
          <div 
            class="flex items-center justify-center w-full h-full overflow-hidden"
            @wheel="handleWheel"
          >
            <img
              v-if="currentPhoto"
              ref="imageRef"
              :src="currentPhoto.fullSize"
              :alt="currentPhoto.alt"
              class="transition-transform duration-200 select-none"
              :class="{ 'cursor-move': imageScale > 1, 'cursor-zoom-in': imageScale === 1 }"
              :style="{
                transform: `scale(${imageScale}) translate(${imagePosition.x / imageScale}px, ${imagePosition.y / imageScale}px)`,
                maxWidth: imageScale === 1 ? '90vw' : 'none',
                maxHeight: imageScale === 1 ? '90vh' : 'none'
              }"
              @mousedown="startDrag"
              @dblclick="imageScale === 1 ? zoomIn() : resetZoom()"
              draggable="false"
            />
          </div>

          <!-- Photo Info -->
          <div v-if="currentPhoto" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
            <h3 class="text-xl font-bold mb-2">{{ currentPhoto.title }}</h3>
            <p class="text-gray-300 mb-2">{{ currentPhoto.description }}</p>
            <div class="flex items-center justify-between text-sm">
              <span>{{ formatDate(currentPhoto.date) }}</span>
              <span>{{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }}</span>
            </div>
          </div>

          <!-- Help Text -->
          <div class="absolute bottom-20 right-4 text-white text-xs bg-black bg-opacity-50 px-3 py-2 rounded hidden md:block">
            <div>ESC: Cerrar</div>
            <div>←/→: Navegar</div>
            <div>+/-: Zoom</div>
            <div>0: Reset</div>
            <div>F: Ajustar</div>
            <div>Doble clic: Zoom</div>
            <div>Rueda: Zoom</div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getPhotos } from '../../data/photos.js'
import { cloudinaryWidth } from '../../utils/cloudinary.js'

// Props
interface Props {
  viewMode?: 'grid' | 'masonry'
  category?: string
  searchQuery?: string
  sortBy?: string
}

const props = withDefaults(defineProps<Props>(), {
  viewMode: 'masonry',
  category: 'all',
  searchQuery: '',
  sortBy: 'newest'
})

// Photo interface
interface Photo {
  id: string
  title: string
  description: string
  thumbnail: string
  fullSize: string
  alt: string
  category: string
  date: string
  likes: number
  tags: string[]
}

// Reactive state
const loading = ref(false) // Start as false to avoid hydration issues, will be set to true in onMounted
const loadingMore = ref(false)
const photos = ref<Photo[]>([])
const lightboxOpen = ref(false)
const currentPhotoIndex = ref(0)
const page = ref(1)
const hasMorePhotos = ref(false) // Set to false since we have static data
const imageScale = ref(1)
const imagePosition = ref({ x: 0, y: 0 })
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const imageRef = ref<HTMLImageElement | null>(null)
const isMounted = ref(false)

// Computed
const filteredPhotos = computed(() => {
  let filtered = photos.value

  // Filter by category
  if (props.category !== 'all') {
    filtered = filtered.filter(photo => photo.category === props.category)
  }

  // Filter by search query
  if (props.searchQuery) {
    const query = props.searchQuery.toLowerCase()
    filtered = filtered.filter(photo => 
      photo.title.toLowerCase().includes(query) ||
      photo.description.toLowerCase().includes(query) ||
      (Array.isArray(photo.tags) && photo.tags.some(tag => tag.toLowerCase().includes(query)))
    )
  }

  // Sort photos
  switch (props.sortBy) {
    case 'oldest':
      filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      break
    case 'popular':
      filtered = filtered.sort((a, b) => b.likes - a.likes)
      break
    case 'alphabetical':
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title))
      break
    default: // newest
      filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  return filtered
})

const currentPhoto = computed(() => {
  return filteredPhotos.value[currentPhotoIndex.value] || null
})

// Methods
// Grid cards are at most ~600px wide: serve a resized copy (the lightbox keeps fullSize)
const thumbnailUrl = (url: string): string => cloudinaryWidth(url, 600)

const getSkeletonHeight = (index: number): number => {
  // Use a deterministic height based on index to avoid hydration mismatches
  const heights = [250, 300, 280, 320, 240, 350, 290, 260, 310, 270, 330, 285]
  return heights[index % heights.length]
}

const getCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    training: 'Entrenamiento',
    competitions: 'Competencia',
    belts: 'Examen',
    events: 'Evento',
    students: 'Estudiantes'
  }
  return names[category] || category
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openLightbox = (index: number) => {
  if (!isMounted.value) return // Prevent execution during SSR
  
  currentPhotoIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
  // Reset zoom and position
  imageScale.value = 1
  imagePosition.value = { x: 0, y: 0 }
}

const closeLightbox = () => {
  if (!isMounted.value) return // Prevent execution during SSR
  
  lightboxOpen.value = false
  document.body.style.overflow = ''
  // Reset zoom and position
  imageScale.value = 1
  imagePosition.value = { x: 0, y: 0 }
}

const zoomIn = () => {
  if (imageScale.value < 3) {
    imageScale.value = Math.min(imageScale.value + 0.25, 3)
  }
}

const zoomOut = () => {
  if (imageScale.value > 0.5) {
    imageScale.value = Math.max(imageScale.value - 0.25, 0.5)
    // Reset position if zoomed out too much
    if (imageScale.value === 1) {
      imagePosition.value = { x: 0, y: 0 }
    }
  }
}

const resetZoom = () => {
  imageScale.value = 1
  imagePosition.value = { x: 0, y: 0 }
}

const fitToScreen = () => {
  imageScale.value = 0.8
  imagePosition.value = { x: 0, y: 0 }
}

// Mouse drag functionality
const startDrag = (event: MouseEvent) => {
  if (imageScale.value > 1) {
    isDragging.value = true
    dragStart.value = {
      x: event.clientX - imagePosition.value.x,
      y: event.clientY - imagePosition.value.y
    }
    event.preventDefault()
  }
}

const onDrag = (event: MouseEvent) => {
  if (isDragging.value && imageScale.value > 1) {
    imagePosition.value = {
      x: event.clientX - dragStart.value.x,
      y: event.clientY - dragStart.value.y
    }
    event.preventDefault()
  }
}

const endDrag = () => {
  isDragging.value = false
}

// Wheel zoom functionality
const handleWheel = (event: WheelEvent) => {
  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
    // Reset zoom and position when changing photos
    imageScale.value = 1
    imagePosition.value = { x: 0, y: 0 }
  }
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < filteredPhotos.value.length - 1) {
    currentPhotoIndex.value++
    // Reset zoom and position when changing photos
    imageScale.value = 1
    imagePosition.value = { x: 0, y: 0 }
  }
}

const loadMorePhotos = async () => {
  // Since we have static data, this function is no longer needed
  // But keeping it for compatibility
  loadingMore.value = true
  await new Promise(resolve => setTimeout(resolve, 500))
  loadingMore.value = false
}

const sharePhoto = (photo: Photo) => {
  if (!isMounted.value) return // Prevent execution during SSR
  
  if (navigator.share) {
    navigator.share({
      title: photo.title,
      text: photo.description,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert('Enlace copiado al portapapeles')
  }
}

const clearFilters = () => {
  // Emit events to parent to clear filters
  // This would typically be handled by the parent component
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (!lightboxOpen.value) return

  switch (event.key) {
    case 'Escape':
      closeLightbox()
      break
    case 'ArrowLeft':
      previousPhoto()
      break
    case 'ArrowRight':
      nextPhoto()
      break
    case '+':
    case '=':
      event.preventDefault()
      zoomIn()
      break
    case '-':
      event.preventDefault()
      zoomOut()
      break
    case '0':
      event.preventDefault()
      resetZoom()
      break
    case 'f':
    case 'F':
      event.preventDefault()
      fitToScreen()
      break
  }
}

// Lifecycle
onMounted(async () => {
  // Set mounted state first to avoid hydration issues
  isMounted.value = true
  
  // Now set loading to true for the loading animation
  loading.value = true
  
  try {
    // Load photos from Google Sheets or fallback data
    photos.value = await getPhotos()
  } catch (error) {
    console.error('Error loading photos:', error)
    // Photos will remain empty array, which will show "No photos found"
  } finally {
    loading.value = false
  }

  // Add keyboard listeners
  document.addEventListener('keydown', handleKeydown)
  
  // Add mouse event listeners for dragging
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
})

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
})

// Watchers
watch(() => [props.category, props.searchQuery, props.sortBy], () => {
  // Reset to first page when filters change
  page.value = 1
  // No need to reset hasMorePhotos since we have static data
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
