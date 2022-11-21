# gitget

This is a solution for a take-home technical interview code test to fetch pull request information for a github repository, full requirements can be found at the bottom of this page.

# Solution

## Getting started

To make it easy for you to get started with the gitget, here's a list of steps to get going.

### Configuration:
- Add your personal access token for github to the `.env` file as GITHUB_API_KEY.  For information on generating the persal access token see: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

- Generate a key for jwt signing `node -p "require('crypto').randomBytes(48).toString('hex');"` and add it to the `.env` file as JWT_SECRET

### Running:

Run `npm i && npm run start:watch` in your terminal to get the local server running, once it is running you can run curl commands to login: 

```
curl --location --request POST 'http://localhost:3000/login' \
--form 'username=email_goes_here@domain.com'
```

then use the provided token get git repository pull request information (replacing <REPO_OWNER_GOES_HERE>, <REPO_NAME_GOES_HERE>, and <TOKEN_GOES_HERE> with the appropriate values):
```
curl --location --request POST 'http://localhost:3000/prinfo/<REPO_OWNER_GOES_HERE>/<REPO_NAME_GOES_HERE>' \
--header 'Authorization: Bearer <TOKEN_GOES_HERE>'
```
An example endpoint to get the PR info for the [Octocat Spoon-Knife repo](https://github.com/octocat/Spoon-Knife) would look like this: `http://localhost:3000/prinfo/octocat/Spoon-Knife`


## Test and Deploy

To run tests use the following npm script `npm run test`, this will run Jest unit tests, as well as end-to-end Hapi Lab tests.  

The Hapi Lab tests run against a local mock-service-worker instance endpoint with mock responses available within the `test/mocks/` directory.


# Todo

1. Add global logging framework (morgan?)
2. Add dockerfile
3. Add performance monitoring
4. Add lightweight React FE
5. Add SSL cert to use https


# Requirements

Using the GitHub API <https://developer.github.com/v3, we ask that you build an API that:

- Uses NodeJs
- Exposes an endpoint that returns the following information for a GitHub Repository URL provided by the user:
  - The id, number, title, author, and the number of commits of each open pull request.
  - (Do not use https://github.com/octokit to return this metadata. Instead, make multiple requests via the REST api to fetch the data necessary.)
- For each open PR, return the following information:
  - ID
  - Number
  - Title
  - Author
  - The number of commits
- The response from your API should look something like this:
```
[
  {
    id: 1,
    number: 100,
    title: "Tile of Pull Request 1",
    author: "Author of Pull Request 1",
    commit_count: 8
  },
  {
    id: 2,
    number: 101,
    title: "Tile of Pull Request 2",
    author: "Author of Pull Request 2",
    commit_count: 4
  },
  {
    id: 3,
    number: 102,
    title: "Tile of Pull Request 3",
    author: "Author of Pull Request 3",
    commit_count: 12
  }
]
```
- Implements a testing strategy (unit tests, integration tests, something else?)
- Incorporates simple, clean code architecture
  - Treat this like a real API intended for public consumption, barring resources and performance.
- Take your time to build your solution. We don’t want you to feel rushed balancing the interview process with your day-to-day life. So give us your best, not the fastest/easiest.