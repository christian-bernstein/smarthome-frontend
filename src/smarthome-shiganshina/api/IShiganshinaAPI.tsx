import {LoadConfig} from "./initialization/LoadConfig";
import {ShiganshinaFactory} from "./ShiganshinaFactory";

export interface IShiganshinaAPI {

    load(config: LoadConfig): void

}

export let api: IShiganshinaAPI | undefined = undefined;

export const shiganshina: (factory?: ShiganshinaFactory) => IShiganshinaAPI = (factory) => {
    if (api === undefined) {
        if (factory === undefined) {
            throw new Error("Cannot return IShiganshinaAPI instance, because it is undefined. Initialize it first.");
        } else {
            try {
                return api = factory.create();
            } catch (e) {
                throw new Error(`Error while calling shiganshina factory. Underlying error: '${e}'`);
            }
        }
    } else return api;
}
