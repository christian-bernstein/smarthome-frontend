import {BernieComponent} from "../logic/BernieComponent";
import {Text, TextType} from "../components/lo/Text";
import {Assembly} from "../logic/assembly/Assembly";
import {Themeable} from "../logic/style/Themeable";
import {Screen} from "../components/lo/Page";
import {Centered} from "../components/lo/PosInCenter";
import {CarbonAPI} from "../smarthome-carbon-core/api/CarbonAPI";
import {carbon, ICarbonAPI} from "../smarthome-carbon-core/api/ICarbonAPI";
import {ShiganshinaLogo} from "./components/lo/ShiganshinaLogo";
import {AF} from "../components/logic/ArrayFragment";
import {Color} from "../logic/style/Color";
import {Flex} from "../components/lo/FlexBox";
import {Align} from "../logic/style/Align";
import {Justify} from "../logic/style/Justify";
import {percent, px} from "../logic/style/DimensionalMeasured";
import {Ticker} from "../smarthome-carbon-core/components/Ticker";
import {array} from "../logic/Utils";
import {LoadStateGroupDisplay} from "./components/ho/LoadStateGroupDisplay";
import {Template} from "../smarthome-carbon-core/components/Template";
import {Image} from "../components/lo/Image";

export class ShiganshinaLauncher extends BernieComponent<any, any, any> {

    componentDidMount() {
        super.componentDidMount();

        // Todo move this to an API -> ShiganshinaAPI
        carbon({
            create(): ICarbonAPI {
                return new CarbonAPI();
            }
        })

        setTimeout(() => {
            this.dialog(
                <span onClick={() => this.closeLocalDialog()} children={
                    <Screen deactivatePadding style={{ backgroundColor: "black", position: "relative" }} children={
                        <AF elements={[

                            // Main logo
                            <Centered fullHeight children={
                                <ShiganshinaLogo/>
                            }/>,

                            // General UI (Loading animation, loading state description)
                            <Flex style={{ position: "absolute", bottom: "calc(100vh / 4)" }} fw gap={px()} align={Align.CENTER} justifyContent={Justify.CENTER} elements={[
                                <LoadStateGroupDisplay tasks={[
                                    {
                                        title: "Loading",
                                        description: ["Loading web application. Configuring state & do other tasks"],
                                        loadPercentage: 50,
                                        numIndicator: {
                                            value: 4,
                                            max: 8
                                        }
                                    },
                                    {
                                        title: "Downloading settings",
                                        description: ["Downloading settings from settings server"],
                                        loadPercentage: 35,
                                        numIndicator: {
                                            value: 189,
                                            max: 201
                                        }
                                    }
                                ]}/>
                            ]}/>
                        ]}/>
                    }/>
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
