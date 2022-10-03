import {IShiganshinaAPI} from "../IShiganshinaAPI";
import {LoadConfig} from "./LoadConfig";
import {LoadTaskStateInfo} from "./LoadTaskStateInfo";

export interface ILoadContext {
    api: IShiganshinaAPI,
    config: LoadConfig,
    update: (state: LoadTaskStateInfo, discardPreviousData?: boolean) => void,
    terminate: () => void,
}
