import {IShiganshinaAPI} from "./IShiganshinaAPI";
import {LoadConfig} from "./initialization/LoadConfig";
import {LoadTask} from "./initialization/LoadTask";
import {ILoadContext} from "./initialization/ILoadContext";
import {LoadTaskStateInfo} from "./initialization/LoadTaskStateInfo";
import {LoadState} from "./initialization/LoadState";
import {v4} from "uuid";
import {sleep} from "../../logic/Utils";
import moment from "moment";

export class ShiganshinaAPI implements IShiganshinaAPI {

    private readonly tasks: Array<LoadTask> = new Array<LoadTask>();

    private loadLocked: boolean = false;

    constructor() {
        this.registerLoadTask({
            initialState: {
                id: v4(),
                title: "Test 123",
                description: ["Loading web application. Configuring state & do other tasks"],
                startUnixTime: moment().unix(),
            },
            async run(ctx: ILoadContext) {
                await sleep(5000);
                ctx.terminate();
            }
        });

        this.registerLoadTask({
            initialState: {
                id: v4(),
                title: "Loading",
                description: ["Loading web application. Configuring state & do other tasks"],
                startUnixTime: moment().unix(),
                loadPercentage: 0,
                numIndicator: {value: 0, max: 100}
            },
            async run(ctx: ILoadContext) {
                const max = 100;

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

                ctx.terminate();
            }
        })
    }

    registerLoadTask(task: LoadTask): IShiganshinaAPI {
        this.tasks.push(task);
        return this;
    }

    async load(config: LoadConfig) {
        if (this.loadLocked) {
            throw new Error("ShiganshinaAPI: Trying to load, but load-lock is active");
        } else {
            this.loadLocked = true;
        }

        function onStateChanged(state: LoadTaskStateInfo) {
            config.onStateChanged?.(state);
        }

        function completeLoading() {
            config.onLoadComplete?.();
        }

        let stateCache: LoadTaskStateInfo | undefined = undefined;

        function update(tasks: Array<LoadTask>, index: number, discardPreviousData: boolean, newState: LoadTaskStateInfo) {
            const prevStateShallowCache = {...stateCache};
            const mixin: LoadTaskStateInfo | undefined = discardPreviousData ? {} : stateCache;

            stateCache = {...mixin, ...newState};
            if (prevStateShallowCache !== stateCache) {
                onStateChanged(stateCache);
            }

            // Check if the current update terminates the loading process
            if (index === tasks.length - 1 && newState.terminated) {
                completeLoading();
            }
        }

        for (let i = 0; i < this.tasks.length; i++) {
            stateCache = undefined;
            const task: LoadTask = this.tasks[i];

            if (config.executionPause !== undefined) {
                await sleep(config.executionPause);
            }

            if (task.initialState !== undefined) {
                update(this.tasks, i, false, task.initialState as LoadTaskStateInfo);
            }

            await task.run({
                api: this,
                config: config,
                update: (state: LoadTaskStateInfo, discardPreviousData: boolean = false) => {
                    update(this.tasks, i, discardPreviousData, state);
                },
                terminate: () => {
                    update(this.tasks, i, false, {
                        terminated: true
                    });
                }
            });
        }
    }
}
