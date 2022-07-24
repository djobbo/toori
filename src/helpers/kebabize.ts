const kebabize = (str: string) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())

const excludedKeys = new Set(['env'])

export const kebabizeObject = (obj: Record<string, any>) => {
    if (Array.isArray(obj)) return obj

    const result: Record<string, any> = {}
    for (const [key, value] of Object.entries(obj)) {
        result[kebabize(key)] =
            !excludedKeys.has(key) && value instanceof Object
                ? kebabizeObject(value)
                : value
    }
    return result
}