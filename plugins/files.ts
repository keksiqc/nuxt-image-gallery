import { ref, Ref } from '@vue/composition-api'
import { useFetch, useRouter, useToast } from 'nuxt-composition-api'

export default defineNuxtPlugin(({ Vue }) => {
  const images: Ref<File[]> = ref([])
  const router = useRouter()
  const toast = useToast()

  const getImages = async () => {
    const { data: files } = await useFetch<File[]>('/api/images')

    images.value = files.value
  }

  onBeforeMount(getImages)

  async function uploadImage(event: Event, image: File, filter: boolean = false) {
    event.preventDefault()

    const formData = new FormData()
    formData.append('image', image)

    try {
      await $fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      })

      getImages()

      if (filter) {
        router.push('/')
      }
    } catch (err) {
      toast.add({
        color: 'red',
        title: 'Failed to upload image',
        description: err.data?.message || err.message
      })
    }
  }

  async function deleteImage(pathname: string) {
    const image = images.value.find(image => image.path === pathname)

    if (!image) {
      return
    }

    try {
      await $fetch(`/api/images/${pathname}`, { method: 'DELETE' })

      images.value = images.value.filter(image => image.path !== pathname)
    } catch (err) {
      toast.add({
        color: 'red',
        title: 'Failed to delete image',
        description: err.data?.message || err.message
      })
    }
  }

  Vue.provide('file', {
    getImages,
    images,
    uploadImage,
    deleteImage
  })
})
