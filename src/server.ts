
import { ReqRefDefaults, RouteOptions, Server } from '@hapi/hapi'
import { prInfoHandler } from './prInfoHandler'
import { getBasePrInfo } from './github/basePrInfo'
import { getCommitCount } from './github/commitCount'
import Joi from 'joi'
import { loginHandler } from './loginHandler'

export const baseRouteHandler = (server: Server) => () =>
    server.table()
        .map(route =>
            ({ method: route.method, path: route.path })
        )

export const serverCacheOptions = {
    cache: {
        expiresIn: 30000,
        staleIn: 10000,
        staleTimeout: 100,
        generateTimeout: 10000
    },
    generateKey: (args: any) => Object.values(args).join()
}

export const initServerMethods = (server: Server) => {
    server.method('getBasePrInfo', getBasePrInfo, serverCacheOptions)
    server.method('getCommitCount', getCommitCount, serverCacheOptions)
}

const loginRouteOptions: RouteOptions<ReqRefDefaults> = {
    auth: false,
    payload: {
        multipart: {
            output: 'data'
        }
    },
    validate: {
        payload: Joi.object().keys({
            username: Joi.string().email().required()
        })
    }
}

export const initServerRoutes = (server: Server) => {
    server.route({
        method: 'GET',
        path: '/',
        options: {
            auth: false
        },
        handler: baseRouteHandler(server)
    })

    server.route({
        method: 'POST',
        path: '/login',
        options: loginRouteOptions,
        handler: loginHandler
    })

    // Exposes an endpoint that returns the following information for a GitHub Repository URL provided by the user:
    // The id, number, title, author, and the number of commits of each open pull request.
    // (Do not use https://github.com/octokit to return this metadata. Instead, make multiple requests via the REST api to fetch the data necessary.)
    server.route({
        method: 'POST',
        path: '/prinfo/{owner}/{repoName}',
        handler: prInfoHandler(server)
    })
}

// Initializes the server without starting it, specifically for running Hapi.lab tests
export const init = async (server: Server) => {
    await server.initialize()
    return server
}

// Starts the server for 
export const start = async (server: Server) => {
    await server.start()
    server.log(`Server running at : ${server.info.uri}`)
    return server
}
