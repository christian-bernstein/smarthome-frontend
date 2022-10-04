import {ILoadContext} from "./ILoadContext";
import {LoadTaskStateInfo} from "./LoadTaskStateInfo";

export interface LoadTask {
    run(ctx: ILoadContext): void,
    initialState?: LoadTaskStateInfo
}
