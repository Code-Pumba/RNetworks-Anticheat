export enum RepositoryType {
    Test = "test"
}

export type RepositoryMapping = {
    [RepositoryType.Test]: any;
}

export interface RepositoryConfig extends Record<keyof RepositoryMapping, any> {
    [RepositoryType.Test]: Record<string, String>
}