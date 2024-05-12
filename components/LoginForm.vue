<script setup lang="ts">
import { ref } from 'vue'
import { useUserSession } from '@/composables/useUserSession'
import { useToast } from 'vue-toastification'
import { defineEmits, defineProps } from 'vue'

const emit = defineEmits<{
  (e: 'closeLogin'): void
}>()

const props = defineProps<{
  modelValue: string
}>()

const password = ref(props.modelValue)
const loading = ref(false)
const { fetch: refreshSession } = useUserSession()
const toast = useToast()

function clearPassword() {
  password.value = ''
}

async function login() {
  if (loading.value || !password.value.trim()) return
  loading.value = true
  try {
    await $fetch('/api/auth', {
      method: 'POST',
      body: { password: password.value }
    })
    await refreshSession()
    clearPassword()
    emit('closeLogin')
  } catch (err: any) {
    toast.add({
      title: `Error ${err.statusCode || 500}`,
      description: err.data?.message || err.message || 'An unexpected error occurred. Please try again.',
      color: 'red'
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form
    class="flex flex-col gap-y-4 p-4 items-center"
    @submit.prevent="login"
  >
    <h1 class="text-lg text-gray-300">
      Login to upload images
    </h1>
    <UInput
      v-model="password"
      type="password"
      placeholder="Enter password"
      icon="i-heroicons-key"
      class="!w-60"
    />

    <UButton
      :loading="loading"
      type="submit"
      label="Login"
      color="green"
      variant="ghost"
      class="px-4"
      size="lg"
      :disabled="!password.trim()"
    />
  </form>
</template>
