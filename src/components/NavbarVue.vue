<template>
  <div class="navbar-container">
    <nav class="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg transition-all duration-300 border-b border-gray-200/50 dark:border-gray-700/50 fixed top-0 left-0 right-0 z-50 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-20">
        
        <!-- Logo and Brand -->
        <div class="flex items-center">
          <img 
            src="https://res.cloudinary.com/dgvje1bpw/image/upload/v1756572320/logo_ulji_gkw0wn.png" 
            alt="Logo Escuela Ul-ji"
            class="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mr-3"
          />
        </div>

        <!-- Desktop Navigation Links -->
        <div class="hidden md:flex items-center space-x-8">
          <a 
            v-for="link in navLinks" 
            :key="link.name"
            :href="link.href" 
            :class="[
              'nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300',
              isCurrentPage(link.href) 
                ? 'text-brand-red dark:text-ulji-red-400' 
                : 'text-gray-700 dark:text-gray-300 hover:text-brand-red dark:hover:text-ulji-red-400'
            ]"
          >
            {{ link.name }}
          </a>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          
          <!-- Dark Mode Toggle -->
          <button 
            @click="toggleTheme"
            class="theme-toggle-btn p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded-lg transition-colors duration-300 focus:outline-none"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            <!-- Sun Icon (Show in dark mode) -->
            <svg 
              v-if="isDark"
              class="w-5 h-5 transition-transform duration-300 hover:rotate-180" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <!-- Moon Icon (Show in light mode) -->
            <svg 
              v-else
              class="w-5 h-5 transition-transform duration-300 hover:rotate-12" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
            </svg>
          </button>

          <!-- Mobile Menu Button -->
        <button 
          @click.stop="toggleMobileMenu"
          class="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-brand-red dark:hover:text-ulji-red-400 transition-all duration-300 focus:outline-none rounded-lg"
          aria-label="Toggle mobile menu"
        >
          <div class="w-6 h-6 relative flex flex-col justify-center items-center">
            <!-- Top line -->
            <span 
              :class="[
                'absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out',
                isMobileMenuOpen 
                  ? 'rotate-45 translate-y-0' 
                  : '-translate-y-1.5 rotate-0'
              ]"
            ></span>
            <!-- Middle line -->
            <span 
              :class="[
                'absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out',
                isMobileMenuOpen 
                  ? 'opacity-0 scale-0' 
                  : 'opacity-100 scale-100'
              ]"
            ></span>
            <!-- Bottom line -->
            <span 
              :class="[
                'absolute w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out',
                isMobileMenuOpen 
                  ? '-rotate-45 translate-y-0' 
                  : 'translate-y-1.5 rotate-0'
              ]"
            ></span>
          </div>
        </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 transform -translate-y-2"
      enter-to-class="opacity-100 transform translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 transform translate-y-0"
      leave-to-class="opacity-0 transform -translate-y-2"
    >
      <div 
        v-if="isMobileMenuOpen" 
        class="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 shadow-lg"
        @click.stop
      >
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a 
            v-for="link in navLinks" 
            :key="link.name"
            :href="link.href"
            @click="closeMobileMenu"
            :class="[
              'mobile-nav-link block px-3 py-2 text-base font-medium rounded-md transition-colors duration-300',
              isCurrentPage(link.href) 
                ? 'text-brand-red dark:text-ulji-red-400 bg-ulji-red-50 dark:bg-ulji-red-900/20' 
                : 'text-gray-700 dark:text-gray-300 hover:text-brand-red dark:hover:text-ulji-red-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            ]"
          >
            {{ link.name }}
          </a>
        </div>
      </div>
    </Transition>
  </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { navLinks } from '../data/navlinks.js'

// Reactive state
const isDark = ref(false)
const isMobileMenuOpen = ref(false)
const currentPath = ref('/')

// Check if current page matches link
const isCurrentPage = (href: string) => {
  if (href.startsWith('#')) return false
  return currentPath.value === href || (currentPath.value === '/' && href === '/')
}

// Theme toggle functionality
const toggleTheme = () => {
  isDark.value = !isDark.value
  updateTheme()
}

const updateTheme = () => {
  const html = document.documentElement
  if (isDark.value) {
    html.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    html.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

// Mobile menu functionality
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close mobile menu when clicking outside
const handleClickOutside = (event: Event) => {
  const nav = document.querySelector('nav')
  const target = event.target as Node
  
  // Only close if the click is outside the nav and the menu is currently open
  if (nav && !nav.contains(target) && isMobileMenuOpen.value) {
    isMobileMenuOpen.value = false
  }
}

// Initialize theme and current path
onMounted(() => {
  // Set current path
  currentPath.value = window.location.pathname
  
  // Initialize theme from localStorage or system preference
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  
  isDark.value = savedTheme === 'dark' || (!savedTheme && systemPrefersDark)
  updateTheme()
  
  // Listen for path changes (for SPAs)
  window.addEventListener('popstate', () => {
    currentPath.value = window.location.pathname
  })
  
  // Listen for clicks outside mobile menu with a small delay to prevent immediate closure
  setTimeout(() => {
    document.addEventListener('click', handleClickOutside)
  }, 100)
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      isDark.value = e.matches
      updateTheme()
    }
  })
  
  // Close mobile menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      isMobileMenuOpen.value = false
    }
  })
})

// Watch for theme changes to apply smooth transitions
watch(isDark, () => {
  // Add a small delay to ensure smooth transition
  setTimeout(() => {
    document.body.style.transition = 'background-color 0.3s ease'
  }, 100)
})
</script>

<style scoped>
/* Force fixed positioning for reliable sticky behavior */
nav {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  z-index: 9999 !important; /* Higher z-index to ensure it stays on top */
  will-change: transform;
}

/* Ensure the parent container doesn't interfere */
:deep(body) {
  overflow-x: hidden;
  padding-top: 80px; /* Account for fixed navbar height */
}

/* Make sure there's no conflicting positioning */
.navbar-container {
  position: relative;
  width: 100%;
  height: 80px; /* Match navbar height to prevent layout shift */
}

/* Additional styles for smooth animations */
.nav-link {
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 50%;
  background-color: #F73434; /* brand-red */
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover::after {
  width: 100%;
}

.theme-toggle-btn:hover {
  transform: scale(1.05);
}

/* Hamburger menu button animations */
.hamburger-line {
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Enhanced focus styles for accessibility */
button:focus {
  outline: none;
}

button:focus-visible {
  box-shadow: 0 0 0 2px rgba(247, 52, 52, 0.5); /* brand-red with opacity */
}

/* Smooth hover effects for mobile menu button */
button:hover {
  transform: scale(1.05);
}

/* Ensure proper transitions for all elements */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>
