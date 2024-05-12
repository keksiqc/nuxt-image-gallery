import { z } from 'zod'
import { eventHandler, getValidatedRouterParams } from 'h3'
import { serveHubBlob } from '../utils'

const routeParamsSchema = z.object({
  pathname: z.string().min(1)
})

export default eventHandler(async (event) => {
  const { pathname } = await getValidatedRouterParams(event, routeParamsSchema)
  return serveHubBlob(event, pathname)
})

