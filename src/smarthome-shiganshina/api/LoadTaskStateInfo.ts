export type LoadTaskStateInfo = Partial<{
    title: string,
    description: Array<string>
    info: string,
    loadPercentage: number,
    numIndicator: {
        value: number,
        max: number
    }
}>
