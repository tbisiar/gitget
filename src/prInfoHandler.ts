import { Request, ResponseToolkit, Server } from "@hapi/hapi"

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
            return await server.methods.getBasePrInfo({...request.params})
                .then(async (basePrInfo: GitgetPrInfo[]) =>
                    await Promise.all(basePrInfo.map(async (baseInfo: GitgetPrInfo) => ({
                        ...baseInfo,
                        commit_count: await server.methods.getCommitCount({
                            ...request.params,
                            prNumber: baseInfo.number,
                            page: FIRST_PAGE
                        })
                    })))
                )
                .then((result: GitgetPrInfo[]) => h.response(result).code(200))
        } catch (e: any) {
            request.log(['Caught error response: '], e)
            return h.response({
                message: e.message,
                code: e.response?.statusCode
            }).code(500)
        }
    }