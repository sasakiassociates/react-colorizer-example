import { action, computed, makeObservable, observable } from "mobx";
import { ColorizerMetadata } from "@strategies/react-colorizer";

import { BandType, IImageLayer } from "@strategies/react-colorizer";
import { BandedColorizerLayer, ImageLayer, SvgLayer } from "./Layers";
// import project from "./project/colorizer-study";
// import project from "./project/grouping-test-2";
// import project from "./project/inset-outset";
// import project from "./project/ubc";
// import project from "./project/ubc-high";
import project from "./project/live-build";
import { BandSettings } from "./BandSettings";
// import project from "./project/bpy-high";
// import project from "./project/bpy-crop";
// import project from "./project/topo-test";

const {
    backgroundImage,
    bandSettings,
    highlightSettings,
    dataImage,
    keyImage,
    metadataPath,
    projectId
} = project;

export { bandSettings, highlightSettings };

export default class ColorizerStore {
    @observable
    metadata?: ColorizerMetadata;

    @observable
    projectId: string = '';

    constructor() {
        makeObservable(this);
    }

    @action
    changeSomething(val: number) {
        // this.buildingLayer.increment(val);
    }

    @computed
    get backgroundLayer() {
        if (!backgroundImage) return null;
        const { width, height } = this.imageSize;
        return new ImageLayer(backgroundImage, width, height)
    }

    @computed
    get svgLayer() {
        const { width, height } = this.imageSize;
        return new SvgLayer(width, height)
    }

    @computed
    get buildingLayer() {
        if (!this.metadata) return null;
        const { width, height } = this.imageSize;
        return new BandedColorizerLayer(width, height,
            dataImage,
            keyImage,
            bandSettings,
            this.metadata
        )
    }

    @computed
    get colorizerLayers() {
        const ans: IImageLayer[] = [];
        if (this.backgroundLayer) {
            ans.push(this.backgroundLayer);
        }
        if (this.buildingLayer) {
            ans.push(this.buildingLayer);
        }
        ans.push(this.svgLayer);
        return ans;
    }

    @computed
    get ready() {
        return !!this.metadata;
    }

    @computed
    get imageSize() {
        return {
            width: this.metadata?.keyWidth || 0,
            height: this.metadata?.keyHeight || 0
        };
    }

    @computed
    get objectIds() {
        if (!this.metadata) return [];
        return Object.keys(this.metadata.idRunLengths);
    }

    @computed
    get bandSettings() {
        return bandSettings;
    }

    @action
    async loadMetadata() {
        const response = await fetch(metadataPath);
        const jsonData = await response.json();
        this.metadata = jsonData.studyData;
        this.projectId = jsonData.studyName;
        console.log('SET metadata', this.metadata);
    }
}


