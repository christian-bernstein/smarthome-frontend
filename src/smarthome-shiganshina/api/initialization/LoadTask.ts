import {ILoadContext} from "./ILoadContext";

export interface LoadTask {
    run(ctx: ILoadContext): void
}
