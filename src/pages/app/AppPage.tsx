import React from "react";
import "../../styles/pages/AppPage.scss";
import "../../utils.scss";
import {BrowserRouter, Route, Redirect} from "react-router-dom";
import {DefaultSpecialPages} from "../../logic/DefaultSpecialPages";
import {BoardingPage} from "../boarding/BoardingPage";
import {LoginPage} from "../login/LoginPage";
import DashboardPage from "../dashboard/DashboardPage";
import MenuPage from "../menu/MenuPage";
import {App} from "../../logic/App";

export type AppPageProps = {
}

export type AppPageState = {
    showMenu: boolean
}

export class AppPage extends React.Component<AppPageProps, AppPageState> {

    private readonly specialPageRenderers: Map<string, () => JSX.Element> = new Map<string, () => JSX.Element>([
        [DefaultSpecialPages.BOARDING, () => <></>]
    ]);

    constructor(props: AppPageProps) {
        super(props);
        this.state = {
            showMenu: false
        };


        App.appOrCreate({
            connectorConfig: {
                protocol: "login",
                address: "wss:192.168.2.102:80",
                id: "login",
                maxConnectAttempts: 50,
                connectionRetryDelayFunc: (i => 0.1 * (i) ** 2 * 1e3 - 10 * 1e3),
                packetInterceptor: () => {}
            }
        });
    }

    public renderSpecialPage(id: string): JSX.Element | undefined {
        if (this.specialPageRenderers.has(id)) {
            return (this.specialPageRenderers.get(id) as () => JSX.Element)();
        } else return undefined;
    }

    render() {
        return (
            <div className={"app"}>
                <BrowserRouter>
                    <MenuPage showMenuInitially={true}>
                        <Route path={"/boarding"} render={() => <BoardingPage/>}/>
                        <Route path={"/login"} render={() => <LoginPage/>}/>
                        <Route path={"/dashboard"} render={() => <DashboardPage/>}/>
                        <Route path={"/"} render={() => <Redirect push to={"/dashboard"}/>}/>
                    </MenuPage>
                </BrowserRouter>
            </div>
        );
    }
}
