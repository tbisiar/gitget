import { rest } from 'msw'

export const handlers = [
  rest.get('https://api.github.com/repos/mock-owner/mock-repo-name/pulls', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          "id": 1234567890,
          "number": 54321,
          "title": "Example pull-request title",
          "user": {
            "login": "mock-user"
          }
        }
      ]),
    )
  }),
  rest.get('https://api.github.com/repos/mock-owner/mock-repo-name/pulls/:prNumber/commits', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {},
        {},
        {}
      ]),
    )
  }),
]