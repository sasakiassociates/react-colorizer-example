import { observer } from "mobx-react";
import { ChildComp } from "./ChildComp";
import React, { useRef } from "react";
import ColorizerStore from "../store/ColorizerStore";
import { IColorizerLayer } from "@strategies/react-colorizer";
import ColorizerStack from "../components/ColorizerStack";

type ObserverCompProps = {};

export const ObserverComp = observer(({}: ObserverCompProps) => {
    const changer = useRef<ColorizerStore>(new ColorizerStore());
    if (!changer.current) return null;

    const keyz:string[] = [];
    changer.current.levelsLayer.colorizerStates.forEach((value, key, map) => {
        keyz.push(key + ':' + value.fillColor);
    })

    return <div className={'ObserverComp'}>
        {/*<div>{changer.current.levelsLayer.counter}</div>*/}
        <button onClick={() => changer.current.changeSomething()}>CHANGE</button>
        <div> counter : {changer.current.levelsLayer.counter}</div>
        <div> keys : {keyz.join(';')}</div>
        {changer.current.colorizerLayers.map((layer) => {
                const colorizerLayer = layer as IColorizerLayer;
                if (colorizerLayer && colorizerLayer.colorizerStates) {
                    return <ChildComp key={layer.key} width={500} height={500}
                                      colorizerStates={colorizerLayer.colorizerStates}
                    />
                } else {
                    return <div>IMAGE</div>;
                }
            }
        )}
        <ColorizerStack layers={changer.current.colorizerLayers}/>
    </div>
});
