import {ShiganshinaGateCommunicationEndpoint} from "./ShiganshinaGateCommunicationEndpoint";
import {ILanguageUnifier} from "./ILanguageUnifier";

export type ShiganshinaGateCommunicationEndpointConfig = Partial<{
    // Optional parameters
    endpointIDGenerator: () => string,
    onInit(endpoint: ShiganshinaGateCommunicationEndpoint): void
    autostartOnInit: boolean
    languageUnifier: ILanguageUnifier
}> & {
    // Required parameters
    address: string
}
