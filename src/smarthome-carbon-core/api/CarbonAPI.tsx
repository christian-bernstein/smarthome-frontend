import {Themeable} from "../../logic/style/Themeable";
import {ICarbonAPI} from "./ICarbonAPI";
import {CarbonConfig} from "./CarbonConfig";
import {Assembly} from "../../logic/assembly/Assembly";
import {BernieComponent} from "../../logic/BernieComponent";

export class CarbonAPI implements ICarbonAPI {

    globalTheme(): Themeable.Theme {
        return Themeable.darkTritanopiaTheme;
    }

    gt(): Themeable.Theme {
        return this.globalTheme();
    }

    init(config: CarbonConfig): ICarbonAPI {
        return this;
    }

    cc<T, S, V extends object>(render?: ((i: BernieComponent<T, S, V>, p: T, s: S, l: V) => (JSX.Element | undefined))): typeof BernieComponent<T, S, V> {
        return this.createComponentClass(render);
    }

    createComponentClass<T, S, V extends object>(render?: ((i: BernieComponent<T, S, V>, p: T, s: S, l: V) => (JSX.Element | undefined))): typeof BernieComponent<T, S, V> {
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
}
