import needle from "needle"
import { GitgetPrInfo } from "../prInfoHandler"
import { HttpError, handleNeedleResponseError } from "../util"
import { needleOptions, PER_PAGE } from "./config"
import { escapeHtml } from "@hapi/hoek"

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
  log: (s: string[], d: any) => {}
}

const buildGetBasePrInfoUrl = ({ owner, repoName }: GetBasePrInfoProps) =>
  `https://api.github.com/repos/${escapeHtml(owner)}/${escapeHtml(repoName)}/pulls?per_page=${PER_PAGE}`

export const getBasePrInfo = async (props: GetBasePrInfoProps): Promise<GitgetPrInfo[] | HttpError> =>
  needle('get', buildGetBasePrInfoUrl(props), needleOptions)
    .then(handleNeedleResponseError)
    .then(responseBody => responseBody.map((prInfo: GithubPrInfo) => ({
      id: prInfo.id,
      number: prInfo.number,
      title: prInfo.title,
      author: prInfo.user.login,
    })))

