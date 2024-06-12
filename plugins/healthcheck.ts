import { type FastifyInstance, type FastifyPluginOptions } from 'fastify'
import underPressure from '@fastify/under-pressure'
import fp from 'fastify-plugin'

export default fp(async function (fastify: FastifyInstance, opts: FastifyPluginOptions): Promise<void> {
  const { db, sql } = fastify.platformatic
  await fastify.register(underPressure, {
    healthCheck: async function (fastifyInstance) {
      // do some magic to check if your db connection is healthy, etc...
      try {
        await db.query(sql`SELECT 1`)
        return true
      } catch (err) {
        fastify.log.warn({ err }, 'Healthcheck failed')
        return false
      }
    },
    healthCheckInterval: 500,
    exposeStatusRoute: '/status/health'
  })
}, {
  fastify: '4.x',
  name: 'healthCheck'
})
