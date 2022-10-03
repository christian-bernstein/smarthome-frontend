import {LoadTaskStateInfo} from "./LoadTaskStateInfo";
import {BC} from "../../../logic/BernieComponent";

export interface LoadConfig {
    domEntryPoint?: BC<any, any, any>,
    executionPause?: number,
    onLoadComplete?(): void,
    onStateChanged?(state: LoadTaskStateInfo): void,
}
