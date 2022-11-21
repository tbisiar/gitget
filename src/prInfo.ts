import { Request, ResponseToolkit, Server } from "@hapi/hapi"
import { peekResponse } from "./util"

const FIRST_PAGE = 1

export type GitgetPrInfo = {
    id: number
    number: number
    title: string
    author: string
    commit_count?: number
}

export const prInfoHandler = (server: Server) =>
    async (request: Request, h: ResponseToolkit) => {
        try {
            const basePrInfo = await server.methods.getBasePrInfo(request.params)
                .then(peekResponse(2))
            console.log('### basePrInfo = ', JSON.stringify(basePrInfo))
            const result = await Promise.all(basePrInfo.map(async (baseInfo: GitgetPrInfo) => ({
                ...baseInfo,
                commit_count: await server.methods.getCommitCount({ ...request.params, prNumber: baseInfo.number, page: FIRST_PAGE }),
            })))
            return h.response(result).code(200)
        } catch (e: any) {
            console.log('Caught error response: ', e.message)
            return h.response({message: e.message, code: e.response.statusCode}).code(500)
        }
    }