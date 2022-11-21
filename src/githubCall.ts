import needle from "needle"
import { GitgetPrInfo } from "./prInfo"
import { handleNeedleResponseError, HttpError, peekResponse } from "./util"

const PER_PAGE = 10

type GithubPrInfo = {
    id: string
    number: number
    title: string
    user: {
        login: string
    }
    commit_count: number
}

type GetBasePrInfoProps = {
    owner: string, 
    repoName: string
}

type GetResultLengthProps = {
    length: number
    owner: string
    repoName: string
    prNumber: number
    page: number
}

type GetCommitCountProps = {
    owner: string
    repoName: string
    prNumber: number
    page: number
}

const needleOptions = {
    headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_API_KEY}`
    }
}


const buildGetBasePrInfoUrl = ({ owner, repoName }: GetBasePrInfoProps) =>
    `https://api.github.com/repos/${owner}/${repoName}/pulls?per_page=${PER_PAGE}`

export const getBasePrInfo = async (props: GetBasePrInfoProps): Promise<GitgetPrInfo[] | HttpError > =>
    needle('get', buildGetBasePrInfoUrl(props), needleOptions)
        .then(peekResponse(1))
        .then(handleNeedleResponseError)
        .then(responseBody => responseBody.map((prInfo: GithubPrInfo) => ({
            id: prInfo.id,
            number: prInfo.number,
            title: prInfo.title,
            author: prInfo.user.login,
        })))




export const getTotalResultLength = async ({ length, ...props}: GetResultLengthProps) =>
    PER_PAGE === length ?
        length + await getCommitCount({ ...props, page: props.page + 1 }) :
        length

const buildGetCommitCountUrl = ({ owner, repoName, prNumber, page }: GetCommitCountProps) =>
    `https://api.github.com/repos/${owner}/${repoName}/pulls/${prNumber}/commits?per_page=${PER_PAGE}&page=${page}`

export const getCommitCount = (props: GetCommitCountProps): Promise<number> =>
    needle('get', buildGetCommitCountUrl(props), needleOptions)
        .then(handleNeedleResponseError)
        .then(async resultBody => await getTotalResultLength({ length: resultBody.length, ...props }))
        .then(count => {
            console.log('Count = ', count)
            return count
        })
