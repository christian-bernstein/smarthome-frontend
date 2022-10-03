import {LoadState} from "./LoadState";

export type LoadTaskStateInfo = Partial<{
    // TODO: Make mandatory
    id: string,

    startUnixTime: number,
    subtask: LoadTaskStateInfo,
    title: string,
    description: Array<string>
    info: string,
    loadPercentage: number,
    terminated: boolean,
    state: LoadState,
    appendices: Array<string>,
    numIndicator: {
        value: number,
        max: number
    }
}>
