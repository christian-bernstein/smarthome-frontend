import {cc} from "../../../smarthome-carbon-core/api/ICarbonAPI";
import {Icon} from "../../../components/lo/Icon";
import {ReactComponent as ShiganshinaLogoWithText} from "../../assets/logo-with-text.svg";
import {DimensionalMeasured} from "../../../logic/style/DimensionalMeasured";
import {Dimension} from "../../../logic/style/Dimension";
import {CP} from "../../../smarthome-carbon-core/api/CarbonProps";

export type ShiganshinaLogoProps = CP<unknown, {
    variant: "logo-with-text"
}>

export class ShiganshinaLogo extends cc<ShiganshinaLogoProps, unknown, {}>((i, p) => {
    switch (p.variant ?? "logo-with-text") {
        case "logo-with-text": return (
            <Icon
                size={DimensionalMeasured.of(50, Dimension.vw)}
                icon={<ShiganshinaLogoWithText/>}
            />
        );
    }
}) {}
