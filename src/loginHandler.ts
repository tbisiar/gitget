
import Jwt from '@hapi/jwt'
import { Request, ReqRefDefaults, ResponseToolkit, Server } from '@hapi/hapi'

type LoginPayload = {
  username: string
}

export const createToken = (loginPayload: LoginPayload) =>
  Jwt.token.generate(
    {
      aud: 'urn:audience:test',
      iss: 'urn:issuer:test',
      user: loginPayload.username,
      group: 'hapi_community'
    },
    {
      key: process.env.JWT_SECRET || 'REPLACE_ME',
      algorithm: 'HS256'
    },
    {
      ttlSec: 14400 // 4 hours
    })

export const initJwtAuth = async (server: Server) => {
  await server.register(Jwt)
  server.auth.strategy('my_jwt_strategy', 'jwt', {
    keys: {
      key: process.env.JWT_SECRET || 'REPLACE_ME',
      algorithms: ['HS256']
    },
    verify: {
      aud: 'urn:audience:test',
      iss: 'urn:issuer:test',
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400, // 4 hours
      timeSkewSec: 15
    },
    validate: (artifacts: any) => {
      return {
        isValid: true,
        credentials: { user: artifacts.decoded.payload.user }
      }
    }
  })
  server.auth.default('my_jwt_strategy')
}

export const loginHandler = (request: Request<ReqRefDefaults>, _h: ResponseToolkit<ReqRefDefaults>) =>
  createToken(request.payload as LoginPayload)
