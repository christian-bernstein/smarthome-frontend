import {ICommunicationLayer} from "./ICommunicationLayer";
import {ICommunicationEndpoint} from "./ICommunicationEndpoint";
import {IPredicate} from "../../../tests/atlas/api/IPredicate";

export class CommunicationLayer implements ICommunicationLayer {

    private readonly _endpoints: Array<ICommunicationEndpoint> = new Array<ICommunicationEndpoint>();

    public endpoints(...predicates: Array<IPredicate<ICommunicationEndpoint>>): Array<ICommunicationEndpoint> {
        return this._endpoints.filter(ep => {
            let bool: boolean = false;
            predicates.forEach(predicate => {
                if (predicate.test(ep)) {
                    bool = true;
                }
            });
            return bool;
        });
    }

    public addEndpoints(...endpoint: Array<ICommunicationEndpoint>): ICommunicationLayer {
        this._endpoints.push(...endpoint);
        return this;
    }

    endpointFromID(id: string, action:((endpoint: ICommunicationEndpoint) => void) | void): ICommunicationEndpoint {
        const ep = this.endpoints({
            test(obj: ICommunicationEndpoint): boolean {
                return obj.id() === id;
            }
        })[0] ?? undefined;
        if (action !== undefined) {
            action(ep);
        }
        return ep;
    }
}
