import {ICommunicationEndpoint} from "./ICommunicationEndpoint";
import {ProtocolAmendmentInstruction} from "./ProtocolAmendmentInstruction";
import {ILanguageUnifier} from "./ILanguageUnifier";
import {INetInterface} from "./INetInterface";
import {ShiganshinaGateCommunicationEndpointConfig} from "./ShiganshinaGateCommunicationEndpointConfig";
import {v4} from "uuid";
import {DefaultLanguageUnifier} from "./DefaultLanguageUnifier";

export class ShiganshinaGateCommunicationEndpoint implements ICommunicationEndpoint {

    private readonly config: ShiganshinaGateCommunicationEndpointConfig;

    private _id?: string;

    constructor(config: ShiganshinaGateCommunicationEndpointConfig) {
        this.config = config;
        this.init();
    }

    private init() {
        this._id = this.getConfig().endpointIDGenerator?.() ?? v4();
        this.getConfig().onInit?.(this);
        if (this.getConfig().autostartOnInit ?? false) {
            this.start();
        }
    }

    public id(): string {
        return this._id as string;
    }

    public getConfig(): ShiganshinaGateCommunicationEndpointConfig {
        return this.config;
    }

    public languageUnifier(): ILanguageUnifier {
        return this.getConfig().languageUnifier ?? new DefaultLanguageUnifier();
    }

    public start(): ICommunicationEndpoint {
        return this;
    }

    public activateProtocol(instruction: ProtocolAmendmentInstruction): Promise<ICommunicationEndpoint> {
        return Promise.resolve(this);
    }

    public close(): void {
    }

    public netInterface(): INetInterface {
        return {
            send(message: string) {
            },
            registerOnMessageReceived(handler: (message: string) => void): INetInterface {
                return this;
            }
        };
    }
}
