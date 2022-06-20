import { observer } from "mobx-react";
import React, { useRef } from "react";
import ColorizerStack from "../components/ColorizerStack";
import ColorizerStore from "../store/ColorizerStore";
import { useStores } from "@strategies/stores";
import MainStore from "../store/MainStore";
import { ColorizerMetadata } from "@strategies/react-colorizer";

type ObserverCompProps = {
    colorizerStore: ColorizerStore;
};

type CropTestButtonsProps = {
    metadata: ColorizerMetadata;
};
export const CropTestButtons = observer(({ metadata }: CropTestButtonsProps) => {
    const store = useStores().main as MainStore;

    return <div className={'top-buttons'}>
        <button className={'top-button'} onClick={() => {
            const tx = 0;
            const ty = 0;
            const tw = 31;
            const th = 21;
            store.setCrop({
                x: tx * metadata.tileSize,
                y: ty * metadata.tileSize,
                width: tw * metadata.tileSize,
                height: th * metadata.tileSize,
            })
        }}>CROP
        </button>
        <button className={'top-button'} onClick={() => {
            store.setCrop(null)
        }}>UN-CROP
        </button>
    </div>
});

export const ObserverComp = observer(({ colorizerStore }: ObserverCompProps) => {
    if (!colorizerStore) return null;
    const { metadata } = colorizerStore;
    if (!metadata) return null;

    return <div className={'ObserverComp'}>
        {/*<CropTestButtons metadata={metadata}/>*/}
        <ColorizerStack layers={colorizerStore.colorizerLayers}/>
    </div>
});
