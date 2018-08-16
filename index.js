const octokit = require('@octokit/rest')()

// custom GitHub Enterprise URL
// baseUrl: 'https://api.github.com',

octokit.authenticate({
  type: 'token',
  token: process.env.GITHUB_TOKEN
})

exports.handler = (event, context, callback) => {
  console.log(`Received event: ${event}`)
  let tag_name
  const owner = process.env.GITHUB_LOGIN
  const repo = process.env.GITHUB_REPO

  octokit.repos.getLatestRelease({
    owner,
    repo
  }).then(result => {
    tag_name = (parseInt(result.data.tag_name) + 1.0).toString() + '.0'

    octokit.repos.createRelease({
      owner,
      repo,
      tag_name
    }, (error, result) => {
      if (error) throw new Error()
      if (result) console.log(`Created Release: ${JSON.stringify(result)}`)
    })
  })

  octokit.repos.createDeployment({
    owner,
    repo,
    ref: 'master',
    description: `Deploying ${tag_name} version`
  }, (error, result) => {
    if (error) throw new Error()
    if (result) console.log(`Created Deployment: ${JSON.stringify(result)}`)
  })
}
