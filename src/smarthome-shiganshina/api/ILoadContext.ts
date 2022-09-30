import {IShiganshinaAPI} from "./IShiganshinaAPI";
import {LoadConfig} from "./LoadConfig";

export interface ILoadContext {
    api: IShiganshinaAPI,
    config: LoadConfig
}
