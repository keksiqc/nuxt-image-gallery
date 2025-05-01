import { ref } from 'vue'
import type { ImageFilter } from '~/types'

export function useImageFilters() {
  // Filter values
  const contrast = ref(100)
  const blur = ref(0)
  const invert = ref(0)
  const saturate = ref(100)
  const hueRotate = ref(0)
  const sepia = ref(0)
  const filterUpdated = ref(false)
  const magnifier = ref(false)
  const zoomFactor = ref(1)
  const filter = ref(false)
  
  // Object fit options
  const objectsFit = [
    { label: 'Contain', value: 'contain' },
    { label: 'Cover', value: 'cover' },
    { label: 'Fill', value: 'fill' },
    { label: 'Scale-down', value: 'scale-down' }
  ]
  const objectFitSelected = ref('contain')

  /**
   * Reset all filters to their default values
   */
  function resetFilters(): void {
    contrast.value = 100
    blur.value = 0
    invert.value = 0
    saturate.value = 100
    hueRotate.value = 0
    sepia.value = 0
    filterUpdated.value = false
    magnifier.value = false
    zoomFactor.value = 1
  }

  /**
   * Cancel filter mode and reset filters
   */
  function cancelFilters(): void {
    filter.value = false
    resetFilters()
  }

  /**
   * Get current filter values as an object
   */
  function getCurrentFilters(): ImageFilter {
    return {
      contrast: contrast.value,
      blur: blur.value,
      invert: invert.value,
      saturate: saturate.value,
      hueRotate: hueRotate.value,
      sepia: sepia.value
    }
  }

  /**
   * Generate CSS filter string from current filter values
   */
  function getFilterStyle(): string {
    return `contrast(${contrast.value}%) 
      blur(${blur.value}px) 
      invert(${invert.value}%) 
      saturate(${saturate.value}%) 
      hue-rotate(${hueRotate.value}deg) 
      sepia(${sepia.value}%)`
  }

  return {
    // Filter values
    contrast,
    blur,
    invert,
    saturate,
    hueRotate,
    sepia,
    filterUpdated,
    magnifier,
    zoomFactor,
    filter,
    
    // Object fit
    objectsFit,
    objectFitSelected,
    
    // Methods
    resetFilters,
    cancelFilters,
    getCurrentFilters,
    getFilterStyle
  }
}