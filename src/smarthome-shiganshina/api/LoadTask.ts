import {LoadConfig} from "./LoadConfig";
import {IShiganshinaAPI} from "./IShiganshinaAPI";
import {ILoadContext} from "./ILoadContext";

export interface LoadTask {
    run(ctx: ILoadContext): void
}
