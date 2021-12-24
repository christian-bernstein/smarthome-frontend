import React, {useMemo, useState} from "react";
import {Input} from "../../components/Input";
import {ObjectVisualMeaning} from "../../logic/ObjectVisualMeaning";
import {AppConfigSelectionData, AppConfigSelector} from "../../debug/components/AppConfigSelector";
import {v4} from "uuid";
import {Themeable} from "../../Themeable";
import {arrayFactory} from "../../logic/Utils";
import _ from "lodash";

function getConfigs(fil: string): AppConfigSelectionData[] {
    return arrayFactory<AppConfigSelectionData>(i => {
        return {
            title: String(i),
            description: "",
            config: {
                appTitle: "",
                debugMode: false,
                defaultAppRoute: "",
                rootRerenderHook: () => {},
                themes: new Map<string, Themeable.Theme>(),
                defaultTheme: "",
                defaultDebugAppRoute: "",
                connectorConfig: {
                    protocol: "",
                    id: "",
                    packetInterceptor: () => {},
                    maxConnectAttempts: 0,
                    address: "",
                    connectionRetryDelayFunc: () => 1,
                    onConnectionFailed: () => {}
                }
            }
        };
    }, 10).filter(config => config.title.match(fil));
}

export const SearchPage: React.FC = () => {
    const [filter, setFilter] = useState<string | undefined>(undefined);

    const debouncedOnChange = useMemo(() => _.debounce((setFilter: React.Dispatch<React.SetStateAction<string | undefined>>, filter?: string) => {
        setFilter(filter);
    }, 300), []);

    return (
        <div>
            <Input
                visualMeaning={ObjectVisualMeaning.INFO}
                opaque
                label={"Filter"}
                onChange={event => debouncedOnChange(setFilter, event.target.value ? event.target.value.toLocaleLowerCase() : undefined)}
            />
            <div>
                {getConfigs(filter || ".").map(config => {
                    return (
                        <AppConfigSelector
                            key={v4()}
                            data={config}
                            onSelection={() => {}}
                        />
                    )
                })}
            </div>
        </div>
    );
}
