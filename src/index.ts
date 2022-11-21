// *** import and config dotenv first so it can be used everywhere ***
import dotenv from 'dotenv'
dotenv.config()
// *** end dotenv setup ***

import Hapi from '@hapi/hapi'
import { initServerMethods, initServerRoutes, start } from './server'
import { initJwtAuth } from './loginHandler'

const startServer = async () => {
  const server = Hapi.server({
    port: parseInt(process.env.HAPI_SERVER_PORT || '3000'),
    host: 'localhost',
  })
  await initJwtAuth(server)
  initServerMethods(server)
  initServerRoutes(server)
  start(server)
}

startServer()

// Catch unhandled rejected promises
process.on('unhandledRejection', (err) => {
  console.error(`unhandledRejection ${err}`)
  process.exit(1)
})

// Catch uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  console.error(`uncaughtException ${error.message}`)
})
