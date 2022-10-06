import {ICommunicationEndpoint} from "./ICommunicationEndpoint";
import {IPredicate} from "../../../tests/atlas/api/IPredicate";

export interface ICommunicationLayer {
    endpoints(...predicates: Array<IPredicate<ICommunicationEndpoint>>): Array<ICommunicationEndpoint>,
    endpointFromID(id: string): ICommunicationEndpoint,
    addEndpoints(...endpoint: Array<ICommunicationEndpoint>): ICommunicationLayer
}
