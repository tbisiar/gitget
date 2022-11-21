import { NeedleResponse } from "needle"

export class HttpError extends Error {
    response: NeedleResponse
    constructor(response: NeedleResponse) {
        super(`Received ${response.statusCode} with ${response.body.message}`)
        this.name = 'HttpError'
        this.response = response
    }
}

// Utils
export const logAndThrowError = (e: NeedleResponse) => {
  console.error('encountered error: ', e.statusCode)
  throw new HttpError(e)
}

export const handleNeedleResponseError = (response: NeedleResponse) => {
  if(response.statusCode === 200) {
      return response.body
  }
  logAndThrowError(response)
}

export const peekResponse = (i: number) => (response: NeedleResponse) => {
  console.log(`### peekResponse: ${i}`, response.statusCode)
  console.log(`### peekResponse: ${i}`, response.body)
  return response
}
