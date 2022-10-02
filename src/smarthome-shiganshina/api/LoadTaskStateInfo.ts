import {LoadState} from "./LoadState";

export type LoadTaskStateInfo = Partial<{
    startUnixTime: number,
    subtask: LoadTaskStateInfo,
    title: string,
    description: Array<string>
    info: string,
    loadPercentage: number,
    terminated: boolean,
    state: LoadState,
    numIndicator: {
        value: number,
        max: number
    }
}>
