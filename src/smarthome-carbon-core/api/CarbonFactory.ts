import {ICarbonAPI} from "./ICarbonAPI";

export interface CarbonFactory {
    create(): ICarbonAPI;
}
