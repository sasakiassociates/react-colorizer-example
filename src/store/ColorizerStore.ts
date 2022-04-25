import { action, computed, makeObservable, observable, override } from "mobx";
import { ColorizerState, IColorizerLayer, Pattern } from "@strategies/react-colorizer";

import Asset_Colorizer_Helicoid_Base_Image from '../assets/helicoid/dataPNG.png';
import Asset_Colorizer_Helicoid_Data from '../assets/helicoid/dataPNG.png';
import Asset_Colorizer_Helicoid_Graphic from '../assets/helicoid/keyPNG.png';
import Asset_Colorizer_Helicoid_Key from '../assets/helicoid/projectLookup.json';

import Asset_Colorizer_Levels_Base_Image from '../assets/levels/ViewCapture20220406_152102.jpg';
import Asset_Colorizer_Levels_Data from '../assets/levels/dataPNG.png';
import Asset_Colorizer_Levels_Graphic from '../assets/levels/keyPNG.png';
import Asset_Colorizer_Levels_Key from '../assets/levels/projectLookup.json';

import Asset_Colorizer_Building_Base_Image from '../assets/building/Existing_Base.jpg';
import Asset_Colorizer_Building_Data from '../assets/building/data.png';
import Asset_Colorizer_Building_Graphic from '../assets/building/output.png';
import Asset_Colorizer_Building_Key from '../assets/building/data.png-keyIndex.json';

import { ColorizerLayer, ImageLayer } from "./Layers";

export default class ColorizerStore {
    constructor() {
        makeObservable(this);
    }

    @action
    changeSomething() {
        this.levelsLayer.increment();
        this.buildingLayer.increment();
    }

    @computed
    get levelsLayer() {
        const width = 800;
        const height = 600;
        return new LevelsColorizerLayer(width, height,
            Asset_Colorizer_Levels_Graphic,
            Asset_Colorizer_Levels_Data,
            Asset_Colorizer_Levels_Key.orderedData,
        )
    }

    @computed
    get buildingLayer() {
        const width = 2400;
        const height = 1482;
        return new BuildingColorizerLayer(width, height,
            Asset_Colorizer_Building_Graphic,
            Asset_Colorizer_Building_Data,
            Asset_Colorizer_Building_Key,
        )
    }

    @computed
    get colorizerLayers() {
        const width = 800;
        const height = 600;

        return [
            new ImageLayer(Asset_Colorizer_Building_Base_Image, width, height),
            // new HelicoidColorizerLayer(width, height,
            //     Asset_Colorizer_Helicoid_Graphic,
            //     Asset_Colorizer_Helicoid_Data,
            //     Asset_Colorizer_Helicoid_Key.orderedData,
            // ),
            this.levelsLayer,
            this.buildingLayer,
        ];
    }
}

export class CustomColorizerState implements ColorizerState {
    fillColor = '#ffffff';
    fillAlpha = 1;
    strokeColor = '#000000';
    strokeAlpha = 1;
    pattern?: Pattern;
    patternMin?: number;//min lightness at which to show the pattern
    patternMax?: number;//max lightness at which to show the pattern

    constructor(fillColor: string) {
        this.fillColor = fillColor;

    }
}

export class HelicoidColorizerLayer extends ColorizerLayer {
    constructor(imageWidth: number, imageHeight: number, graphic: string, data: string, key: string[]) {
        super(imageWidth, imageHeight, graphic, data, key);
        makeObservable(this);
    }

    @override
    get colorizerStates(): Map<string, ColorizerState> {
        const states = new Map<string, ColorizerState>();
        states.set('helicoid 1', new CustomColorizerState('#421c8d'))
        states.set('helicoid 2', new CustomColorizerState('#09595e'))
        return states;
    }

}
const colors = [
    "#7a82b7",
    "#74b649",
    "#764ebf",
    "#a38c48",
    "#ca52a8",
    "#539b81",
    "#cc5933",
    "#ab5764"];
export class LevelsColorizerLayer extends ColorizerLayer {
    @observable
    counter = 0;

    @action
    increment() {
        this.counter = this.counter + 1;
    }

    constructor(imageWidth: number, imageHeight: number, graphic: string, data: string, key: string[]) {
        super(imageWidth, imageHeight, graphic, data, key);
        makeObservable(this);
    }

    @override
    get dataWidth(): number {
        return 224;
    }

    @override
    get colorizerStates(): Map<string, ColorizerState> {
        const states = new Map<string, ColorizerState>();

        let data = Asset_Colorizer_Levels_Key.orderedData;
        console.log('LEVEL colorizerStates', this.counter);
        for (let i = this.counter; i < data.length; i++) {
            // if (i !== 3) continue;

            const id = data[i];
            const color = colors[i % colors.length];
            let customColorizerState = new CustomColorizerState(color);
            customColorizerState.fillAlpha = 1;//TEMP 0.5 + 0.5 * (i / data.length);
            customColorizerState.strokeColor = (i % 2 === 0) ? '#ff0000' : '#0000ff';
            customColorizerState.strokeAlpha = 0.75;
            customColorizerState.pattern = Pattern.LightenBackward;
            customColorizerState.patternMin = 0;
            customColorizerState.patternMax = 1;

            states.set(id, customColorizerState)
        }
        return states;
    }

}

export class BuildingColorizerLayer extends ColorizerLayer {
    @observable
    counter = 0;

    @action
    increment() {
        this.counter = this.counter + 1;
    }

    constructor(imageWidth: number, imageHeight: number, graphic: string, data: string, key: string[]) {
        super(imageWidth, imageHeight, graphic, data, key);
        makeObservable(this);
    }

    @override
    get dataWidth(): number {
        return 256;
    }

    @override
    get colorizerStates(): Map<string, ColorizerState> {
        const states = new Map<string, ColorizerState>();

        let data = Asset_Colorizer_Building_Key;
        for (let i = 0; i < data.length - this.counter; i++) {
            const id = data[i];
            const color = colors[i % colors.length];
            let customColorizerState = new CustomColorizerState(color);
            customColorizerState.fillAlpha = 1;//TEMP 0.5 + 0.5 * (i / data.length);
            customColorizerState.strokeColor = (i % 2 === 0) ? '#ff0000' : '#0000ff';
            customColorizerState.strokeAlpha = 0.75;
            customColorizerState.pattern = Pattern.Paisley;
            customColorizerState.patternMin = 0.8;
            customColorizerState.patternMax = 1;

            states.set(id, customColorizerState)
        }
        return states;
    }

}