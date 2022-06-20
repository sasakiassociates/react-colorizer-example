import { v4 as uuidv4 } from 'uuid';
import { computed, makeObservable, override } from "mobx";
import { ReactNode } from "react";
import { stores } from "@strategies/stores";
import {
    ColorizerState,
    DataLayerPaths,
    IColorizerDataLayer,
    IColorizerLayer,
    IImageLayer, Rectangle
} from "@strategies/react-colorizer";
import { ColorizerCanvas, ColorizerMetadata } from "@strategies/react-colorizer";
import { BandSettings } from "./BandSettings";
import MainStore from "./MainStore";

const remap = (value: number, aFrom: number, aTo: number, bFrom: number, bTo: number) => {
    const ratio = (value - aFrom) / (aTo - aFrom);
    return bFrom + ratio * (bTo - bFrom);
}

export class ColorStateLayer implements IColorizerLayer {
    key = uuidv4();
    imageWidth = 0;
    imageHeight = 0;
    dataWidth = 0;

    constructor(imageWidth: number, imageHeight: number, dataWidth: number) {
        makeObservable(this);
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.dataWidth = dataWidth;
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
    get maxStackSize(): number {
        //NOTE: this needs to be set to the max of max stacked objects or total number of blendable bands
        return 11;
    }

    get element(): ReactNode {
        return null;
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

export class SvgLayer implements IImageLayer {
    readonly key = uuidv4();
    readonly imageWidth: number = 0;
    readonly imageHeight: number = 0;

    constructor(imageWidth: number, imageHeight: number) {
        makeObservable(this);
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }

    @computed
    get position() {
        const { cursorX, cursorY, cursorZ } = this.mainStore;
        return {
            x: cursorX,
            y: cursorY,
            z: cursorZ
        }
    }

    @computed
    get mainStore() {
        return stores.main as MainStore;
    }

    @computed
    get element(): ReactNode {
        //TODO - how can we simplify supporting cropping
        //for both this SVG as well as the base image?
        //should the base image actually use SVG as a simple way to crop and scale?

        const size = remap(this.position.z, 1700, 7000, 10, 5)
        return <svg style={{ pointerEvents: 'none' }} width={this.imageWidth} height={this.imageHeight}>
            <g transform={`translate(${this.position.x},${this.position.y})`}>
                <g transform={`scale(${size})`}>
                    <g transform={`translate(-3,-15)`}>
                        {/*<GiPalmTree/>*/}
                    </g>
                </g>
            </g>

            {/*<rect x={this.position.x} y={this.position.y} width={50} height={50} fill={'#4d7cd2'}/>*/}
        </svg>
    }
}

export class BandedColorizerLayer extends ColorStateLayer implements IColorizerDataLayer {
    paths?: DataLayerPaths;
    metadata: ColorizerMetadata;

    constructor(imageWidth: number, imageHeight: number, data: string, key: string, bands: BandSettings[], metadata: ColorizerMetadata) {
        super(imageWidth, imageHeight, metadata.keyStackWidth);
        makeObservable(this);

        this.paths = {
            data: data,
            key: key,
            bands: bands
        }
        this.metadata = metadata;
    }

    @computed
    get mainStore() {
        return stores.main as MainStore;
    }

    @override
    get colorizerStates(): Map<string, ColorizerState> {
        if (!this.mainStore.graphicsModel) return new Map<string, ColorizerState>();
        return this.mainStore.graphicsModel.colorizerStates;
    }

    @computed
    get effectiveWidth(): number {
        return this.effectiveCrop ? this.effectiveCrop.width : this.imageWidth;
    }

    @computed
    get effectiveHeight(): number {
        return this.effectiveCrop ? this.effectiveCrop.height : this.imageHeight;
    }

    @computed
    get effectiveCrop(): Rectangle | null {
        return this.mainStore.cropRect;
    }

    get element() {
        if (!this.paths) return null;
        return <ColorizerCanvas
            colorizerStates={this.colorizerStates}
            bandSettings={this.paths.bands}
            canvasId={'colorizer'}
            dataWidth={this.dataWidth}
            metadata={this.metadata}
            maxStackSize={this.maxStackSize}
            paths={this.paths}
            width={this.effectiveWidth}
            height={this.effectiveHeight}
            cropRect={this.effectiveCrop || undefined}
            emitProjectClick={(hit) => {
                console.log(hit);
                this.mainStore.graphicsModel?.toggleId(hit && hit.id);
            }}
            emitProjectHover={(hit) => {
                if (hit) this.mainStore.setCursor(hit.position.x, hit.position.y, hit.depth);
                // console.log('HOVER', id);
                this.mainStore.setHighlightId(hit && hit.id);
            }}
        />
    }
}
