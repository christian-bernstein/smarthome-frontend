import {CommunicationLayer} from "../../api/communication/CommunicationLayer";
import {INetInterface} from "../../api/communication/INetInterface";
import {ICommunicationEndpoint} from "../../api/communication/ICommunicationEndpoint";
import {ICommunicationLayer} from "../../api/communication/ICommunicationLayer";
import {ProtocolAmendmentInstruction} from "../../api/communication/ProtocolAmendmentInstruction";
import {ILanguageUnifier} from "../../api/communication/ILanguageUnifier";
import {DefaultLanguageUnifier} from "../../api/communication/DefaultLanguageUnifier";

export class TestCommunication1 {

    constructor() {
        // Create layer & add new endpoint implementation
        const cl: ICommunicationLayer = new CommunicationLayer().addEndpoints(<ICommunicationEndpoint> new class implements ICommunicationEndpoint {
            activateProtocol(instruction: ProtocolAmendmentInstruction): Promise<ICommunicationEndpoint> {

                return Promise.resolve(this);
            }

            languageUnifier(): ILanguageUnifier {
                return new DefaultLanguageUnifier();
            }
            close(): void {
            }

            id(): string {
                return "test-1"
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

        // Add custom on-message interceptor
        cl.endpointFromID("test-1").netInterface().registerOnMessageReceived(message => {

        });

        // cl.addEndpoints(new ShiganshinaGateCommunicationEndpoint(), { .. })

        // cl.endpointFromID("test-1").setFilter(message => false);

        // cl.endpointFromID("test-1").transcoder().registerOnTranscodeComplete<PacketType>("packet-type-name", ctx => { .. })
    }
}
