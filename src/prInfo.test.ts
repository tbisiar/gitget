import { ReqRefDefaults, Request, ResponseToolkit, Server } from '@hapi/hapi'
import { prInfoHandler } from './prInfo'

const MOCK_BASE_PR_INFO = {
    id: 1,
    number: 2,
    author: 'three',
    title: 'four'
}
const MOCK_COMMIT_COUNT = 5


describe('prInfo', () => {
    describe('prInfoHandler', () => {
        it('works', async () => {
            const getBasePrInfoStub = jest.fn().mockResolvedValueOnce([MOCK_BASE_PR_INFO])
            const getCommitCountStub = jest.fn().mockResolvedValueOnce(MOCK_COMMIT_COUNT)
            const mockServer = {
                methods: {
                    getBasePrInfo: getBasePrInfoStub,
                    getCommitCount: getCommitCountStub
                }
            } as unknown as Server
            const mockRequest = {
                params: {
                    owner: 'mock-user',
                    repoName: 'mock-repo-name'
                }
            } as unknown as Request
            const h = {
                response: a => a
            } as ResponseToolkit<ReqRefDefaults>
            const expected = [{
                ...MOCK_BASE_PR_INFO,
                commit_count: MOCK_COMMIT_COUNT
            }]
            const result = await prInfoHandler(mockServer)(mockRequest, h)
            expect(result).toEqual(expected)
        })
    })
})
