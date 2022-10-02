import {LoadTaskStateInfo} from "./LoadTaskStateInfo";
import {BC} from "../../logic/BernieComponent";

export interface LoadConfig {
    domEntryPoint?: BC<any, any, any>,
    onLoadComplete?(): void,
    onStateChanged?(state: LoadTaskStateInfo): void
}
