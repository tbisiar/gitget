

export const PER_PAGE = parseInt(process.env.PER_PAGE || '10')

export const needleOptions = {
  headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_API_KEY}`
  }
}
