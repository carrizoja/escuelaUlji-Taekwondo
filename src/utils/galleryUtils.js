/**
 * Development utilities for Google Sheets integration
 * These functions help with testing and debugging
 */

import { clearPhotosCache, getPhotos } from '../data/photos.js';

/**
 * Force refresh photos from Google Sheets (clears cache)
 * Usage: Call this in browser console or add to a button for testing
 */
export async function refreshPhotos() {
  console.log('🔄 Refreshing photos from Google Sheets...');
  clearPhotosCache();
  
  try {
    const photos = await getPhotos();
    console.log(`✅ Successfully loaded ${photos.length} photos`);
    return photos;
  } catch (error) {
    console.error('❌ Error refreshing photos:', error);
    throw error;
  }
}

/**
 * Test Google Sheets connection
 * Useful for debugging configuration issues
 */
export async function testSheetsConnection() {
  console.log('🧪 Testing Google Sheets connection...');
  
  try {
    clearPhotosCache(); // Force fresh fetch
    const photos = await getPhotos();
    
    if (photos.length === 0) {
      console.warn('⚠️ Google Sheets is accessible but no photos found');
      return { success: false, message: 'No photos found in Google Sheets' };
    }
    
    console.log(`✅ Successfully connected! Found ${photos.length} photos`);
    console.log('📝 Sample photo:', photos[0]);
    return { success: true, photos, count: photos.length };
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Validate photo data structure
 * Checks if all required fields are present
 */
export function validatePhotos(photos) {
  const requiredFields = ['id', 'title', 'thumbnail', 'category', 'date'];
  const issues = [];
  
  photos.forEach((photo, index) => {
    requiredFields.forEach(field => {
      if (!photo[field]) {
        issues.push(`Photo ${index + 1}: Missing ${field}`);
      }
    });
    
    // Check if URLs are valid
    if (photo.thumbnail && !isValidUrl(photo.thumbnail)) {
      issues.push(`Photo ${index + 1}: Invalid thumbnail URL`);
    }
    
    if (photo.fullSize && !isValidUrl(photo.fullSize)) {
      issues.push(`Photo ${index + 1}: Invalid fullSize URL`);
    }
  });
  
  if (issues.length === 0) {
    console.log('✅ All photos are valid');
  } else {
    console.warn('⚠️ Photo validation issues:', issues);
  }
  
  return issues;
}

/**
 * Helper function to validate URLs
 */
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Generate a CSV template for Google Sheets
 * Useful for setting up the initial sheet structure
 */
export function generateCSVTemplate() {
  const headers = [
    'ID',
    'Title', 
    'Description',
    'Thumbnail URL',
    'Full Size URL',
    'Alt Text',
    'Category',
    'Date',
    'Likes',
    'Tags'
  ];
  
  const sampleData = [
    'photo-1',
    'Examen de Taekwondo 28-8-2023',
    'Autoridades de Ul-Ji junto al Senior Master Julio Bazan...',
    'https://res.cloudinary.com/dgvje1bpw/image/upload/v1756929437/20230828_201217_ltwuxs.jpg',
    'https://res.cloudinary.com/dgvje1bpw/image/upload/v1756929437/20230828_201217_ltwuxs.jpg',
    'Autoridades de Ul-Ji junto al Senior Master Julio Bazan',
    'belts',
    '2023-08-28T10:00:00Z',
    '0',
    'taekwondo,examenes,estudiantes'
  ];
  
  const csv = [headers.join(','), sampleData.join(',')].join('\n');
  
  console.log('📋 CSV Template:');
  console.log(csv);
  
  // Create downloadable file
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'ulji-photos-template.csv';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  
  return csv;
}

// Make functions available globally for browser console testing
if (typeof window !== 'undefined') {
  window.uljiGalleryUtils = {
    refreshPhotos,
    testSheetsConnection,
    validatePhotos,
    generateCSVTemplate
  };
  
  console.log('🛠️ Gallery utilities loaded! Use window.uljiGalleryUtils in console');
}