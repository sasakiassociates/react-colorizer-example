import { action, autorun, computed, makeObservable, observable } from "mobx";
import { BandOptions, BufferBandOptions, BufferOptions, GraphicElement, GraphicsModel } from "../model/GraphicsModel";
import { BandType, Rectangle } from "@strategies/react-colorizer";
import ColorizerStore from "./ColorizerStore";
import { register, Store, stores } from '@strategies/stores';

export interface IImageLayer {
    id: string;
    imageWidth: number;
    imageHeight: number;
    type: string;
}

export class ColorizerLayer implements IImageLayer {
    readonly id;
    @observable folderName = '';
    @observable imageWidth = 0;
    @observable imageHeight = 0;

    constructor(id: string, folderName: string, imageWidth: number, imageHeight: number) {
        makeObservable(this);

        this.id = id;
        this.folderName = folderName;

        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }

    @computed get type() {
        return 'encoded-colorizer';
    }
}

export class ImageLayer implements IImageLayer {
    readonly id: string;
    @observable imagePath = '';
    @observable imageWidth = 0;
    @observable imageHeight = 0;

    constructor(id: string, imagePath: string, imageWidth: number, imageHeight: number) {
        makeObservable(this);

        this.id = id;
        this.imagePath = imagePath;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
    }

    @computed get type() {
        return 'image-underlay';
    }
}

export class ColorizerLayerSet {
    @observable title = '';

    @observable layers: IImageLayer[] = [];
    @observable width = 0;
    @observable height = 0;
    private mainStore: MainStore;

    constructor(title: string, width: number, height: number, mainStore: MainStore) {
        makeObservable(this);

        this.title = title;
        this.width = width;
        this.height = height;
        this.mainStore = mainStore;
    }

    @computed get visibleLayers() {
        return this.layers.filter(layer => this.mainStore.excludedIds.indexOf(layer.id) < 0);
    }

    addLayer(colorizerLayer: IImageLayer) {
        this.layers.push(colorizerLayer);
    }
}

const randomColor = () => {
    return '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
}

export default class MainStore extends Store {
    @observable scale = 0.8;
    @observable imageIdx = 0;
    @observable stageWidth = 800;
    @observable stageHeight = 600;
    @observable cursorX = 0;
    @observable cursorY = 0;
    @observable cursorZ = 0;
    @observable playing = false;
    @observable highlightId: string | null = '';
    @observable excludedIds: string[] = [];

    @observable cropRect: Rectangle | null = null;//TEMP
    // @observable cropRect: Rectangle | null = {
    //     x:0,
    //     y:0,
    //     width:496,
    //     height: 336
    // };

    @observable
    copySource: GraphicElement | undefined;

    @observable colors = [
        '#339988',
        '#993388',
        '#3388FF',
        '#b1984c',
    ];

    @observable colorizerLayerSets: ColorizerLayerSet[] = [];

    @observable
    graphicsModel?: GraphicsModel;
    @observable
    colorizerStore: ColorizerStore;

    constructor() {
        super();
        makeObservable(this);

        this.colorizerStore = new ColorizerStore();
        this.colorizerStore.loadMetadata().then(() => {
            console.log('METADATA loaded');
            this.init(this.colorizerStore);
        });
    }

    init(colorizerStore: ColorizerStore) {
        const { projectId, objectIds, bandSettings } = colorizerStore;
        const graphicsModel = new GraphicsModel({ id: projectId });

        objectIds.forEach((id, i) => {
            const graphicElement = new GraphicElement({ id });
            if (id.startsWith('B1 - Easements')) graphicElement.setVisible(false);

            bandSettings.forEach((bandSetting, i) => {
                let color = '';
                if (i === 1) {
                    if (id.indexOf('_RETAIL') > 0) color = '#be3b3b';
                    if (id.indexOf('_RESI TOWER') > 0) color = '#e3b918';
                    if (id.indexOf('_OFFICE TOWER') > 0) color = '#007ffa';
                    if (id.indexOf('_LAB TOWER') > 0) color = '#c54ef1';
                    if (id.indexOf('_AMENITY') > 0) color = '#37bba4';
                    if (id.indexOf('_RESI PARKING') > 0) color = '#608693';
                }
                if (bandSetting.type === BandType.Hidden) return;
                if (bandSetting.type === BandType.InsetOutsetRB) {
                    graphicElement.addBandOption(new BufferBandOptions({
                        bandId: bandSetting.name,
                        // color: randomColor()
                        color: color || bandSetting.defaultColor,
                        opacity: bandSetting.defaultOpacity,
                        inset: new BufferOptions({ buffer: 0.02, falloff: 0.01 }),
                        outset: new BufferOptions({ buffer: 0.02, falloff: 0.01 }),
                    }));
                } else {
                    graphicElement.addBandOption(new BandOptions({
                        bandId: bandSetting.name,
                        // color: randomColor(),
                        color: color || bandSetting.defaultColor,
                        opacity: bandSetting.defaultOpacity
                    }));
                }

            });
            graphicsModel.addElement(graphicElement);
        });
        this.graphicsModel = graphicsModel;
    }

    @action
    setScale(n: number) {
        this.scale = n;
    }

    @action
    setHighlightId(id: string | null) {
        this.highlightId = id;
    }

    @action
    setStageSize(w: number, h: number) {
        this.stageWidth = w;
        this.stageHeight = h;
    }

    @action
    setCursor(x: number, y: number, z: number) {
        this.cursorX = x;
        this.cursorY = y;
        this.cursorZ = z;
    }

    @action
    setImageIdx(n: number) {
        this.imageIdx = n;
    }

    @action
    setExcludedIds(ids: string[]) {
        this.excludedIds = ids;
    }

    @action
    setPlaying(value: boolean) {
        this.playing = value;
    }

    @action
    shiftColors() {
        if (this.colors.length === 0) return;
        this.colors.push(this.colors.shift() || '');
    }

    @action
    shiftImages() {
        this.imageIdx++;
    }

    @action
    setCrop(rect: Rectangle | null) {
        this.cropRect = rect;
    }

    addLayerSet(colorizerLayerSet: ColorizerLayerSet) {
        this.colorizerLayerSets.push(colorizerLayerSet);
    }
}
