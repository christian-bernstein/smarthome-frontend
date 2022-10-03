import {cc} from "../../../smarthome-carbon-core/api/ICarbonAPI";
import {CP} from "../../../smarthome-carbon-core/api/CarbonProps";
import {LoadTaskStateInfo} from "../../api/initialization/LoadTaskStateInfo";
import {Flex} from "../../../components/lo/FlexBox";
import {LoadStateDisplay} from "./LoadStateDisplay";
import {px} from "../../../logic/style/DimensionalMeasured";

export type LoadStateGroupDisplayProps = CP<{
    tasks: Array<LoadTaskStateInfo>
}>

export class LoadStateGroupDisplay extends cc<LoadStateGroupDisplayProps, unknown, {}>((i, p) => {
    return (
        <Flex width={px(400)} gap={px()} elements={p.tasks.map((task, index, array) => (
            <LoadStateDisplay task={task} hasSubtask={index < array.length - 1}/>
        ))}/>
    );
}) {}
