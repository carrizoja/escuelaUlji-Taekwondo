<template>
  <div>
    <!-- Filter Bar -->
    <FilterBar
      :initial-category="filters.category"
      :initial-view-mode="filters.viewMode"
      @category-change="handleCategoryChange"
      @search-change="handleSearchChange"
      @view-mode-change="handleViewModeChange"
      @sort-change="handleSortChange"
    />
    
    <!-- Photo Gallery -->
    <PhotoGallery
      :view-mode="filters.viewMode"
      :category="filters.category"
      :search-query="filters.searchQuery"
      :sort-by="filters.sortBy"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import FilterBar from './FilterBar.vue'
import PhotoGallery from './PhotoGallery.vue'

// Reactive filters state
const filters = reactive({
  category: 'all',
  searchQuery: '',
  viewMode: 'masonry' as 'grid' | 'masonry',
  sortBy: 'newest'
})

// Event handlers
const handleCategoryChange = (category: string) => {
  filters.category = category
}

const handleSearchChange = (query: string) => {
  filters.searchQuery = query
}

const handleViewModeChange = (mode: 'grid' | 'masonry') => {
  filters.viewMode = mode
}

const handleSortChange = (sort: string) => {
  filters.sortBy = sort
}
</script>