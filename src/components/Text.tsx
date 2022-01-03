import React from "react";
import styled, {CSSProperties} from "styled-components";
import {getMeaningfulColors, MeaningfulColors, Themeable} from "../Themeable";
import {utilizeGlobalTheme} from "../logic/App";
import {createMargin, Margin, setMarginToCSSProperties} from "../logic/Margin";
import {getOr} from "../logic/Utils";
import {DimensionalMeasured} from "../logic/DimensionalMeasured";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";
import ReactMarkdown from 'react-markdown'
import {Link} from "./Link";
import {Align} from "../logic/Align";

export type TextProps = {
    text: string,
    type?: TextType,
    margin?: Margin,
    fontSize?: DimensionalMeasured,
    visualMeaning?: ObjectVisualMeaning,
    enableLeftAppendix?: boolean,
    leftAppendix?: JSX.Element,
    coloredIcon?: boolean,
    coloredText?: boolean,
    linkTooltip?: boolean,
    align?: Align,
    uppercase?: boolean,
    onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export enum TextType {
    smallHeader = "small-header",
    largeHeader = "large-header",
    defaultText = "default-text",
    secondaryDescription = "secondary-description",
    smallHeaderDeactivated = "small-header-deactivated",
}

const textTypeToThemeMapping: Map<TextType, (theme: Themeable.Theme) => CSSProperties> = new Map<TextType, (theme: Themeable.Theme) => CSSProperties>([
    [TextType.smallHeader, theme => theme.texts.complete.boldSmallHeader],
    [TextType.largeHeader, theme => theme.texts.complete.boldLargeHeader],
    [TextType.defaultText, theme => theme.texts.complete.defaultText],
    [TextType.secondaryDescription, theme => theme.texts.complete.secondaryDescription],
    [TextType.smallHeaderDeactivated, theme => theme.texts.complete.boldSmallHeaderDeactivated],
]);

export const Text: React.FC<TextProps> = props => {
    const theme: Themeable.Theme = utilizeGlobalTheme();
    const type: TextType = props.type === undefined ? TextType.defaultText : props.type;
    const margin: Margin = getOr(props.margin, createMargin(0, 0, 0, 0));
    let style: CSSProperties = textTypeToThemeMapping.get(type)?.(theme) as CSSProperties;
    style = setMarginToCSSProperties(margin, style);
    if (props.fontSize !== undefined) {
        style = {
            ...style,
            fontSize: props.fontSize.css()
        };
    }

    const meaningfulColors: MeaningfulColors = getMeaningfulColors(getOr(props.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT), theme);
    const Wrapper = styled.div`
      display: flex;
      align-items: center;
      gap: ${theme.paddings.defaultTextIconPadding.css()};
      
      color: ${props.coloredText ? meaningfulColors.lighter.css() : theme.colors.fontPrimaryColor.css()} !important;
      
      // min-width: 100%;
      
      svg path {
        fill: ${(props.coloredIcon ? meaningfulColors.iconColored : meaningfulColors.icon).css()};
      }
      
      p {
        margin-top: 0;
        margin-bottom: 0;
      }
      
      .md {
        // white-space: pre-wrap;
        text-align: ${getOr(props.align, Align.START)};
        // todo check if working
        text-transform: ${props.uppercase ? "uppercase" : "auto"};
      }
    `;

    return(
        <Wrapper style={style} onClick={event => getOr(props.onClick, () => {})(event)}>
            {props.enableLeftAppendix ? props.leftAppendix : <></>}
            <ReactMarkdown className={"md"} children={props.text} components={{
                a: (mdProps, context) => {
                    return (
                        <Link showLinkIcon={false} visualMeaning={props.visualMeaning} href={getOr<string>(mdProps.href, "")}>{mdProps.children}</Link>
                    );
                }
            }}/>
        </Wrapper>
    )
}
