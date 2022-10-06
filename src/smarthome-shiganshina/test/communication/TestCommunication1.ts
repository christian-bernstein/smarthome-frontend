import {CommunicationLayer} from "../../api/communication/CommunicationLayer";
import {INetInterface} from "../../api/communication/INetInterface";
import {ICommunicationEndpoint} from "../../api/communication/ICommunicationEndpoint";

export class TestCommunication1 {

    constructor() {
        new CommunicationLayer().endpoints().push(new class implements ICommunicationEndpoint {
            close(): void {

            }

            id(): string {
                return "";
            }

            netInterface(): INetInterface {
                return {
                    send(message: string) {

                    },
                    registerOnMessageReceived(handler: (message: string) => void): INetInterface {
                        return this;
                    }
                };
            }
        });
    }
}
