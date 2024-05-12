import { deleteObject as deleteHubBlob } from 'hubBlob'
import { handleError } from './errorHandler'
import { getUserSession } from './sessionHandler'

export default async function deleteBlob(event) {
  try {
    const userSession = await getUserSession(event)
    const { pathname } = event.context.params || {}

    if (!pathname) {
      throw new Error('Missing pathname parameter')
    }

    await deleteHubBlob(pathname, { userSession })

    return { status: 200 }
  } catch (error) {
    return handleError(error)
  }
}
