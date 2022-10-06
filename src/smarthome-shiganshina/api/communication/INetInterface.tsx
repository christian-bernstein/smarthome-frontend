export interface INetInterface {
    send(message: string): void,
    registerOnMessageReceived(handler: (message: string) => void): INetInterface
}
