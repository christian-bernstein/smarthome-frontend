import {BernieComponent} from "../logic/BernieComponent";
import {Assembly} from "../logic/assembly/Assembly";
import {Themeable} from "../logic/style/Themeable";
import {Screen} from "../components/lo/Page";
import {Centered} from "../components/lo/PosInCenter";
import {CarbonAPI} from "../smarthome-carbon-core/api/CarbonAPI";
import {carbon, carbonClass, ICarbonAPI} from "../smarthome-carbon-core/api/ICarbonAPI";
import {AF} from "../components/logic/ArrayFragment";
import {LoadStateGroupDisplay} from "./components/ho/LoadStateGroupDisplay";
import {ShiganshinaAPI} from "./api/ShiganshinaAPI";
import {Flex} from "../components/lo/FlexBox";
import {Align} from "../logic/style/Align";
import {LoadTaskStateInfo} from "./api/initialization/LoadTaskStateInfo";
import {ShiganshinaLogo} from "./components/lo/ShiganshinaLogo";
import {Justify} from "../logic/style/Justify";
import React, {useEffect, useState} from "react";
import {Collapse} from "@mui/material";
import {TransitionGroup} from "react-transition-group";
import {createMargin} from "../logic/style/Margin";
import {IShiganshinaAPI, shiganshina} from "./api/IShiganshinaAPI";
import {ShiganshinaLoaderV2} from "./components/ho/ShiganshinaLoader";

type LoadDisplayProps = {
    onFinish?: () => void
}

class LoadDisplay extends carbonClass<LoadDisplayProps, any, { state?: LoadTaskStateInfo }>() {

    constructor(props: LoadDisplayProps) {
        super(props, undefined, {});
    }

    componentDidMount() {
        super.componentDidMount();

        setTimeout(() => {
            shiganshina().load({
                domEntryPoint: this,
                onStateChanged: state => {
                    this.local.setStateWithChannels({
                        state: state
                    }, ["data"])
                },
                onLoadComplete: () => {
                    this.props.onFinish?.();
                }
            });
        }, 1e3);
    }

    componentRender(p: unknown, s: unknown, l: { state?: LoadTaskStateInfo }, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw style={{ position: "relative", height: "25vh" }} align={Align.CENTER} elements={[
                <Flex style={{ position: "absolute" }} elements={[
                    this.component(local => {
                        if (local.state.state === undefined) {
                            return (
                                <LoadStateGroupDisplay tasks={[{
                                    title: "Booting",
                                    description: ["Preparing Shiganshina-API loading routine"]
                                }]}/>
                            );
                        } else {
                            const taskTree: Array<LoadTaskStateInfo> = [local.state.state];
                            let curState = local.state.state;
                            while (curState.subtask !== undefined) {
                                taskTree.push(curState.subtask);
                                curState = curState.subtask;
                            }

                            return (
                                <LoadStateGroupDisplay tasks={taskTree}/>
                            )
                        }
                    }, "data")
                ]}/>
            ]}/>
        );
    }
}

export type DisplayProps = {
    onFinish?: () => void
}

const Display: React.FC<DisplayProps> = props => {
    const [elements, setElements] = useState(["logo"]);

    interface Map {
        [key: string]: () => JSX.Element
    }

    const elementRenderer: Map = {
        "logo": () => (
            <Flex align={Align.CENTER} fw justifyContent={Justify.CENTER} elements={[
                <ShiganshinaLogo raw/>
            ]}/>
        ),
        "progress": () => (
            <Flex align={Align.CENTER} fw elements={[
                // <LoadDisplay onFinish={() => {
                //     setTimeout(() => {
                //         setElements(prevState => prevState.filter(elem => elem !== "progress"));
                //         props.onFinish?.();
                //     }, 2e3);
                // }}/>

                <Flex fw style={{ position: "relative", height: "25vh" }} align={Align.CENTER} elements={[
                    <Flex style={{ position: "absolute" }} elements={[
                        <ShiganshinaLoaderV2 onLoadComplete={() => {
                            setTimeout(() => {
                                setElements(prevState => prevState.filter(elem => elem !== "progress"));
                                props.onFinish?.();
                            }, 2e3);
                        }}/>
                    ]}/>
                ]}/>
            ]}/>
        )
    }

    useEffect(() => {
        setTimeout(() => {
            setElements(prevState => (
                [...prevState, "progress"]
            ))
        }, 1e3);
    }, []);

    return (
        <TransitionGroup>
            {elements.map((elem, index) => {
                const renderer: () => JSX.Element = elementRenderer[elem] ?? (() => <></>);

                return (
                    <Collapse key={elem}>
                        <Flex align={Align.CENTER} margin={index > 0 ? createMargin(70,  0, 0, 0) : undefined} justifyContent={Justify.CENTER} elements={[
                            renderer()
                        ]}/>
                    </Collapse>
                );
            })}
        </TransitionGroup>
    );
}

export class ShiganshinaLauncher extends BernieComponent<any, any, any> {

    componentDidMount() {
        super.componentDidMount();

        // Todo move this to an API -> ShiganshinaAPI
        carbon({
            create(): ICarbonAPI {
                return new CarbonAPI();
            }
        });

        shiganshina({
            create(): IShiganshinaAPI {
                return new ShiganshinaAPI();
            }
        })

        setTimeout(() => {
            this.dialog(
                <Screen deactivatePadding style={{ backgroundColor: "black", position: "relative" }} children={
                    <AF elements={[
                        <Centered fullHeight children={
                            <Display onFinish={() => {
                                setTimeout(() => {
                                    this.closeLocalDialog();
                                }, 1e3);
                            }}/>
                        }/>
                    ]}/>
                }/>
            );
        }, 1.5e3);
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Screen deactivatePadding style={{ backgroundColor: "black" }}/>
        );
    }
}
