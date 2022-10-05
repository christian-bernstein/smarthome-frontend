import {PacketSubContext} from "./PacketSubContext";

export interface IPacketSubHandler<Packet> {
    handle(ctx: PacketSubContext<Packet>): void
}
