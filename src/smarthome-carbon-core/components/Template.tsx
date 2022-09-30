import {BC} from "../../logic/BernieComponent";
import {Themeable} from "../../logic/style/Themeable";
import {Assembly} from "../../logic/assembly/Assembly";
import {DimensionalMeasured} from "../../logic/style/DimensionalMeasured";
import {Flex} from "../../components/lo/FlexBox";
import {Color} from "../../logic/style/Color";
import {CP} from "../api/CarbonProps";
import DefaultTemplate from "../../smarthome-shiganshina/assets/overlay/overlay.svg";

export type TemplateProps = CP<{
    width: DimensionalMeasured,
    height: DimensionalMeasured,
}, {
    overlay: JSX.Element,
    overlayPXOffsetX: number,
    overlayPXOffsetY: number,
}>

export class Template extends BC<TemplateProps, any, any> {

    componentRender(p: TemplateProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        return (
            <Flex width={p.width} height={p.height} style={{ border: `1px solid ${Color.ofHex("#FF0000").css()}`, boxSizing: "content-box", position: "relative" }} elements={[
                <Flex width={p.width} height={p.height} style={{ position: "absolute", top: 0, left: 0, zIndex: 5000 }} children={
                    p.children
                }/>,
                <Flex width={p.width} height={p.height} style={{ position: "absolute", top: p.overlayPXOffsetY ?? 0, left: p.overlayPXOffsetX ?? 0, filter: "sepia(100%) hue-rotate(-90deg) saturate(400%)" }} children={
                    p.overlay ?? <img width={p.width.css()} src={DefaultTemplate} alt={"template"}/>
                }/>
            ]}/>
        );
    }
}
