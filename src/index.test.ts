import { createWorkflow } from '.'

describe('create workflow', () => {
  it('should create a workflow', () => {
    const workflow = createWorkflow('Build and Deploy Docs')
      .on(['push', { branches: ['master'] }])
      .job('build-and-deploy', {
        concurrency: 'ci-${{ github.ref }}',
        runsOn: 'ubuntu-latest'
      }, (job) => {
        job
          .use('Checkout 🛎️', 'actions/checkout@v3')
          .use('Setup pnpm', 'pnpm/action-setup@v2')
          .use('Setup Node', 'actions/setup-node@v3', { with: { nodeVersion: '16' } })
          .step('Install and Build 🔧', (step) => {
            step
              .run('pnpm ci')
              .run('pnpm docs:build')
          })
          .use('Deploy 🚀', 'JamesIves/github-pages-deploy-action@v4.2.5', {
            with: {
              branch: 'gh-pages',
              folder: 'docs/guide/.vuepress/dist'
            }
          })
      })

    expect(workflow.toYAML()).toMatchSnapshot()
  })

  it('should create a workflow 2', () => {
    const workflow = createWorkflow('Publish dev')
      .on('workflow_dispatch', ['push', { branches: ['master'] }])
      .job('npm', {
        runsOn: 'ubuntu-latest',
        if: "github.repository_owner == 'djobbo'"
      }, (job) => {
        job
          .use('Checkout 🛎️', 'actions/checkout@v3')
          .use('Setup pnpm', 'pnpm/action-setup@v2')
          .use('Setup Node', 'actions/setup-node@v3', {
            with: {
              nodeVersion: '16',
              registryUrl: 'https://registry.npmjs.org/',
              cache: 'pnpm',
            }
          })
          .use('Turbo cache', 'actions/cache@v2', {
            id: 'turbo-cache',
            with: {
              path: '.turbo',
              key: 'turbo-${{ github.job }}-${{ github.ref_name }}-${{ github.sha }}',
              restoreKeys: 'turbo-${{ github.job }}-${{ github.ref_name }}-'
            }
          })
          .step('Publish', {
            run: 'pnpx zx ./scripts/publish-dev.mjs', env: {
              NODE_AUTH_TOKEN: '${{ secrets.NPM_PUBLISH_TOKEN }}'
            }
          })
      })
    console.log(workflow.toYAML())

    expect(workflow.toYAML()).toMatchSnapshot()

  })
})