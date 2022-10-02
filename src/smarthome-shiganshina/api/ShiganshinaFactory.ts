import {IShiganshinaAPI} from "./IShiganshinaAPI";

export interface ShiganshinaFactory {
    create(): IShiganshinaAPI;
}
