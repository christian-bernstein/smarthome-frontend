import {cc} from "../../../smarthome-carbon-core/api/ICarbonAPI";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as ShiganshinaLogoWithText} from "../../assets/logo-with-text.svg";
import {DimensionalMeasured} from "../../../logic/style/DimensionalMeasured";
import {Dimension} from "../../../logic/style/Dimension";
import {CP} from "../../../smarthome-carbon-core/api/CarbonProps";

export type ShiganshinaLogoProps = CP<unknown, {
    variant: "logo-with-text",
    raw: boolean
}>

export class ShiganshinaLogo extends cc<ShiganshinaLogoProps, unknown, {}>((i, p) => {
    const raw = p.raw ?? true;
    switch (p.variant ?? "logo-with-text") {
        case "logo-with-text":
            if (raw) {
                return (
                    <ShiganshinaLogoWithText width={"50vw"} height={"20vh"}/>
                );
            } else {
                return (
                    <Icon
                        size={DimensionalMeasured.of(50, Dimension.vw)}
                        icon={<ShiganshinaLogoWithText/>}
                    />
                );
            }
    }
}) {}
