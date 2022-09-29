import {PropsWithChildren} from "react";

export type CarbonProps<
    Required = unknown, Optional = unknown
> = Required & Partial<Optional> & PropsWithChildren<{

}>

export type {
    CarbonProps as CP
}
