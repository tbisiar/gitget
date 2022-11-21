import { ReqRefDefaults, Request, ResponseToolkit, ResponseValue, Server } from '@hapi/hapi'
import { prInfoHandler } from './prInfoHandler'

const MOCK_BASE_PR_INFO = {
    id: 1,
    number: 2,
    author: 'three',
    title: 'four'
}
const MOCK_COMMIT_COUNT = 5
const MOCK_ERROR_MESSAGE = 'mock-error-message'
const MOCK_ERROR_CODE = 999
const MOCK_ERROR = {
    message: MOCK_ERROR_MESSAGE,
    response: {
        statusCode: MOCK_ERROR_CODE
    }
}


const getBasePrInfoStub = jest.fn().mockResolvedValue([MOCK_BASE_PR_INFO])
const getCommitCountStub = jest.fn().mockResolvedValue(MOCK_COMMIT_COUNT)
const ErrorStub = jest.fn().mockRejectedValue(MOCK_ERROR)
const mockRequest = {
    params: {
        owner: 'mock-user',
        repoName: 'mock-repo-name'
    },
    log: () => { }
} as unknown as Request
const h = {
    // mock hapi repsonse that passes back the same value provided for test assertion
    response: (a: ResponseValue) => ({ code: () => a, statusCode: () => a } as unknown as Response)
} as unknown as ResponseToolkit<ReqRefDefaults>
describe('prInfoHandler', () => {
    it('handles success appropriately', async () => {
        const mockServer = {
            methods: {
                getBasePrInfo: getBasePrInfoStub,
                getCommitCount: getCommitCountStub
            }
        } as unknown as Server
        const expected = [{
            ...MOCK_BASE_PR_INFO,
            commit_count: MOCK_COMMIT_COUNT
        }]
        const result = await prInfoHandler(mockServer)(mockRequest, h)
        expect(result).toEqual(expected)
    })
    it('handles getBasePrInfo error appropriately', async () => {
        const mockServer = {
            methods: {
                getBasePrInfo: ErrorStub,
                getCommitCount: getCommitCountStub
            }
        } as unknown as Server
        const expected = { message: MOCK_ERROR_MESSAGE, code: MOCK_ERROR_CODE }
        const result = await prInfoHandler(mockServer)(mockRequest, h)
        expect(result).toEqual(expected)
    })
    it('handles getCommitCount error appropriately', async () => {
        const mockServer = {
            methods: {
                getBasePrInfo: getBasePrInfoStub,
                getCommitCount: ErrorStub
            }
        } as unknown as Server
        const expected = { message: MOCK_ERROR_MESSAGE, code: MOCK_ERROR_CODE }
        const result = await prInfoHandler(mockServer)(mockRequest, h)
        expect(result).toEqual(expected)
    })
})
