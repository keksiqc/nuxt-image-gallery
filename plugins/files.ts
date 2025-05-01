import { ref } from 'vue'
import type { BlobObject } from '~/types'

export default defineNuxtPlugin(() => {
  const images = ref<BlobObject[]>([])
  const router = useRouter()
  const toast = useToast()

  const getImages = async () => {
    try {
      const files = await $fetch<BlobObject[]>('/api/images')
      images.value = files
    } catch (error) {
      console.error('Failed to fetch images:', error)
      toast.add({
        color: 'red',
        title: 'Failed to fetch images',
        description: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  // Initialize images on plugin load
  getImages()

  async function uploadImage(file: File, filter: boolean = false) {
    const formData = new FormData()
    formData.append('image', file)

    try {
      await $fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      })

      await getImages()

      if (filter) {
        router.push('/')
      }
      
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.add({
        color: 'red',
        title: 'Failed to upload image',
        description: errorMessage
      })
      return false
    }
  }

  async function deleteImage(pathname: string) {
    const image = images.value.find(image => image.pathname === pathname)

    if (!image) {
      return false
    }

    try {
      await $fetch(`/api/images/${pathname}`, { method: 'DELETE' })
      images.value = images.value.filter(image => image.pathname !== pathname)
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      toast.add({
        color: 'red',
        title: 'Failed to delete image',
        description: errorMessage
      })
      return false
    }
  }

  return {
    provide: {
      file: {
        getImages,
        images,
        uploadImage,
        deleteImage
      }
    }
  }
})
