import {BernieComponent} from "../../../logic/BernieComponent";
import {UnitTestUtils} from "../UnitTestUtils";
import {Assembly} from "../../../logic/assembly/Assembly";
import {Themeable} from "../../../logic/style/Themeable";
import {LiteGrid} from "../../../components/lo/LiteGrid";
import {AF} from "../../../components/logic/ArrayFragment";
import {Button} from "../../../components/lo/Button";
import {percent, px} from "../../../logic/style/DimensionalMeasured";
import {StaticDrawerMenu} from "../../../components/lo/StaticDrawerMenu";
import {If} from "../../../components/logic/If";
import {Text, TextType} from "../../../components/lo/Text";
import {Cursor} from "../../../logic/style/Cursor";

import clickSound from "../../../assets/sound/click.mp3";
import {DrawerHeader} from "../../../components/lo/DrawerHeader";
import {ObjectVisualMeaning, VM} from "../../../logic/style/ObjectVisualMeaning";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {Align} from "../../../logic/style/Align";
import {Box} from "../../../components/lo/Box";
import {createMargin} from "../../../logic/style/Margin";
import styled from "styled-components";
import {Icon} from "../../../components/lo/Icon";

import {ReactComponent as DeleteIcon} from "../../../assets/icons/ic-16/ic16-chevron-left.svg";
import {logAndReturn} from "../../../logic/Utils";


export class NumPadTest extends BernieComponent<any, any, any> {

    public static test = UnitTestUtils.createTestConfig({
        name: "numpad-test",
        displayName: "Numpad test",
        element: NumPadTest,
        factory: Elem => <Elem/>
    });

    private openNumpadDialog() {
        this.dialog(
            <StaticDrawerMenu width={percent(30)} body={props => (
                <AF elements={[
                    <DrawerHeader
                        header={"Enter PIN"}
                        badgeText={"Security"}
                        badgeVM={VM.UI_NO_HIGHLIGHT}
                        enableBadge
                        description={"Unlock the project by typing in your **6-digit** PIN. You are required to enter a PIN because of additional security precautions."}
                    />,

                    <Numpad
                        length={6}
                        validator={value => Number(value.join("")) === 230121}
                        onValidationSuccess={() => {
                            setTimeout(() => {
                                this.closeLocalDialog();
                            }, 100);
                        }}
                    />
                ]}/>
            )}/>
        );
    }

    componentDidMount() {
        super.componentDidMount();
        this.openNumpadDialog();
    }

    componentRender(p: any, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Button text={"Open numpad validation"} onClick={() => this.openNumpadDialog()}/>
        );
    }
}

export type NumpadProps = {
    length: number,
    validator: (value: Array<number>) => boolean,
    onValidationSuccess: () => void
}

export type NumpadLocalState = {
    value: Array<number>,
    validState: NumpadValidationState
}

export enum NumpadValidationState {
    NEUTRAL,
    VALID,
    INVALID
}

export class Numpad extends BernieComponent<NumpadProps, any, NumpadLocalState> {

    private clickAudio = new Audio(clickSound);

    constructor(props: NumpadProps) {
        super(props, undefined, {
            value: [],
            validState: NumpadValidationState.NEUTRAL
        });
    }

    private triggerValidation() {
        if (this.local.state.value.length === this.props.length) {
            // Pre-Validation completed, can execute Main-Validation
            const valid = this.props.validator(this.local.state.value);

            if (valid) {

                this.local.setStateWithChannels({
                    validState: NumpadValidationState.VALID
                }, ["pin-display"], () => {
                    this.props.onValidationSuccess();
                });
            } else {

                this.local.setStateWithChannels({
                    validState: NumpadValidationState.INVALID
                }, ["pin-display"], () => {
                    setTimeout(() => {
                        this.local.setStateWithChannels({
                            validState: NumpadValidationState.NEUTRAL,
                            value: []
                        }, ["pin-display"])
                    }, 1000);
                });
            }
        }




        this.rerender("pin-display");
    }

    componentRender(p: NumpadProps, s: any, l: NumpadLocalState, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex fw align={Align.CENTER} elements={[
                this.component(local => {

                    switch (local.state.validState) {
                        case NumpadValidationState.INVALID:
                            const ErrorWrapper = styled.span`
                              .incorrect {
                                animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
                                transform: translate3d(0, 0, 0);
                                backface-visibility: hidden;
                                perspective: 1000px;
                              }
        
                              @keyframes shake {
                                10%, 90% {
                                  transform: translate3d(-1px, 0, 0);
                                }
        
                                20%, 80% {
                                  transform: translate3d(2px, 0, 0);
                                }
        
                                30%, 50%, 70% {
                                  transform: translate3d(-4px, 0, 0);
                                }
        
                                40%, 60% {
                                  transform: translate3d(4px, 0, 0);
                                }
                              }
                            `;

                            return (
                                <ErrorWrapper children={
                                    <FlexRow classnames={["incorrect"]} margin={createMargin(40, 0, 40, 0)} gap={t.gaps.defaultGab} elements={
                                        Array.from(Array(p.length).keys()).map((_, i) => (
                                            <If condition={local.state.value[i] === undefined} ifTrue={
                                                <Box noPadding width={px(14)} height={px(14)} borderRadiiConfig={{
                                                    enableCustomBorderRadii: true,
                                                    fallbackCustomBorderRadii: px(500)
                                                }}/>
                                            } ifFalse={
                                                <Box noPadding width={px(14)} opaque visualMeaning={VM.ERROR} height={px(14)} borderRadiiConfig={{
                                                    enableCustomBorderRadii: true,
                                                    fallbackCustomBorderRadii: px(500)
                                                }}/>
                                            }/>
                                        ))
                                    }/>
                                }/>
                            );
                        case NumpadValidationState.NEUTRAL:
                            return (
                                <FlexRow margin={createMargin(40, 0, 40, 0)} gap={t.gaps.defaultGab} elements={
                                    Array.from(Array(p.length).keys()).map((_, i) => (
                                        <If condition={local.state.value[i] === undefined} ifTrue={
                                            <Box noPadding width={px(14)} height={px(14)} borderRadiiConfig={{
                                                enableCustomBorderRadii: true,
                                                fallbackCustomBorderRadii: px(500)
                                            }}/>
                                        } ifFalse={
                                            <Box noPadding width={px(14)} opaque visualMeaning={VM.WARNING} height={px(14)} borderRadiiConfig={{
                                                enableCustomBorderRadii: true,
                                                fallbackCustomBorderRadii: px(500)
                                            }}/>
                                        }/>
                                    ))
                                }/>
                            );
                        case NumpadValidationState.VALID:
                            return (
                                <FlexRow margin={createMargin(40, 0, 40, 0)} gap={t.gaps.defaultGab} elements={
                                    Array.from(Array(p.length).keys()).map((_, i) => (
                                        <If condition={local.state.value[i] === undefined} ifTrue={
                                            <Box noPadding width={px(14)} height={px(14)} borderRadiiConfig={{
                                                enableCustomBorderRadii: true,
                                                fallbackCustomBorderRadii: px(500)
                                            }}/>
                                        } ifFalse={
                                            <Box noPadding width={px(14)} opaque visualMeaning={VM.SUCCESS_DEFAULT} height={px(14)} borderRadiiConfig={{
                                                enableCustomBorderRadii: true,
                                                fallbackCustomBorderRadii: px(500)
                                            }}/>
                                        }/>
                                    ))
                                }/>
                            );
                    }


                }, "pin-display"),

                <LiteGrid columns={3} gap={t.gaps.smallGab} children={
                    <AF elements={
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, "fn1", 0, "fn2"].map(i => {
                            if (i === "fn2") {
                                // Delete button
                                return this.component(local => {
                                    const nonEmpty = local.state.value.length > 0;

                                    return (
                                        <Button
                                            border={false}
                                            vibrationPattern={[10]}
                                            vibrateOnClick={nonEmpty}
                                            highlight={false}
                                            cursor={nonEmpty ? Cursor.pointer : Cursor.notAllowed}
                                            height={px(60)}
                                            width={percent(100)}
                                            onClick={() => {
                                                if (nonEmpty && local.state.validState !== NumpadValidationState.VALID) {
                                                    this.local.state.value.pop();
                                                    this.rerender("pin-display");
                                                }
                                            }}
                                            children={
                                                <Icon
                                                    icon={<DeleteIcon/>}
                                                    visualMeaning={VM.UI_NO_HIGHLIGHT}
                                                    size={px(16)}
                                                    colored={!nonEmpty}
                                                />
                                            }
                                        />
                                    );
                                }, "pin-display");
                            } else if (i === "fn1") {
                                return (
                                    <span/>
                                );
                            }

                            return (
                                <If condition={i !== null} ifTrue={
                                    <Button highlight vibrationPattern={[10]} vibrateOnClick cursor={Cursor.pointer} shrinkOnClick height={px(60)} width={percent(100)} children={
                                        <Text text={String(i)} bold type={TextType.displayText}/>
                                    } onClick={() => {
                                        this.clickAudio.play().then(() => this.clickAudio = new Audio(clickSound));

                                        this.local.state.value.push(Number(i));
                                        this.rerender("pin-display");

                                        this.triggerValidation();
                                    }}/>
                                } ifFalse={
                                    <span/>
                                }/>
                            );
                        })
                    }/>
                }/>
            ]}/>
        );
    }
}
