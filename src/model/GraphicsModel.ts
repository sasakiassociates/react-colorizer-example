import { applySnapshot, ExtendedModel, getSnapshot, Model, model, modelAction, prop } from "mobx-keystone";
import { computed } from "mobx";
import { BandState, ColorizerState, patternFromId } from "@strategies/react-colorizer";
import { highlightSettings } from "../store/ColorizerStore";
import { stores } from "@strategies/stores";
import MainStore from "../store/MainStore";

@model('ct/BufferOptions')
export class BufferOptions extends Model({
    buffer: prop<number>(0.5).withSetter(),
    falloff: prop<number>(0.25).withSetter(),
}) {
    @modelAction
    copyFrom(other:BufferOptions) {
        this.buffer = other.buffer;
        this.falloff = other.falloff;
    }
}

@model('ct/BandOptions')
export class BandOptions extends Model({
    bandId: prop<string>(''),
    patternId: prop<string>('').withSetter(),
    color: prop<string>('#000000').withSetter(),
    opacity: prop<number>(1).withSetter(),
}) {
    @modelAction
    copyFrom(other:BandOptions) {
        this.patternId = other.patternId;
        this.color = other.color;
        this.opacity = other.opacity;
    }
}

@model('ct/BufferBandOptions')
export class BufferBandOptions extends ExtendedModel(BandOptions, {
    inset: prop<BufferOptions>().withSetter(),
    outset: prop<BufferOptions>().withSetter(),
}) {

    @modelAction
    copyFrom(other:BufferBandOptions) {
        super.copyFrom(other);
        this.inset.copyFrom(other.inset);
        this.outset.copyFrom(other.outset);
    }
}

@model('ct/GraphicElement')
export class GraphicElement extends Model({
    id: prop<string>(''),
    visible: prop<boolean>(true).withSetter(),
    expanded: prop<boolean>(false).withSetter(),
    bandOptions: prop<BandOptions[]>(() => []),
}) {
    @modelAction
    addBandOption(value: BandOptions) {
        this.bandOptions.push(value);
    }

    @modelAction
    copyFrom(other:GraphicElement) {
        for (let i = 0; i < this.bandOptions.length; i++) {
            const myBandOption = this.bandOptions[i];
            const otherBandOption = other.bandOptions[i];
            myBandOption.copyFrom(otherBandOption);
        }
    }

    @computed
    get mainStore() {
        return stores.main as MainStore;
    }

    @computed
    get colorizerState(): ColorizerState {
        const bandStates: BandState[] = [];
        let j = 0;
        this.bandOptions.forEach((bo, i) => {
            let color = bo.color;
            let alpha = bo.opacity;
            let pattern, insetOutset;
            if (bo.patternId) {
                pattern = patternFromId(bo.patternId);
            }
            const bufferOptions: BufferBandOptions = bo as BufferBandOptions;
            if (bufferOptions && bufferOptions.inset) {
                insetOutset = {
                    insetBuffer: bufferOptions.inset.buffer,
                    insetFalloff: bufferOptions.inset.falloff,
                    outsetBuffer: bufferOptions.outset.buffer,
                    outsetFalloff: bufferOptions.outset.falloff,
                };
            }
            if (this.id === this.mainStore.highlightId) {
                highlightSettings.forEach((setting, i) => {
                    if (setting.bandId === bo.bandId) {
                        color = setting.color;
                        if (setting.opacity !== undefined) {
                            alpha = setting.opacity;
                        }
                    }
                });
            }
            bandStates.push({ color, alpha, pattern, insetOutset })
        })
        return {
            bandStates
        };
    }
}

@model('ct/GraphicsModel')
export class GraphicsModel extends Model({
    id: prop<string>(''),
    elements: prop<GraphicElement[]>(() => []),
}) {
    load(): void {
        const snapshotData = localStorage.getItem('ct/GraphicsModel_'+this.id);
        if (!snapshotData) return;
        console.log(snapshotData)
        const snapshot = JSON.parse(snapshotData);
        // snapshot.$modelId = this.$modelId;
        applySnapshot(this, snapshot)
    }

    save(): void {
        const snapshot = getSnapshot(this);
        localStorage.setItem('ct/GraphicsModel_'+this.id, JSON.stringify(snapshot))
    }

    @modelAction
    addElement(value: GraphicElement) {
        this.elements.push(value);
    }

    @computed
    get colorizerStates(): Map<string, ColorizerState> {
        const states = new Map<string, ColorizerState>();

        this.elements.forEach(e => {
            if (!e.visible) return;
            states.set(e.id, e.colorizerState);
        });

        return states;
    }

    toggleId(id: string | null) {
        if (!id) return;
        const element = this.elements.find(e => e.id === id);
        if (element) {
            element.setVisible(!element.visible);
        }
    }
}

