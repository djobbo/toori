
export type ActionName = `${string}/${string}@v${string}`

export type ActionOptions = {
    'actions/setup-node@v3': {
        nodeVersion?: string,
        registryUrl?: string,
        cache?: string,
    }
}