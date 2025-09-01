<template>
  <section id="gallery" class="bg-gray-50 dark:bg-gray-900 py-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div 
          v-for="n in 12" 
          :key="n"
          class="bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"
          :style="{ height: `${Math.random() * 200 + 200}px` }"
        ></div>
      </div>

      <!-- Photo Grid -->
      <div 
        v-else
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
            'group cursor-pointer overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1',
            viewMode === 'masonry' ? 'break-inside-avoid' : ''
          ]"
          @click="openLightbox(index)"
        >
          <div class="relative overflow-hidden">
            <img
              :src="photo.thumbnail"
              :alt="photo.alt"
              class="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            
            <!-- Overlay on Hover -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center">
                <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <p class="text-sm font-medium">Ver imagen</p>
              </div>
            </div>

            <!-- Category Badge -->
            <div class="absolute top-3 left-3">
              <span :class="[
                'px-2 py-1 text-xs font-semibold rounded-full',
                getCategoryColor(photo.category)
              ]">
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
            <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">
              {{ photo.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400 text-xs line-clamp-2">
              {{ photo.description }}
            </p>
            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center space-x-2">
                <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ photo.likes }}</span>
              </div>
              <button 
                @click.stop="sharePhoto(photo)"
                class="text-gray-400 hover:text-red-500 transition-colors duration-200"
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
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        </svg>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No se encontraron fotos</h3>
        <p class="text-gray-600 dark:text-gray-400 mb-4">Intenta con diferentes filtros o términos de búsqueda</p>
        <button
          @click="clearFilters"
          class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
        >
          Limpiar filtros
        </button>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <Teleport to="body">
      <div
        v-if="lightboxOpen"
        class="fixed inset-0 z-[100] bg-black bg-opacity-90 flex items-center justify-center p-4"
        @click="closeLightbox"
      >
        <div class="relative max-w-full max-h-full" @click.stop>
          <!-- Close Button -->
          <button
            @click="closeLightbox"
            class="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors duration-200"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Navigation Buttons -->
          <button
            v-if="currentPhotoIndex > 0"
            @click="previousPhoto"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 transition-colors duration-200"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <button
            v-if="currentPhotoIndex < filteredPhotos.length - 1"
            @click="nextPhoto"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-red-400 transition-colors duration-200"
          >
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          <!-- Image -->
          <img
            v-if="currentPhoto"
            :src="currentPhoto.fullSize"
            :alt="currentPhoto.alt"
            class="max-w-full max-h-full object-contain"
          />

          <!-- Photo Info -->
          <div v-if="currentPhoto" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 text-white">
            <h3 class="text-xl font-bold mb-2">{{ currentPhoto.title }}</h3>
            <p class="text-gray-300 mb-2">{{ currentPhoto.description }}</p>
            <div class="flex items-center justify-between text-sm">
              <span>{{ formatDate(currentPhoto.date) }}</span>
              <span>{{ currentPhotoIndex + 1 }} / {{ filteredPhotos.length }}</span>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

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
const loading = ref(true)
const loadingMore = ref(false)
const photos = ref<Photo[]>([])
const lightboxOpen = ref(false)
const currentPhotoIndex = ref(0)
const page = ref(1)
const hasMorePhotos = ref(true)

// Mock data
const generateMockPhotos = (count: number, startId: number = 1): Photo[] => {
  const categories = ['training', 'competitions', 'belts', 'events', 'students']
  const mockPhotos: Photo[] = []

  for (let i = 0; i < count; i++) {
    const id = startId + i
    const category = categories[Math.floor(Math.random() * categories.length)]
    
    mockPhotos.push({
      id: `photo-${id}`,
      title: `Foto de ${getCategoryName(category)} ${id}`,
      description: `Descripción de la foto ${id} mostrando momentos únicos de nuestra escuela de Taekwondo.`,
      thumbnail: `/api/placeholder/400/${Math.floor(Math.random() * 200) + 300}`,
      fullSize: `/api/placeholder/1200/${Math.floor(Math.random() * 400) + 800}`,
      alt: `Foto de Taekwondo ${id}`,
      category,
      date: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      likes: Math.floor(Math.random() * 50) + 5,
      tags: ['taekwondo', 'artes marciales', category]
    })
  }

  return mockPhotos
}

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
      photo.tags.some(tag => tag.toLowerCase().includes(query))
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

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    training: 'bg-blue-500 text-white',
    competitions: 'bg-yellow-500 text-black',
    belts: 'bg-purple-500 text-white',
    events: 'bg-green-500 text-white',
    students: 'bg-red-500 text-white'
  }
  return colors[category] || 'bg-gray-500 text-white'
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const openLightbox = (index: number) => {
  currentPhotoIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const previousPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  }
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < filteredPhotos.value.length - 1) {
    currentPhotoIndex.value++
  }
}

const loadMorePhotos = async () => {
  loadingMore.value = true
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  page.value++
  const newPhotos = generateMockPhotos(12, photos.value.length + 1)
  photos.value.push(...newPhotos)
  
  // Simulate no more photos after page 5
  if (page.value >= 5) {
    hasMorePhotos.value = false
  }
  
  loadingMore.value = false
}

const sharePhoto = (photo: Photo) => {
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
  }
}

// Lifecycle
onMounted(async () => {
  // Load initial photos
  await new Promise(resolve => setTimeout(resolve, 1000))
  photos.value = generateMockPhotos(24)
  loading.value = false

  // Add keyboard listeners
  document.addEventListener('keydown', handleKeydown)
})

// Watchers
watch(() => [props.category, props.searchQuery, props.sortBy], () => {
  // Reset to first page when filters change
  page.value = 1
  hasMorePhotos.value = true
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
