import {cc} from "../../../smarthome-carbon-core/api/ICarbonAPI";
import {CP} from "../../../smarthome-carbon-core/api/CarbonProps";
import {LoadTaskStateInfo} from "../../api/LoadTaskStateInfo";
import {Flex, FlexRow} from "../../../components/lo/FlexBox";
import {px} from "../../../logic/style/DimensionalMeasured";
import {Text, TextType} from "../../../components/lo/Text";
import {If} from "../../../components/logic/If";
import {AF} from "../../../components/logic/ArrayFragment";
import {Dot} from "../../../components/lo/Dot";
import {Align} from "../../../logic/style/Align";
import {Justify} from "../../../logic/style/Justify";
import {HighlightPad} from "../lo/HighlightPad";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as PlayIcon} from "../../../assets/icons/ic-20/ic20-play.svg";
import {Color} from "../../../logic/style/Color";
import styled from "styled-components";
import {utilizeGlobalTheme} from "../../../logic/app/App";
import {createMargin} from "../../../logic/style/Margin";
import {Progressbar} from "../lo/Progressbar";
import {LoadState} from "../../api/LoadState";
import {HourglassFullRounded, PlayArrowRounded, PunchClock} from "@mui/icons-material";
import moment, {duration} from "moment";
import {Ticker} from "../../../smarthome-carbon-core/components/Ticker";

export type LoadStateDisplayProps = CP<{
    task: LoadTaskStateInfo,
}, {
    hasSubtask: boolean
}>

export class LoadStateDisplay extends cc<LoadStateDisplayProps, unknown, {}>((i, p) => {
    const theme = utilizeGlobalTheme();

    const Container = styled.div`
      width: 100%;
      display: grid;
      grid-template-columns: 38px auto;
      column-gap: ${theme.gaps.defaultGab.css()};
      row-gap: 0;
    `;

    return (
        <Container>
            { i.a("icon") }

            <FlexRow fw align={Align.CENTER} gap={px(10)} elements={[
                <Text
                    bold
                    fontSize={px(20)}
                    type={TextType.displayText}
                    text={p.task.title ?? "Task"}
                />,
                <If condition={p.task.numIndicator !== undefined} ifTrue={
                    <AF elements={[
                        <Dot/>,
                        <Text
                            fontSize={px(14)}
                            type={TextType.displayDescription}
                            text={`${p.task.numIndicator?.value}/${p.task.numIndicator?.max}`}
                        />
                    ]}/>
                }/>,

                i.a("time"),

            ]}/>

            <If condition={p.hasSubtask} ifTrue={
                <Flex fh fw justifyContent={Justify.CENTER} align={Align.CENTER} elements={[
                    <span style={{
                        width: "2px",
                        height: "100%",
                        backgroundColor: "rgba(255, 255, 255, .5)",
                        borderRadius: 2,
                        margin: "10px 0"
                    }}/>
                ]}/>
            } ifFalse={
                <span style={{ width: "38px", height: "1px", backgroundColor: "transparent" }}/>
            }/>

            <Flex margin={p.hasSubtask ? createMargin(0, 0, 20, 0) : undefined} elements={[
                <Text
                    texts={p.task.description}
                    text={""}
                    type={TextType.displayDescription}
                    fontSize={px(16)}
                    color={Color.ofHex("#ababab")}
                />,

                <If condition={p.task.loadPercentage !== undefined} ifTrue={
                    <Progressbar value={p.task.loadPercentage as number}/>
                }/>
            ]}/>
        </Container>
    );
}) {

    init() {
        super.init();
        this.timeAssembly();
        this.iconAssembly();
    }

    private timeAssembly() {
        this.assembly.assembly("time", theme => {
            const terminated = this.props.task.terminated ?? false;
            const interval = terminated ? 30e3 : 1e3;
            const text = terminated ? (
                `Finished ${moment.unix(this.props.task.startUnixTime as number).fromNow()}`
            ) : (
                `${ duration(moment().diff(moment.unix(this.props.task.startUnixTime as number)), "milliseconds").seconds()} sec elapsed`
            )

            return (
                <Ticker interval={interval} renderer={() => (
                    <If condition={this.props.task.startUnixTime !== undefined} ifTrue={
                        <AF elements={[
                            <Dot/>,
                            <Text
                                fontSize={px(14)}
                                type={TextType.displayDescription}
                                text={text}
                            />
                        ]}/>
                    }/>
                )}/>
            );
        });
    }

    private iconAssembly() {
        this.assembly.assembly("icon", theme => {
            interface Options {
                [key: string]: () => JSX.Element;
            }
            const options: Options = {
                [LoadState.RUNNING]: () => (
                    // Color.ofHex("#10C84F")
                    <HighlightPad width={px(38)} height={px(38)} color={Color.ofHex("#10C84F")} children={
                        <Icon icon={<PlayIcon/>} size={px(20)}/>
                    }/>
                ),
                [LoadState.WAITING]: () => (
                    <HighlightPad width={px(38)} bleedingAnimation height={px(38)} color={Color.ofHex("#ffbd29")} children={
                        <Icon icon={<HourglassFullRounded/>} size={px(20)}/>
                    }/>
                )
            }
            const key: string = this.props.task.state ?? LoadState.RUNNING;
            return options[key]?.() ?? <></>
        });
    }
}
