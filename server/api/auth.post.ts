import { createError } from './error'
import { readBody, getUserSession, setUserSession } from './session'

const RETRY_DELAY = 5000 // in milliseconds

export default async (event) => {
  const body = await readBody(event) || {}
  const session = await getUserSession(event)
  const adminPassword = process.env.NUXT_ADMIN_PASSWORD || 'admin'

  // Check if the request is being retried too quickly
  if (session.lastAttemptAt && Date.now() - session.lastAttemptAt < RETRY_DELAY) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests. Please wait ' + Math.ceil((RETRY_DELAY - (Date.now() - session.lastAttemptAt)) / 1000) + ' seconds before trying again.'
    })
  }

  // Check if the password is correct
  if (body.password === adminPassword) {
    await setUserSession(event, {
      user: { role: 'admin' },
      lastAttemptAt: null // reset the lastAttemptAt timestamp
    })

    return { loggedIn: true }
  }

  // Update the lastAttemptAt timestamp
  await setUserSession(event, { lastAttemptAt: Date.now() })

  throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
}

