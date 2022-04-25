import React from 'react';
import { observer } from "mobx-react";
import { IImageLayer } from "@strategies/react-colorizer";

type ImageLayerProps = {
    layer: IImageLayer;
};
export const ImageLayer = observer(({ layer }: ImageLayerProps) => {
    return <div className={'stack'}>
        {layer.element}
    </div>;
});

type ColorizerStackProps = { layers: IImageLayer[] };
export default observer(function ColorizerStack({ layers, }: ColorizerStackProps) {
    return (
        <div className={'ColorizerStack'}>
            {layers.map((layer: IImageLayer) => <ImageLayer key={layer.key} layer={layer}/>)}
        </div>
    );
});
