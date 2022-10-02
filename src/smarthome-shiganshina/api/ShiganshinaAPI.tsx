import {IShiganshinaAPI} from "./IShiganshinaAPI";
import {LoadConfig} from "./LoadConfig";
import {LoadTask} from "./LoadTask";
import {ILoadContext} from "./ILoadContext";
import {LoadTaskStateInfo} from "./LoadTaskStateInfo";
import {ConfirmationDialog} from "../../components/lo/ConfirmationDialog";
import {ObjectVisualMeaning} from "../../logic/style/ObjectVisualMeaning";
import {ConfirmationType} from "../../logic/ConfirmationConfig";
import {BernieComponent} from "../../logic/BernieComponent";
import {LoadState} from "./LoadState";
import moment from "moment";

export class ShiganshinaAPI implements IShiganshinaAPI {

    private loadLocked: boolean = false

    load(config: LoadConfig) {
        if (this.loadLocked) {
            throw new Error("ShiganshinaAPI: Trying to load, but load-lock is active");
        } else {
            this.loadLocked = true;
        }

        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        const tasks: Array<LoadTask> = [
            {
                async run(ctx: ILoadContext) {
                    const max = 50;

                    ctx.update({
                        title: "Loading",
                        description: ["Loading web application. Configuring state & do other tasks"],
                        startUnixTime: moment().unix(),
                        loadPercentage: 0,
                        numIndicator: { value: 0, max: max }
                    });

                    for (let i = 0; i <= max; i++) {
                        await sleep(500);

                        ctx.update({
                            loadPercentage: Number(Number((i / max * 100)).toFixed(2)),
                            numIndicator: {
                                value: i,
                                max: max
                            }
                        });

                        if (i === 1) {
                            ctx.update({
                                state: LoadState.WAITING,
                                subtask: {
                                    title: "Downloading settings",
                                    description: ["Downloading settings from settings server"]
                                }
                            });

                            await sleep(5e3);

                            ctx.update({
                                state: LoadState.RUNNING,
                                subtask: undefined
                            });
                        }
                    }

                    ctx.update({
                        terminated: true
                    });
                }
            }
        ];

        /**
         * Called after update triggered with a new & different state then before.
         *
         * @param state The new state (state after combining cached state & state delta)
         */
        function onStateChanged(state: LoadTaskStateInfo) {
            config.onStateChanged?.(state);
        }

        function completeLoading() {
            config.onLoadComplete?.();
        }

        let stateCache: LoadTaskStateInfo | undefined = undefined;
        tasks.forEach((task: LoadTask, index, array) => {
            // TODO: Add optional delay between each operation -> React might combine updates!

            // TODO: Wrap safely
            task.run({
                api: this,
                config: config,
                update: (state: LoadTaskStateInfo, discardPreviousData: boolean = true) => {
                    const prevStateShallowCache = { ...stateCache };
                    stateCache = { ...stateCache, ...state };

                    if (prevStateShallowCache !== stateCache) {
                        onStateChanged(stateCache);
                    }

                    console.log("updated", stateCache);

                    // Check if the current update terminates the loading
                    if (index === array.length - 1 && state.terminated) {
                        completeLoading();
                    }
                }
            })
        });
    }
}
