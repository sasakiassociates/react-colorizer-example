import { makeObservable, observable } from "mobx";
import { BandType } from "@strategies/react-colorizer";

export class BandSettings {
    @observable
    name: string;
    @observable
    image: string;
    @observable
    defaultColor: string;
    @observable
    defaultOpacity: number;
    @observable
    type: number;
    @observable
    layer: number;
    @observable
    range: number[] = [0, 255];
    @observable
    mask: boolean = false;

    constructor(name: string, image: string, type: number = BandType.Color, defaultColor = '#ffffff', defaultOpacity = 0.75, mask = false, layer = 1) {
        makeObservable(this);

        this.name = name;
        this.image = image;
        this.type = type;
        this.layer = layer;
        this.defaultColor = defaultColor;
        this.defaultOpacity = defaultOpacity;
        this.mask = mask;

    }
}
