
import { Server } from '@hapi/hapi'
import { baseRouteHandler, initServerMethods } from './server'

describe('server', () => {
    describe('baseRouteHandler', () => {
        it('maps base route appropriately', () => {
            const expected = [{ method: 'a', path: 'b' }, { method: 'c', path: 'd' }]
            const mockServer = {
                table: () => expected
            } as unknown as Server
            const actual = baseRouteHandler(mockServer)()
            expect(actual).toEqual(expected)
        })
    })
    describe('initServerMethods', () => {
        it('initializes both server methods', () => {
            const stubServerMethod = jest.fn()
            const mockServer = {
                method: stubServerMethod
            } as unknown as Server
            initServerMethods(mockServer)
            expect(stubServerMethod).toHaveBeenCalledTimes(2)
        })
    })
})
