import { NeedleResponse } from "needle"
import { handleNeedleResponseError } from "./util"

describe('util', () => {
  describe('handleNeedleResponseError', () => {
    it('returns response.body for response with status code of 200', () => {
      const MOCK_RESPONSE_BODY = 'mock-response-body'
      const mockNeedleResponse = { statusCode: 200, body: MOCK_RESPONSE_BODY } as unknown as NeedleResponse
      const result = handleNeedleResponseError(mockNeedleResponse)
      expect(result).toEqual(MOCK_RESPONSE_BODY)
    })
    it('throws an error for non-200 statusCode', () => {
      const MOCK_RESPONSE_BODY = 'mock-response-body'
      const mockNeedleResponse = { statusCode: 403, body: {message: 'mock-error-message'} } as unknown as NeedleResponse
      let response = ''
      try{
        handleNeedleResponseError(mockNeedleResponse)
      } catch (e: any) {
        response = e.message
      }
      expect(response).toEqual('Received 403 with mock-error-message')
    })
  })
})