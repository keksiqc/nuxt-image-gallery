import type { UseSwipeDirection } from '@vueuse/core'
import { computed, ref, ComputedRef } from 'vue'
import { useNuxtApp } from '#app'
import { useRuntimeConfig } from '#app'
import { useSwipe } from '@vueuse/core'
import { useRouter, useRoute } from '#nuxt'

export function useImageGallery() {
  const nuxtApp = useNuxtApp()
  const config = useRuntimeConfig()
  const imageToDownload = ref<HTMLImageElement | null>(null)
  const router = useRouter()
  const route = useRoute()

  const currentIndex = computed(() => {
    const images = nuxtApp.$file.images.value!
    const slug = route.params.slug[0]
    return images.findIndex((image: BlobObject) => image.pathname.split('.')[0] === slug)
  })

  const isFirstImg = computed(() => {
    const firstImage = nuxtApp.$file.images.value![0]
    const slug = route.params.slug[0]
    return firstImage.pathname.split('.')[0] === slug
  })

  const isLastImg = computed(() => {
    const lastImage = nuxtApp.$file.images.value![nuxtApp.$file.images.value!.length - 1]
    const slug = route.params.slug[0]
    return lastImage.pathname.split('.')[0] === slug
  })

  const initSwipe = (el: Ref<HTMLElement | null>) => {
    useSwipe(el, {
      passive: false,

      onSwipeEnd(e: TouchEvent, direction: UseSwipeDirection) {
        if (direction === 'left') {
          if (isLastImg.value)
            router.push('/')
          else
            router.push(`/detail/${nuxtApp.$file.images.value![currentIndex.value + 1].pathname.split('.')[0]}`)
        }
        else {
          if (isFirstImg.value)
            router.push('/')
          else
            router.push(`/detail/${nuxtApp.$file.images.value![currentIndex.value - 1].pathname.split('.')[0]}`)
        }
      }
    })
  }

  const applyFilters = async (poster: HTMLImageElement, contrast: number, blur: number, invert: number, saturate: number, hueRotate: number, sepia: number) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const context: CanvasRenderingContext2D | null = canvas.getContext('2d')

    if (!context) {
      throw new Error('Canvas context is not available')
    }

    canvas.width = poster?.naturalWidth
    canvas.height = poster?.naturalHeight

    context.filter = `contrast(${contrast}%) blur(${blur}px) invert(${invert}%)
      saturate(${saturate}%) hue-rotate(${hueRotate}deg) sepia(${sepia}%)`

    context.drawImage(poster!, 0, 0, canvas.width, canvas.height)

    const modifiedImage = new Image()

    modifiedImage.src = canvas.toDataURL('image/png')
    imageToDownload.value = modifiedImage

    return imageToDownload
  }

  const downloadImage = async (filename: string, poster: HTMLImageElement, contrast: number, blur: number, invert: number, saturate: number, hueRotate: number, sepia: number) => {
    if (!imageToDownload.value) {
      return
    }
    try {
      await applyFilters(poster, contrast, blur, invert, saturate, hueRotate, sepia)

      const response = await fetch(imageToDownload.value.src)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.click()
    } catch (error) {
      console.error(error)
    }
  }

  const convertBase64ToFile = async (image: Ref<HTMLImageElement>, originalImage: Ref<BlobObject>) => {
    const url = image.value.currentSrc

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch image')
      }

      const blob = await response.blob()
      const convertedFile = new File([blob], originalImage.value.pathname.split('.')[1], { type: `image/${originalImage.value.pathname.split('.')[1]}` })

      return convertedFile
    } catch (error) {
      console.error(error)
    }
  }

  const magnifierImage = (e: MouseEvent, containerEl: HTMLElement, imageEl: HTMLImageElement, magnifierEl: HTMLElement, zoomFactor: number = 2) => {
    if (magnifierEl.style.filter !== imageEl.style.filter)
      magnifierEl.style.filter = imageEl.style.filter

    const imageRect = imageEl.getBoundingClientRect()
    const containerRect = containerEl.getBoundingClientRect()

    const x = e.pageX - containerRect.left
    const y = e.pageY - containerRect.top

    const imgWidth = imageRect.width
    const imgHeight = imageRect.height

    const zoomedWidth = imgWidth * (zoomFactor === 1 ? 1.5 : zoomFactor)
    const zoomedHeight = imgHeight * (zoomFactor === 1 ? 1.5 : zoomFactor)

    let xperc = (x / imgWidth) * 100
    let yperc = (y / imgHeight) * 100

    if (x > 0.01 * imgWidth)
      xperc += 0.15 * xperc

    if (y >= 0.01 * imgHeight)
      yperc += 0.15 * yperc

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
    currentIndex,
    isFirstImg,
    isLastImg
  } as const
}


interface BlobObject {
  pathname: string
}
