<template>
  <section class="bg-white dark:bg-gray-900 py-8 sticky top-16 z-40 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        
        <!-- Category Filters -->
        <div class="flex flex-wrap gap-2">
          <button
            v-for="category in categories"
            :key="category.id"
            @click="setActiveCategory(category.id)"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
              activeCategory === category.id
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-gray-700 hover:text-red-600 dark:hover:text-red-400'
            ]"
          >
            {{ category.name }}
            <span class="ml-2 text-xs opacity-75">({{ category.count }})</span>
          </button>
        </div>

        <!-- Search and View Options -->
        <div class="flex items-center space-x-4">
          <!-- Search Input -->
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar en galería..."
              class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent w-64"
            />
          </div>

          <!-- View Toggle -->
          <div class="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              @click="setViewMode('grid')"
              :class="[
                'p-2 rounded-md transition-colors duration-200',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              ]"
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
                  ? 'bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              ]"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM16 5a1 1 0 011-1h3a1 1 0 011 1v7a1 1 0 01-1 1h-3a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h3a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1v-7zM10 9a1 1 0 011-1h3a1 1 0 011 1v11a1 1 0 01-1 1h-3a1 1 0 01-1-1V9z"></path>
              </svg>
            </button>
          </div>

          <!-- Sort Dropdown -->
          <select
            v-model="sortBy"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="popular">Más populares</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Display -->
      <div v-if="hasActiveFilters" class="mt-4 flex items-center space-x-2">
        <span class="text-sm text-gray-600 dark:text-gray-400">Filtros activos:</span>
        <div class="flex flex-wrap gap-2">
          <span
            v-if="searchQuery"
            class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
          >
            "{{ searchQuery }}"
            <button @click="searchQuery = ''" class="ml-1 hover:text-red-900 dark:hover:text-red-300">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </span>
        </div>
        <button
          @click="clearAllFilters"
          class="text-xs text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
        >
          Limpiar todo
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

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

// Categories data
const categories = ref([
  { id: 'all', name: 'Todas', count: 250 },
  { id: 'training', name: 'Entrenamientos', count: 120 },
  { id: 'competitions', name: 'Competencias', count: 45 },
  { id: 'belts', name: 'Exámenes de Grado', count: 35 },
  { id: 'events', name: 'Eventos', count: 30 },
  { id: 'students', name: 'Estudiantes', count: 20 }
])

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
