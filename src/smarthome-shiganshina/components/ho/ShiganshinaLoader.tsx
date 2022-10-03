import {BC} from "../../../logic/BernieComponent";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {shiganshina} from "../../api/IShiganshinaAPI";
import {LoadTaskStateInfo} from "../../api/initialization/LoadTaskStateInfo";
import {Flex} from "../../../components/lo/FlexBox";
import {Box, Collapse, List, ListItem, Zoom} from "@mui/material";
import {Align} from "../../../logic/style/Align";
import {createMargin} from "../../../logic/style/Margin";
import {Justify} from "../../../logic/style/Justify";
import {TransitionGroup} from "react-transition-group";
import React, {useEffect, useState} from "react";
import {AF} from "../../../components/logic/ArrayFragment";
import {LoadStateDisplay} from "./LoadStateDisplay";
import {px} from "../../../logic/style/DimensionalMeasured";
import {CP} from "../../../smarthome-carbon-core/api/CarbonProps";

export type ShiganshinaLoaderProps = CP<unknown, {
    onLoadComplete: () => void
}>

export type ShiganshinaLoaderState = Partial<{
    state: LoadTaskStateInfo
}>

export class ShiganshinaLoader extends BC<ShiganshinaLoaderProps, ShiganshinaLoaderState, any> {

    constructor(props: ShiganshinaLoaderProps) {
        super(props, {}, undefined);
    }

    componentDidMount() {
        super.componentDidMount();

        setTimeout(() => {
            shiganshina().load({
                domEntryPoint: this,
                onStateChanged: state => {
                    this.setState({
                        state: state
                    });
                },
                onLoadComplete: () => {
                    this.props.onLoadComplete?.();
                }
            });
        }, 1e3);
    }

    componentRender(p: any, s: ShiganshinaLoaderState, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const taskTree: Array<LoadTaskStateInfo> = [this.state.state ?? {}];
        let curState = this.state.state ?? {};
        while (curState.subtask !== undefined) {
            taskTree.push(curState.subtask);
            curState = curState.subtask;
        }

        return (
            <Flex width={px(400)} gap={px()} elements={[
                <List children={
                    <TransitionGroup>
                        {
                            taskTree.map((elem, index, arr) => {
                                return (
                                    <Collapse key={elem.id} children={
                                        <LoadStateDisplay task={elem} hasSubtask={index < arr.length - 1}/>
                                    }/>
                                );
                            })
                        }
                    </TransitionGroup>
                }/>
            ]}/>
        );
    }
}

export const ShiganshinaLoaderV2: React.FC<ShiganshinaLoaderProps> = props => {
    const [state, setState] = useState<ShiganshinaLoaderState>({});

    useEffect(() => {
        setTimeout(() => {
            shiganshina().load({
                onStateChanged: state => {
                    setState({
                        state: state
                    });
                },
                onLoadComplete() {
                    props.onLoadComplete?.();
                }
            });
        }, 1e3);
    }, []);

    const taskTree: Array<LoadTaskStateInfo> = [state.state ?? {}];
    let curState = state.state ?? {};
    while (curState.subtask !== undefined) {
        taskTree.push(curState.subtask);
        curState = curState.subtask;
    }

    return (
        <div>
            <Box sx={{ mt: 1, width: "400px" }}>
                <List>
                    <TransitionGroup>
                        {
                            // <LoadStateDisplay task={elem} hasSubtask={index < arr.length - 1}/>
                            // <Box height={"100px"} width={"400px"} sx={{ backgroundColor: "red" }}/>
                            taskTree.map((elem, index, arr) => (
                                // <Zoom key={elem.id}>
                                //     <ListItem>
                                //         <LoadStateDisplay task={elem} hasSubtask={index < arr.length - 1}/>
                                //     </ListItem>
                                // </Zoom>
                                <Collapse in key={elem.id}>
                                    <ListItem>
                                        <LoadStateDisplay task={elem} hasSubtask={index < arr.length - 1}/>
                                    </ListItem>
                                </Collapse>
                            ))
                        }
                    </TransitionGroup>
                </List>
            </Box>
        </div>
    );
}
