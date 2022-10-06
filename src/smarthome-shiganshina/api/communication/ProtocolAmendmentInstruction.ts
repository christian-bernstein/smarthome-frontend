export type ProtocolAmendmentInstruction = {
    protocols: Array<string>,
    unifierPolicy: "keep-existing" | "overwrite",
    currentProtocolPolicy: "keep" | "discard"
}
