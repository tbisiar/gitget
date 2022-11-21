// *** import and config dotenv first so it can be used everywhere ***
import dotenv from 'dotenv'
dotenv.config()
// *** end dotenv setup ***

import { start } from './server'

start()

// Catch unhandled rejected promises
process.on('unhandledRejection', (err) => {
    console.error(`unhandledRejection ${err}`)
    process.exit(1)
})

// Catch uncaught exceptions
process.on('uncaughtException', (error: Error) => {
    console.error(`uncaughtException ${error.message}`)
})
