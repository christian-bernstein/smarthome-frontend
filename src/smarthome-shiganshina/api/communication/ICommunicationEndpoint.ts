import {INetInterface} from "./INetInterface";
import {ILanguageUnifier} from "./ILanguageUnifier";

export interface ICommunicationEndpoint {
    id(): string,
    netInterface(): INetInterface,
    close(): void,
    languageUnifier(): ILanguageUnifier
}
