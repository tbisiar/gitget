import needle from "needle"
import { handleNeedleResponseError } from "../util"
import { needleOptions, PER_PAGE } from "./config"
import { escapeHtml } from "@hapi/hoek"

type GetResultLengthProps = {
  length: number
  owner: string
  repoName: string
  prNumber: number
  page: number
  log: (s: string[], d: any) => {}
}

type GetCommitCountProps = {
  owner: string
  repoName: string
  prNumber: number
  page: number
  log: (s: string[], d: any) => {}
}

export const getTotalResultLength = async ({ length, ...props}: GetResultLengthProps) =>
PER_PAGE === length ?
    length + await getCommitCount({ ...props, page: props.page + 1 }) :
    length

const buildGetCommitCountUrl = ({ owner, repoName, prNumber, page }: GetCommitCountProps) =>
`https://api.github.com/repos/${escapeHtml(owner)}/${escapeHtml(repoName)}/pulls/${prNumber}/commits?per_page=${PER_PAGE}&page=${page}`

export const getCommitCount = (props: GetCommitCountProps): Promise<number> =>
needle('get', buildGetCommitCountUrl(props), needleOptions)
    .then(handleNeedleResponseError)
    .then(async resultBody => await getTotalResultLength({ length: resultBody.length, ...props }))
