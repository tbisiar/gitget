import { NeedleResponse } from "needle"

export type HttpError = {
  message: string
  name: string
  response: NeedleResponse
}

export const httpError = (response: NeedleResponse) => ({
  message: `Received ${response.statusCode} with ${response.body?.message}`,
  name: 'HttpError',
  response: response
})

export const logAndThrowError = (response: NeedleResponse) => {
  console.warn('encountered error: ', response.statusCode)
  throw httpError(response)
}

export const handleNeedleResponseError = (response: NeedleResponse) => {
  if (response.statusCode === 200) {
    return response.body
  }
  logAndThrowError(response)
}
