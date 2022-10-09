import {INetInterface} from "./INetInterface";
import {ILanguageUnifier} from "./ILanguageUnifier";
import {ProtocolAmendmentInstruction} from "./ProtocolAmendmentInstruction";

export interface ICommunicationEndpoint {
    id(): string,
    netInterface(): INetInterface,
    start(): ICommunicationEndpoint,
    close(): void,
    languageUnifier(): ILanguageUnifier,
    activateProtocol(instruction: ProtocolAmendmentInstruction): Promise<ICommunicationEndpoint>
}
