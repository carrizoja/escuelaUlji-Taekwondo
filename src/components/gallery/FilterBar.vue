<template>
  <section class="tone-dark !bg-surface py-4 md:py-8 sticky top-20 z-30 shadow-sm border-b border-line">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col space-y-4">
        
        <!-- Category Filters -->
        <div class="overflow-x-auto scrollbar-hide">
          <div class="flex gap-2 pb-2 min-w-max">
            <button
              v-for="category in categories"
              :key="category.id"
              @click="setActiveCategory(category.id)"
              :class="[
                'px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap',
                activeCategory === category.id
                  ? 'bg-brand-red-deep text-white shadow-lg'
                  : 'bg-card text-fg hover:bg-bg hover:text-eyebrow'
              ]"
            >
              <span class="block md:inline">{{ category.name }}</span>
              <span class="hidden md:inline ml-2 text-xs opacity-75">({{ category.count }})</span>
            </button>
          </div>
        </div>

        <!-- Search and View Options -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
          <!-- Search Input -->
          <div class="relative flex-1 sm:max-w-xs">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar en galería..."
              class="w-full pl-10 pr-4 py-2 border border-line rounded-lg bg-card text-fg placeholder-muted focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
            />
          </div>

          <div class="flex items-center justify-between sm:justify-start space-x-3">
            <!-- View Toggle -->
            <div class="flex items-center bg-card rounded-lg p-1">
              <button
                @click="setViewMode('grid')"
                :class="[
                  'p-2 rounded-md transition-colors duration-200',
                  viewMode === 'grid'
                    ? 'bg-bg text-eyebrow shadow-sm'
                    : 'text-muted hover:text-fg'
                ]"
                title="Vista en cuadrícula"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                </svg>
              </button>
              <button
                @click="setViewMode('masonry')"
                :class="[
                  'p-2 rounded-md transition-colors duration-200',
                  viewMode === 'masonry'
                    ? 'bg-bg text-eyebrow shadow-sm'
                    : 'text-muted hover:text-fg'
                ]"
                title="Vista mosaico"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h3a1 1 0 011 1v7a1 1 0 01-1 1h-3a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h3a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7zM10 9a1 1 0 011-1h3a1 1 0 011 1v11a1 1 0 01-1 1h-3a1 1 0 01-1-1V9z"></path>
                </svg>
              </button>
            </div>

            <!-- Sort Dropdown -->
            <select
              v-model="sortBy"
              class="px-3 py-2 border border-line rounded-lg bg-card text-fg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm min-w-0 flex-shrink-0"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
              <option value="popular">Más populares</option>
              <option value="alphabetical">A-Z</option>
            </select>
          </div>
        </div>

        <!-- Active Filters Display -->
        <div v-if="hasActiveFilters" class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <span class="text-sm text-muted flex-shrink-0">Filtros activos:</span>
          <div class="flex flex-wrap gap-2">
            <span
              v-if="searchQuery"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs border border-line bg-card text-eyebrow"
            >
              <span class="truncate max-w-32">"{{ searchQuery }}"</span>
              <button @click="searchQuery = ''" class="ml-1 hover:text-fg flex-shrink-0">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
            <span
              v-if="activeCategory !== 'all'"
              class="inline-flex items-center px-3 py-1 rounded-full text-xs border border-line bg-card text-fg"
            >
              {{ getCategoryName(activeCategory) }}
              <button @click="setActiveCategory('all')" class="ml-1 hover:text-eyebrow flex-shrink-0">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </span>
          </div>
          <button
            @click="clearAllFilters"
            class="text-xs text-eyebrow hover:text-fg underline flex-shrink-0"
          >
            Limpiar todo
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { photoCategories } from '../../data/photos.js'

// Props
interface Props {
  initialCategory?: string
  initialViewMode?: 'grid' | 'masonry'
}

const props = withDefaults(defineProps<Props>(), {
  initialCategory: 'all',
  initialViewMode: 'masonry'
})

// Emits
const emit = defineEmits<{
  categoryChange: [category: string]
  searchChange: [query: string]
  viewModeChange: [mode: 'grid' | 'masonry']
  sortChange: [sort: string]
}>()

// Reactive state
const activeCategory = ref(props.initialCategory)
const searchQuery = ref('')
const viewMode = ref(props.initialViewMode)
const sortBy = ref('newest')

// Categories data from photos.js
const categories = ref(photoCategories)

// Computed
const hasActiveFilters = computed(() => {
  return searchQuery.value.length > 0 || activeCategory.value !== 'all'
})

// Methods
const setActiveCategory = (category: string) => {
  activeCategory.value = category
  emit('categoryChange', category)
}

const setViewMode = (mode: 'grid' | 'masonry') => {
  viewMode.value = mode
  emit('viewModeChange', mode)
}

const getCategoryName = (categoryId: string): string => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : categoryId
}

const clearAllFilters = () => {
  activeCategory.value = 'all'
  searchQuery.value = ''
  sortBy.value = 'newest'
  emit('categoryChange', 'all')
  emit('searchChange', '')
  emit('sortChange', 'newest')
}

// Watchers
watch(searchQuery, (newQuery) => {
  emit('searchChange', newQuery)
})

watch(sortBy, (newSort) => {
  emit('sortChange', newSort)
})
</script>

<style scoped>
.scrollbar-hide {
  /* Hide scrollbar for Chrome, Safari and Opera */
  -webkit-overflow-scrolling: touch;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Ensure text truncation works properly */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
