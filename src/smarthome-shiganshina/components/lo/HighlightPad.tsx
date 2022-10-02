import {cc} from "../../../smarthome-carbon-core/api/ICarbonAPI";
import {CP} from "../../../smarthome-carbon-core/api/CarbonProps";
import styled from "styled-components";
import {DimensionalMeasured} from "../../../logic/style/DimensionalMeasured";
import {Color} from "../../../logic/style/Color";
import {getMeaningfulColors} from "../../../logic/style/Themeable";
import {VM} from "../../../logic/style/ObjectVisualMeaning";
import {utilizeGlobalTheme} from "../../../logic/app/App";
import {v4} from "uuid";

export type HighlightPadProps = CP<{}, {
    width: DimensionalMeasured,
    height: DimensionalMeasured,
    bleedingAnimation: boolean,
    color: Color
}>

export class HighlightPad extends cc<HighlightPadProps, unknown, {}>((i, p) => {
    const color: Color = p.color ?? getMeaningfulColors(VM.UI_NO_HIGHLIGHT, utilizeGlobalTheme()).main;
    const id = v4();

    const Pad = styled.div`
      border-radius: 9999px;
      background-color: ${color.css()};
      width: ${p.width?.css() ?? "auto"};
      height: ${p.height?.css() ?? "auto"};
      display: grid;
      place-content: center;
      ${ p.bleedingAnimation ?? false ? `animation: 1.5s infinite bleeding-${id};` : '' }
      
      * {
        user-select: none;
      }      
          
      @keyframes bleeding-${id} {
        0%, 100% {
          box-shadow: 0 0 0 0 ${color.withAlpha(.5).css()};
        }

        50% {
          box-shadow: 0 0 0 4px ${color.withAlpha(.5).css()};
        }
      }
    `;

    return (
        <Pad children={p.children}/>
    );
}) {}
