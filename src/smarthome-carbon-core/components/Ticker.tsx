import {cc} from "../api/ICarbonAPI";
import {CP} from "../api/CarbonProps";

export type TickerProps = CP<{
    interval: number,
    renderer: (counter: number) => JSX.Element
}, {
    baseCounter: number
    counterResetThreshold: number,
    onTickerReset: () => void
}>

export type TickerLocalState = {
    counter: number,
    interval?: any
}

export class Ticker extends cc<TickerProps, unknown, TickerLocalState>((i, p, s, l) => {
    return i.component(local => p.renderer(local.state.counter as number), "ticker");
}) {
    constructor(props: TickerProps) {
        super(props, undefined, {
            counter: props.baseCounter ?? 0
        });
    }

    componentDidMount() {
        super.componentDidMount();
        this.local.setState({
            interval: setInterval(() => {
                let newCounter = this.local.state.counter + 1;
                let counterReset = false;
                if (this.props.counterResetThreshold !== undefined && newCounter >= this.props.counterResetThreshold) {
                    newCounter = this.props.baseCounter ?? 0;
                    counterReset = true;
                }

                this.local.setStateWithChannels({
                    counter: newCounter
                }, ["ticker"], () => {
                    if (counterReset) {
                        this.props.onTickerReset?.();
                    }
                });
            }, this.props.interval)
        });
    }

    componentWillUnmount() {
        super.componentWillUnmount();
        if (this.local.state.interval !== undefined) {
            clearInterval(this.local.state.interval);
        }
    }
}
