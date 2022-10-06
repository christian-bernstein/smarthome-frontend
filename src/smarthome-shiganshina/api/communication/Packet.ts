export type Packet<Implementation> = Implementation & {
    id: string,
    unixTimestamp: number,
    headers: Map<string, string>
}
