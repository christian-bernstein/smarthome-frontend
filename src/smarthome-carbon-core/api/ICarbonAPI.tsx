import {CarbonConfig} from "./CarbonConfig";
import {BernieComponent} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {CarbonFactory} from "./CarbonFactory";
import {Assembly} from "../../logic/assembly/Assembly";

export interface ICarbonAPI {
    init(config: CarbonConfig): ICarbonAPI;
    globalTheme(): Themeable.Theme;
    createComponentClass: <T, S, V extends object>(render?: ((i: BernieComponent<T, S, V>, p: T, s: S, l: V) => JSX.Element | undefined)) => typeof BernieComponent<T, S, V>

    /**
     * gt() is a shortcut for ICarbonAPI.globalTheme()
     */
    gt(): Themeable.Theme;

    /**
     * cc() is a shortcut for ICarbonAPI.createComponentClass()
     */
    cc: <T, S, V extends object>(render?: ((i: BernieComponent<T, S, V>, p: T, s: S, l: V) => JSX.Element | undefined)) => typeof BernieComponent<T, S, V>
}

export let api: ICarbonAPI | undefined = undefined;

export const carbon: (factory?: CarbonFactory) => ICarbonAPI = (factory) => {
    if (api === undefined) {
        if (factory === undefined) {
            throw new Error("Cannot return ICarbonAPI instance, because it is undefined. Initialize it first.");
        } else {
            try {
                return api = factory.create();
            } catch (e) {
                throw new Error(`Error while calling carbon factory. Underlying error: '${e}'`);
            }
        }
    } else return api;
}

export function createComponentClass<T, S, V extends object>(render?: ((i: BernieComponent<T, S, V>, p: T, s: S, l: V) => (JSX.Element | undefined))): typeof BernieComponent<T, S, V> {
    return class CCImpl extends BernieComponent<T, S, V> {
        componentRender(p: T, s: S, l: V, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
            return render === undefined ? (
                super.componentRender(p, s, l, t, a)
            ) : (
                render(this, p, s, l)
            );
        }
    };
}

export {
    createComponentClass as cc,
    createComponentClass as carbonClass
}
