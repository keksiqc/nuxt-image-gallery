import { defineEventHandler, readFormData } from 'h3'
import { ensureBlob, hubBlob } from '~/utils'
import { requireUserSession } from '~/middleware'

export default defineEventHandler(async (event) => {
  // Check if user is authenticated
  await requireUserSession(event)

  // Read form data from the request
  const form = await readFormData(event)

  // Get the image file from the form data
  const image = form.get('image') as File

  // Ensure the image is a valid format and size
  await ensureBlob(image, {
    maxSize: '8MB',
    types: ['image/jpeg', 'image/png', 'image/gif', 'image/heic', 'image/webp', 'image/jpg']
  })

  // Upload the image to the hub
  return hubBlob().put(image.name, image)
})
