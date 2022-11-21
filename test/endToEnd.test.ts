import * as Lab from '@hapi/lab'
import { Server } from "@hapi/hapi"
import { expect } from '@hapi/code'
const { after, afterEach, before, beforeEach, describe, it } = exports.lab = Lab.script()
import { init } from '../src/server'
import { server as msw } from './mocks/server'

describe('End-to-end tests', () => {
    // Establish API mocking before all tests.
    before(() => msw.listen())
    // Reset any request handlers that we may add during the tests so they don't affect other tests.
    afterEach(() => msw.resetHandlers())
    // Clean up after the tests are finished.
    after(() => msw.close())
    describe('GET /', () => {
        let server: Server

        beforeEach(async () => {
            server = await init()
        })

        afterEach(async () => {
            await server.stop()
        })

        it('responds with 200', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/'
            })
            expect(res.statusCode).to.equal(200)
        })
    })

    describe('GET /prinfo/{owner}/{repoName}', () => {
        let server: Server

        beforeEach(async () => {
            server = await init()
        })

        afterEach(async () => {
            await server.stop()
        })

        it('responds with 200', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/prinfo/mock-owner/mock-repo-name'
            })
            expect(res.statusCode).to.equal(200)
        })
        it('responds with appropriate body', async () => {
            const res = await server.inject({
                method: 'get',
                url: '/prinfo/mock-owner/mock-repo-name'
            })
            const expected = [{ 
                id: 1234567890, 
                number: 54321, 
                title: "Example pull-request title", 
                author: "mock-user",
                commit_count: 3 
            }]
            expect(res.payload).to.equal(JSON.stringify(expected))
        })
    })
})