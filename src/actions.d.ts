
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
        sshKey?: string,
        token?: string,
        branch?: string,
        folder: string,
        targetFolder?: string,
        commitMessage?: string,
        clean?: boolean,
        cleanExclude?: string,
        dryRun?: boolean,
        force?: boolean,
        gitConfigName?: string,
        gitConfigEmail?: string,
        repositoryName?: string,
        workspace?: string,
        tag?: string,
        singleCommit?: boolean,
        silent?: boolean,
    }
}