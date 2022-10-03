import {IShiganshinaAPI} from "./IShiganshinaAPI";
import {LoadConfig} from "./initialization/LoadConfig";
import {LoadTask} from "./initialization/LoadTask";
import {ILoadContext} from "./initialization/ILoadContext";
import {LoadTaskStateInfo} from "./initialization/LoadTaskStateInfo";
import {LoadState} from "./initialization/LoadState";
import moment from "moment";
import {v4} from "uuid";

export class ShiganshinaAPI implements IShiganshinaAPI {

    private loadLocked: boolean = false

    async load(config: LoadConfig) {
        if (this.loadLocked) {
            throw new Error("ShiganshinaAPI: Trying to load, but load-lock is active");
        } else {
            this.loadLocked = true;
        }

        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

        const tasks: Array<LoadTask> = [
            {
                async run(ctx: ILoadContext) {
                    ctx.update({
                        id: v4(),
                        title: "Test 123",
                        description: ["Loading web application. Configuring state & do other tasks"],
                        startUnixTime: moment().unix(),
                        loadPercentage: 0
                    });

                    await sleep(1000);

                    ctx.update({
                        id: v4(),
                        title: "Test 1234",
                        description: ["Loading web application. Configuring state & do other tasks"],
                        startUnixTime: moment().unix(),
                        loadPercentage: 0
                    });

                    await sleep(5000);

                    ctx.terminate();
                }
            },
            {
                async run(ctx: ILoadContext) {
                    const max = 100;

                    ctx.update({
                        id: v4(),
                        title: "Loading",
                        description: ["Loading web application. Configuring state & do other tasks"],
                        startUnixTime: moment().unix(),
                        loadPercentage: 0,
                        numIndicator: { value: 0, max: max }
                    });

                    for (let i = 0; i <= max; i++) {
                        await sleep(100);

                        ctx.update({
                            loadPercentage: Number(Number((i / max * 100)).toFixed(2)),
                            numIndicator: {
                                value: i,
                                max: max
                            }
                        });

                        if (i === 5) {
                            ctx.update({
                                state: LoadState.WAITING,
                                appendices: ["require user input"],
                                subtask: {
                                    id: v4(),
                                    title: "Downloading settings",
                                    description: ["Downloading settings from settings server"]
                                }
                            });

                            await sleep(8e3);

                            ctx.update({
                                state: LoadState.RUNNING,
                                appendices: undefined,
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

        function update(tasks: Array<LoadTask>, index: number, discardPreviousData: boolean, newState: LoadTaskStateInfo) {
            const prevStateShallowCache = { ...stateCache };
            const mixin: LoadTaskStateInfo | undefined = discardPreviousData ? {} : stateCache;

            stateCache = { ...mixin, ...newState };
            if (prevStateShallowCache !== stateCache) {
                onStateChanged(stateCache);
            }

            // Check if the current update terminates the loading process
            if (index === tasks.length - 1 && newState.terminated) {
                completeLoading();
            }
        }



        for (let i = 0; i < tasks.length; i++) {
            stateCache = undefined;
            const task: LoadTask = tasks[i];

            if (config.executionPause !== undefined) {
                await sleep(config.executionPause);
            }

            await task.run({
                api: this,
                config: config,
                update: (state: LoadTaskStateInfo, discardPreviousData: boolean = false) => {
                    update(tasks, i, discardPreviousData, state);
                },
                terminate: () => {
                    update(tasks, i, false, {
                        terminated: true
                    });
                }
            });
        }
    }
}
