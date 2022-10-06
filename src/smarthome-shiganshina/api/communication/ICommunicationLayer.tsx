import {ICommunicationEndpoint} from "./ICommunicationEndpoint";
import {IPredicate} from "../../../tests/atlas/api/IPredicate";

export interface ICommunicationLayer {
    endpoints(...predicates: Array<IPredicate<ICommunicationEndpoint>>): Array<ICommunicationEndpoint>,
    endpointFromID(id: string, action: ((endpoint: ICommunicationEndpoint) => void) | void): ICommunicationEndpoint,
    addEndpoints(...endpoint: Array<ICommunicationEndpoint>): ICommunicationLayer
}
