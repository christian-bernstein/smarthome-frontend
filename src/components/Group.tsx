import {BernieComponent} from "../logic/BernieComponent";
import {Box} from "./Box";
import {Themeable} from "../Themeable";
import {Assembly} from "../logic/Assembly";
import {FlexBox} from "./FlexBox";
import {Orientation} from "../logic/style/Orientation";
import {getOr} from "../logic/Utils";
import {FlexDirection} from "../logic/style/FlexDirection";
import {Separator} from "./Separator";
import React from "react";
import styled from "styled-components";
import {DimensionalMeasured, percent, px} from "../logic/style/DimensionalMeasured";
import {OverflowBehaviour} from "../logic/style/OverflowBehaviour";
import * as ReactIs from 'react-is';
import {WithVisualMeaning} from "../logic/WithVisualMeaning";
import {ObjectVisualMeaning} from "../logic/ObjectVisualMeaning";

export type GroupProps = WithVisualMeaning & {
    elements: (JSX.Element | undefined)[],
    orientation?: Orientation,
    removeChildBorders?: boolean,
    enableSeparators?: boolean,
    height?: DimensionalMeasured,
    width?: DimensionalMeasured,
    type?: 'div' | 'form',
    opaque?: boolean
}

export class Group extends BernieComponent<GroupProps, any, any> {

    componentRender(p: GroupProps, s: any, l: any, t: Themeable.Theme, a: Assembly): JSX.Element | undefined {
        const orientation = getOr(p.orientation, Orientation.HORIZONTAL);
        const removeChildBorders = getOr(p.removeChildBorders, true);
        const enableSeparators = getOr(p.enableSeparators, true);
        const type = getOr(p.type, "div");
        const vm = getOr(p.visualMeaning, ObjectVisualMeaning.UI_NO_HIGHLIGHT);

        const Wrapper = styled.span`
          width: ${getOr(this.props.width?.css(), "auto")};;
          height: ${getOr(this.props.height?.css(), "auto")};
          
          & > * > * > * {
            border: none !important;
            border-radius: 0 !important;
          }
        `;

        return (
            <Wrapper>
                <Box opaque={p.opaque} visualMeaning={vm} noPadding width={percent(100)} height={percent(100)} gapY={px(0)} gapX={px(0)} overflowXBehaviour={OverflowBehaviour.HIDDEN} overflowYBehaviour={OverflowBehaviour.HIDDEN}>
                    <FlexBox type={type} height={percent(100)} flexDir={orientation === Orientation.HORIZONTAL ? FlexDirection.ROW : FlexDirection.COLUMN} width={percent(100)} gap={px(0)} children={
                        this.props.elements.filter(e => e !== undefined).filter(e => !ReactIs.isFragment(e)).map((e, index, array) => {
                            if (index === array.length - 1) {
                                return e;
                            } else {
                                return (
                                    <>
                                        {e}
                                        {enableSeparators ? (
                                            <Separator

                                                visualMeaning={vm}
                                                orientation={orientation === Orientation.VERTICAL ? Orientation.HORIZONTAL : Orientation.VERTICAL}
                                            />
                                        ) : <></>}
                                    </>
                                );
                            }
                        })
                    }/>
                </Box>
            </Wrapper>
        );
    }
}
