import {
    ColorizerCanvas,
    ColorizerState,
    IColorizerDataLayer,
    IColorizerLayer,
    IGraphicIdLayer,
    IImageLayer,
    LayerIdCanvas
} from "@strategies/react-colorizer";
import { v4 as uuidv4 } from 'uuid';
import { computed, makeObservable } from "mobx";
import { ReactNode } from "react";

export class ColorStateLayer implements IColorizerLayer {
    key = uuidv4();
    imageWidth = 0;
    imageHeight = 0;

    constructor(imageWidth: number, imageHeight: number) {
        makeObservable(this);
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }

    @computed
    get _colorizerStates(): Map<string, ColorizerState> {
        const states = new Map<string, ColorizerState>();
        //TODO
        return states;
    }

    @computed
    get colorizerStates(): Map<string, ColorizerState> {
        return this._colorizerStates;
    }

    @computed
    get dataWidth(): number {
        return 512;
    }

    get element(): ReactNode {
        return null;
    }
}

export class ColorizerLayer extends ColorStateLayer implements IColorizerDataLayer {
    paths?: {
        graphic: string;
        data: string;
        key: string[];
    }

    constructor(imageWidth: number, imageHeight: number, graphic: string, data: string, key: string[]) {
        super(imageWidth, imageHeight)
        makeObservable(this);
        this.paths = {
            graphic: graphic,
            data: data,
            key: key,
        }
    }

    get element() {
        if (!this.paths) return null;
        return <ColorizerCanvas
            colorizerStates={this.colorizerStates}
            canvasId={'colorizer'}
            dataWidth={this.dataWidth}
            paths={this.paths}
            width={this.imageWidth}
            height={this.imageHeight}
        />
    }
}

export class GraphicIdLayer extends ColorStateLayer implements IGraphicIdLayer {
    paths?: {
        graphic: string;
        id: string;
        key: string[];
    }

    constructor(imageWidth: number, imageHeight: number, graphic: string, id: string, key: string[]) {
        super(imageWidth, imageHeight)
        makeObservable(this);
        this.paths = {
            graphic: graphic,
            id: id,
            key: key,
        }
    }

    get element(): ReactNode {
        return <LayerIdCanvas canvasId={'graphic-id'} layer={this} width={this.imageWidth}
                              height={this.imageHeight}/>
    }
}


export class ImageLayer implements IImageLayer {
    readonly key = uuidv4();
    readonly imagePath: string = '';
    readonly imageWidth: number = 0;
    readonly imageHeight: number = 0;

    constructor(imagePath: string, imageWidth: number, imageHeight: number) {
        this.imagePath = imagePath;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }

    get element(): ReactNode {
        return <img src={`${this.imagePath}`} width={this.imageWidth} height={this.imageHeight}
                    alt={'underlay graphic'}/>
    }
}
