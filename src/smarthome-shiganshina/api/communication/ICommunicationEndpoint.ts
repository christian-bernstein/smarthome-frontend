import {INetInterface} from "./INetInterface";

export interface ICommunicationEndpoint {
    id: string,
    netInterface: INetInterface,
    close(): void
}
