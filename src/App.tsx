import { observer } from "mobx-react";
import React from 'react';
import MainStore from "./store/MainStore";
import { ObserverComp } from "./components/ObserverComp";
import { GraphicsPanel } from "./components/panel/GraphicsPanel";
import { useStores } from "@strategies/stores";

export type AppProps = {}

const App = () => {
    const store = useStores().main as MainStore;
    return (
        <div className="App">
            <ObserverComp colorizerStore={store.colorizerStore}/>
            {store.graphicsModel && <GraphicsPanel graphicsModel={store.graphicsModel}/>}
            {/*<ColorizerStage store={store} width={store.stageWidth} height={store.stageHeight}/>*/}
        </div>
    );
};

export default observer(App);
