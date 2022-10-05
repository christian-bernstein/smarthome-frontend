export interface PacketSubContext<Packet> {
    packet: Packet,
    respond(out: Packet): void
}
