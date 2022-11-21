
import { Request, ReqRefDefaults, ResponseToolkit, RouteOptions, Server } from '@hapi/hapi'
import { prInfoHandler } from './prInfo'
import { getBasePrInfo, getCommitCount } from './githubCall'

export const baseRouteHandler = (server: Server) => async (request: Request<ReqRefDefaults>, _h: ResponseToolkit<ReqRefDefaults>) =>
    server.table()
        .map(route =>
            ({ method: route.method, path: route.path })
        )

export const initServerMethods = (server: Server) => {
    server.method('getBasePrInfo', getBasePrInfo, {
        cache: {
            expiresIn: 30000,
            staleIn: 10000,
            staleTimeout: 100,
            generateTimeout: 10000
        },
        generateKey: (args) => Object.values(args).join()
    })
    server.method('getCommitCount', getCommitCount, {
        cache: {
            expiresIn: 30000,
            staleIn: 10000,
            staleTimeout: 100,
            generateTimeout: 10000
        },
        generateKey: (args) => Object.values(args).join()
    })
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

    // Exposes an endpoint that returns the following information for a GitHub Repository URL provided by the user:
    // The id, number, title, author, and the number of commits of each open pull request.
    // (Do not use https://github.com/octokit to return this metadata. Instead, make multiple requests via the REST api to fetch the data necessary.)
    server.route({
        method: 'GET',
        path: '/prinfo/{owner}/{repoName}',
        handler: prInfoHandler(server)
    })
}

import Hapi from '@hapi/hapi'

const server = Hapi.server({
    port: 3000,
    host: 'localhost',
})
initServerMethods(server)
initServerRoutes(server)

export const init = async () => {
    await server.initialize();
    return server
}

export const start = async () => {
    await server.start()
    server.log(`Server running at : ${server.info.uri}`)
    return server
}
