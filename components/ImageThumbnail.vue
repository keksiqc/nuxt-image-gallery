<script setup lang="ts">
import type { BlobObject } from '~/types'

const props = defineProps({
  thumbnail: {
    type: Object as () => BlobObject,
    required: true
  }
})

const route = useRoute()
const { getImageId } = useImageGallery()

// Get the current slug from the route
const currentSlug = computed(() => route.params.slug?.[0] || '')

// Check if this thumbnail is the active image
const isActive = computed(() => 
  getImageId(props.thumbnail.pathname) === currentSlug.value
)
</script>

<template>
  <li
    v-if="currentSlug"
    class="text-black inline-block relative"
    :class="{ 'z-50': isActive }"
  >
    <NuxtLink :to="`/detail/${getImageId(thumbnail.pathname)}`">
      <img
        v-if="thumbnail"
        width="83"
        height="51"
        :src="`/images/${thumbnail.pathname}`"
        :alt="thumbnail.key || thumbnail.pathname"
        class="object-cover rounded-md transition-all duration-500 hover:brightness-100 w-[83px] h-[51px]"
        :class="isActive ? 'active brightness-100' : 'opacity-75 brightness-50'"
      >
    </NuxtLink>
  </li>
</template>
