import {CommunicationLayer} from "../../api/communication/CommunicationLayer";
import {ICommunicationLayer} from "../../api/communication/ICommunicationLayer";
import {ShiganshinaGateCommunicationEndpoint} from "../../api/communication/ShiganshinaGateCommunicationEndpoint";

export class TestCommunication1 {

    constructor() {

        // Create layer & add new endpoint implementation
        const cl: ICommunicationLayer = new CommunicationLayer().addEndpoints(new ShiganshinaGateCommunicationEndpoint({
            endpointIDGenerator: () => "main",
            address: "ws://localhost:7149",
            autostartOnInit: true
        }));

        // Add custom on-message interceptor
        cl.endpointFromID("test-1").netInterface().registerOnMessageReceived(message => {});

        // cl.addEndpoints(new ShiganshinaGateCommunicationEndpoint(), { .. })

        // cl.endpointFromID("test-1").setFilter(message => false);

        // cl.endpointFromID("test-1").transcoder().registerOnTranscodeComplete<PacketType>("packet-type-name", ctx => { .. })
    }
}
