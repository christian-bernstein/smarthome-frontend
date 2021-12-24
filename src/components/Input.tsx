import "../styles/components/Input.scss";
import React, {ChangeEvent} from "react";
import {v4} from "uuid";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {getOr} from "../logic/Utils";
import styled from "styled-components";
import {Color} from "../Color";

export type InputProps = {
    id?: string,
    defaultValue?: string,
    label: string,
    visualMeaning?: ObjectVisualMeaning,
    opaque?: boolean,
    opaqueValue?: number,
    onChange?: (ev: ChangeEvent<HTMLInputElement>) => void,
    value?: string
    autoFocus?: boolean
}

export type InputState = {
    id: string,
    value: string
}

export class Input extends React.Component<InputProps, InputState> {

    private ref: React.RefObject<React.LegacyRef<HTMLInputElement> | undefined> = React.createRef<React.LegacyRef<HTMLInputElement> | undefined>();

    constructor(props: InputProps) {
        super(props);
        this.state = {
            id: getOr(props.id, v4()),
            value: ""
        };
    }

    private onInputChange(ev: ChangeEvent<HTMLInputElement>) {
        this.props.onChange?.(ev);
    }

    shouldComponentUpdate(nextProps: Readonly<InputProps>, nextState: Readonly<InputState>, nextContext: any): boolean {
        return false;
    }

    render() {
        const theme: Themeable.Theme = utilizeGlobalTheme();
        const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(this.props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
        const bgColor: Color = this.props.opaque ? meaningfulColors.main.withAlpha(getOr(this.props.opaqueValue, .1)): meaningfulColors.main;

        const Wrapper = styled.div`
          width: 100%;
          min-height: 3.5rem;
          position: relative;
          background-color: ${theme.colors.backgroundHighlightColor.css()};
          
          border-radius: ${theme.radii.defaultObjectRadius.css()};
          padding: ${theme.paddings.defaultObjectPadding.css()};
          border: 1px solid ${meaningfulColors.lighter.css()};
          
          &:hover {
            filter: brightness(${theme.hovers.hoverLightFilter.css()});
            // border: 1px solid ${meaningfulColors.lighter.css()} !important;
            // box-shadow: 0 0 0 4px ${theme.colors.borderPrimaryShadowColor.css()};
          }
          
          input {
            background-color: ${bgColor.css()};
            border: none;
            color: ${theme.colors.fontPrimaryColor.css()};
            font-family: "${theme.texts.fontFamily}", "Consolas", monospace !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            outline: none;
            box-sizing: border-box;
            padding: ${theme.paddings.defaultObjectPadding.css()};
            border-radius: ${theme.radii.defaultObjectRadius.withPlus(-2).css()};
            z-index: 1;
            
            &:focus {
              box-shadow: 0 0 0 4px ${meaningfulColors.shadowColor.css()};
            }
          }

          label {
            font-size: 14px;
            position: absolute;
            left: ${theme.paddings.defaultObjectPadding.css()};
            top: 1.25rem;
            // padding: 0 .25rem;
            color: white;
            transition: all .3s;
          }

          input:focus + label, input:not(:placeholder-shown) + label {
            top: +.15rem;
            left: ${theme.paddings.defaultObjectPadding.css()};
            color: ${theme.colors.fontSecondaryColor.css()};
            font-size: 12.5px;
            letter-spacing: 0.02rem;
            font-weight: 100;
            z-index: 10;
          }
        `;


        return (
            <Wrapper className={"input-container"} key={this.state.id}>
                <input key={this.state.id}
                       autoFocus={getOr(this.props.autoFocus, false)}
                       spellCheck={false}
                       ref={() => this.ref}
                       onChange={event => this.onInputChange(event)}
                       placeholder={" "}
                       value={this.props.value}
                />
                <label htmlFor={this.state.id}>{this.props.label}</label>
            </Wrapper>
        );
    }
}
