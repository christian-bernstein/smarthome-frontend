import {BC} from "../../../logic/BernieComponent";
import {CP} from "../../../smarthome-carbon-core/api/CarbonProps";
import {Themeable} from "../../../logic/style/Themeable";
import {Assembly} from "../../../logic/assembly/Assembly";
import {LinearProgress, linearProgressClasses, styled} from "@mui/material";
import {Flex} from "../../../components/lo/FlexBox";
import {Text, TextType} from "../../../components/lo/Text";
import {Justify} from "../../../logic/style/Justify";
import {Color} from "../../../logic/style/Color";
import {px} from "../../../logic/style/DimensionalMeasured";

export type ProgressbarProps = CP<{
    value: number
}>

export class Progressbar extends BC<ProgressbarProps, any, any> {

    componentRender(p: ProgressbarProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const ShiganshinaProgressbar = styled(LinearProgress)(({ theme }) => ({
            height: 28,
            borderRadius: 90,
            width: "100%",
            [`&.${linearProgressClasses.colorPrimary}`]: {
                backgroundColor: "#121212",
            },
            [`& .${linearProgressClasses.bar}`]: {
                background: "linear-gradient(270deg, #9AECA4 0%, rgba(255, 243, 135, 0) 100%)"
            }
        }));

        return (
            <Flex style={{ position: "relative" }} fw elements={[
                <ShiganshinaProgressbar
                    variant={"determinate"}
                    value={p.value}
                />,
                <Flex style={{ position: "absolute", paddingLeft: "13px" }} fh fw justifyContent={Justify.CENTER} elements={[
                    <Text
                        text={`${p.value}%`}
                        coloredText
                        bold
                        type={TextType.secondaryDescription}
                        color={Color.ofHex("#000000")}
                        fontSize={px(14)}
                    />
                ]}/>
            ]}/>
        );
    }
}
