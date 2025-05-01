import type { UseSwipeDirection } from '@vueuse/core'
import { computed, ref, type Ref } from 'vue'
import { useSwipe } from '@vueuse/core'
import type { BlobObject, ImageFilter } from '~/types'

export function useImageGallery() {
  const nuxtApp = useNuxtApp()
  const imageToDownload = ref<HTMLImageElement | null>(null)
  const router = useRouter()
  const route = useRoute()

  // Get the current image slug from the route
  const currentSlug = computed(() => route.params.slug?.[0] || '')

  // Get all images from the file plugin
  const images = computed(() => nuxtApp.$file.images.value || [])

  // Find the current index of the displayed image
  const currentIndex = computed(() => {
    return images.value.findIndex((image: BlobObject) => 
      getImageId(image.pathname) === currentSlug.value
    )
  })

  // Check if we're viewing the first image
  const isFirstImg = computed(() => {
    if (!images.value.length) return false
    return currentIndex.value === 0
  })

  // Check if we're viewing the last image
  const isLastImg = computed(() => {
    if (!images.value.length) return false
    return currentIndex.value === images.value.length - 1
  })

  /**
   * Get the image ID from pathname (removes file extension)
   */
  function getImageId(pathname: string): string {
    return pathname.split('.')[0]
  }

  /**
   * Navigate to the next or previous image
   */
  function navigateImage(direction: 'next' | 'prev'): void {
    if (direction === 'next') {
      if (isLastImg.value) {
        router.push('/')
      } else {
        const nextImage = images.value[currentIndex.value + 1]
        router.push(`/detail/${getImageId(nextImage.pathname)}`)
      }
    } else {
      if (isFirstImg.value) {
        router.push('/')
      } else {
        const prevImage = images.value[currentIndex.value - 1]
        router.push(`/detail/${getImageId(prevImage.pathname)}`)
      }
    }
  }

  /**
   * Initialize swipe gestures for mobile navigation
   */
  const initSwipe = (el: Ref<HTMLElement | null>) => {
    useSwipe(el, {
      passive: false,
      onSwipeEnd(_: TouchEvent, direction: UseSwipeDirection) {
        if (direction === 'left') {
          navigateImage('next')
        } else {
          navigateImage('prev')
        }
      }
    })
  }

  /**
   * Apply filters to an image and return the modified image
   */
  const applyFilters = async (
    image: HTMLImageElement, 
    contrast: number, 
    blur: number, 
    invert: number, 
    saturate: number, 
    hueRotate: number, 
    sepia: number
  ) => {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('Canvas context is not available')
    }

    canvas.width = image.naturalWidth
    canvas.height = image.naturalHeight

    // Apply filters to the canvas context
    context.filter = `contrast(${contrast}%) blur(${blur}px) invert(${invert}%)
      saturate(${saturate}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`

    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    // Create a new image with the filtered result
    const modifiedImage = new Image()
    modifiedImage.src = canvas.toDataURL('image/png')
    imageToDownload.value = modifiedImage

    return imageToDownload
  }

  /**
   * Download an image with applied filters
   */
  const downloadImage = async (
    filename: string, 
    image: HTMLImageElement, 
    filters: ImageFilter
  ) => {
    try {
      // Apply filters to the image
      await applyFilters(
        image, 
        filters.contrast, 
        filters.blur, 
        filters.invert, 
        filters.saturate, 
        filters.hueRotate, 
        filters.sepia
      )

      if (!imageToDownload.value) {
        throw new Error('Failed to process image')
      }

      // Fetch the modified image data
      const response = await fetch(imageToDownload.value.src)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }

      // Create a download link
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.click()

      // Clean up
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  /**
   * Convert a base64 image to a File object
   */
  const convertBase64ToFile = async (
    image: Ref<HTMLImageElement>, 
    originalImage: { value: BlobObject }
  ) => {
    try {
      const url = image.value.src
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }

      const blob = await response.blob()
      const fileExtension = originalImage.value.pathname.split('.').pop() || 'png'
      
      return new File(
        [blob], 
        originalImage.value.pathname, 
        { type: `image/${fileExtension}` }
      )
    } catch (error) {
      console.error('Error converting image:', error)
      throw error
    }
  }

  /**
   * Create a magnifier effect on an image
   */
  const magnifierImage = (
    e: MouseEvent, 
    containerEl: HTMLElement, 
    imageEl: HTMLImageElement, 
    magnifierEl: HTMLElement, 
    zoomFactor: number = 2
  ) => {
    // Sync filters between the image and magnifier
    if (magnifierEl.style.filter !== imageEl.style.filter) {
      magnifierEl.style.filter = imageEl.style.filter
    }

    // Calculate positions
    const imageRect = imageEl.getBoundingClientRect()
    const containerRect = containerEl.getBoundingClientRect()

    const x = e.pageX - containerRect.left
    const y = e.pageY - containerRect.top

    const imgWidth = imageRect.width
    const imgHeight = imageRect.height

    // Calculate zoom
    const effectiveZoomFactor = zoomFactor === 1 ? 1.5 : zoomFactor
    const zoomedWidth = imgWidth * effectiveZoomFactor
    const zoomedHeight = imgHeight * effectiveZoomFactor

    // Calculate percentages for positioning
    let xperc = (x / imgWidth) * 100
    let yperc = (y / imgHeight) * 100

    // Adjust percentages for better positioning
    if (x > 0.01 * imgWidth) xperc += 0.15 * xperc
    if (y >= 0.01 * imgHeight) yperc += 0.15 * yperc

    // Apply styles to the magnifier
    magnifierEl.style.backgroundSize = `${zoomedWidth}px ${zoomedHeight}px`
    magnifierEl.style.backgroundPositionX = `${xperc - 9}%`
    magnifierEl.style.backgroundPositionY = `${yperc - 9}%`
    magnifierEl.style.left = `${x - 50}px`
    magnifierEl.style.top = `${y - 50}px`
    magnifierEl.style.zIndex = '9999'
  }

  return {
    downloadImage,
    applyFilters,
    convertBase64ToFile,
    magnifierImage,
    initSwipe,
    navigateImage,
    getImageId,
    currentIndex,
    isFirstImg,
    isLastImg,
    images,
    currentSlug
  }
}
