
export type ActionName = `${string}/${string}@v${string}`

// go to the action repository /action.yml to see the options available

export type ActionOptions = {
    /**
     * @link https://github.com/actions/setup-node/blob/main/action.yml
     */
    'actions/setup-node@v3': {
        alwaysAuth?: 'true' | 'false',
        nodeVersion?: number | string,
        nodeVersionFile?: string,
        architecture?: string,
        checkLatest?: boolean,
        registryUrl?: string,
        scope?: string,
        token?: string,
        cache?: string,
        cacheDependencyPath?: string,
    },
    /**
     * @link https://github.com/actions/cache/blob/main/action.yml
     */
    'actions/cache@v3': {
        path?: string,
        key?: string,
        restoreKeys?: string | string[],
        uploadChunkSize?: number,
    }
    /**
     * @link https://github.com/JamesIves/github-pages-deploy-action/blob/dev/action.yml
     */
    'github-pages-deploy-action@v4': {
        /**
         * This option allows you to define a private SSH key to be used in conjunction with a repository deployment key to deploy using SSH.
         * The private key should be stored in the `secrets / with` menu **as a secret**. The public should be stored in the repositories deployment
         * keys menu and be given write access.
         * Alternatively you can set this field to `true` to enable SSH endpoints for deployment without configuring the ssh client. This can be useful if you've
         * already setup the SSH client using another package or action in a previous step.
         */
        sshKey?: string,
        /**
         * This option defaults to the repository scoped GitHub Token.
         * However if you need more permissions for things such as deploying to another repository, you can add a Personal Access Token (PAT) here.
         * This should be stored in the `secrets / with` menu **as a secret**.
         * We recommend using a service account with the least permissions neccersary
         * and when generating a new PAT that you select the least permission scopes required.
         * [Learn more about creating and using encrypted secrets here.](https://help.github.com/en/actions/automating-your-workflow-with-github-actions/creating-and-using-encrypted-secrets)
         */
        token?: string,
        /**
         * This is the branch you wish to deploy to, for example gh-pages or docs.
         */
        branch?: string,
        /**
         * The folder in your repository that you want to deploy. If your build script compiles into a directory named build you would put it here. Folder paths cannot have a leading / or ./. If you wish to deploy the root directory you can place a . here.
         */
        folder: string,
        /**
         * If you would like to push the contents of the deployment folder into a specific directory on the deployment branch you can specify it here.
         */
        targetFolder?: string,
        /**
         * If you need to customize the commit message for an integration you can do so.
         */
        commitMessage?: string,
        /**
         * If your project generates hashed files on build you can use this option to automatically delete them from the target folder on the deployment branch with each deploy. This option is on by default and can be toggled off by setting it to false.
         */
        clean?: boolean,
        /**
         * If you need to use clean but you would like to preserve certain files or folders you can use this option. This should contain each pattern as a single line in a multiline string.
         */
        cleanExclude?: string,
        /**
         * Do not actually push back, but use `--dry-run` on `git push` invocations insead.
         */
        dryRun?: boolean,
        /**
         * Whether to force-push and overwrite any existing deployment. Setting this to false will attempt to rebase simultaneous deployments. This option is on by default and can be toggled off by setting it to false.
         */
        force?: boolean,
        /**
         * Allows you to customize the name that is attached to the GitHub config which is used when pushing the deployment commits. If this is not included it will use the name in the GitHub context, followed by the name of the action.
         */
        gitConfigName?: string,
        /**
         * Allows you to customize the email that is attached to the GitHub config which is used when pushing the deployment commits. If this is not included it will use the email in the GitHub context, followed by a generic noreply GitHub email.
         */
        gitConfigEmail?: string,
        /**
         * Allows you to specify a different repository path so long as you have permissions to push to it. This should be formatted like so: JamesIves/github-pages-deploy-action
         */
        repositoryName?: string,
        /**
         * This should point to where your project lives on the virtual machine. The GitHub Actions environment will set this for you. It is only neccersary to set this variable if you're using the node module.
         */
        workspace?: string,
        /**
         * Add a tag to the commit, this can be used like so: 'v0.1'. Only works when 'dry-run' is not used.
         */
        tag?: string,
        /**
         * This option can be used if you'd prefer to have a single commit on the deployment branch instead of maintaining the full history.
         */
        singleCommit?: boolean,
        /**
         * Silences the action output preventing it from displaying git messages.
         */
        silent?: boolean,
    }
}