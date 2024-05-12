import { eventHandler } from 'nuxt-event-handlers'
import { hubBlob } from 'your-blob-module'

export default eventHandler(async (event) => {
  try {
    const list = await hubBlob().list()
    return event.respondWith(new Response(JSON.stringify(list), { status: 200 }))
  } catch (error) {
    return event.respondWith(new Response(JSON.stringify({ error: error.message }), { status: 500 }))
  }
})

