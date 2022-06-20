import { observer } from "mobx-react";
import {
    BandOptions,
    BufferBandOptions,
    BufferOptions,
    GraphicElement,
    GraphicsModel
} from "../../model/GraphicsModel";
import { SwatchPicker } from "../elements/SwatchPicker";
import Checkbox from "../elements/Checkbox";
import { Select } from "../elements/Select";
import { patternOptions } from "@strategies/react-colorizer";
import ReactSlider from "react-slider";
import { useStores } from "@strategies/stores";
import MainStore from "../../store/MainStore";

type BufferItemProps = {
    title: string;
    options: BufferOptions;
};
export const BufferItem = observer(({ options, title }: BufferItemProps) => {
    return <div className={'BufferItem'}>
        <div className={'title'}>{title}</div>
        <ReactSlider
            max={100}
            value={[options.buffer * 100, (options.buffer + options.falloff) * 100]}
            onChange={(value, i) => {
                options.setBuffer(value[0] / 100);
                options.setFalloff((value[1] - value[0]) / 100);
            }}
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
            pearling={true}
            minDistance={1}
        />
    </div>
});

type BandItemProps = {
    options: BandOptions;
};
export const BandItem = observer(({ options }: BandItemProps) => {
    const bufferOptions: BufferBandOptions = options as BufferBandOptions;
    return <div className={'BandItem'}>
        <div className="band-name">{options.bandId}</div>

        <SwatchPicker color={options.color}
                      setColor={(v) => options.setColor(v)}
                      alpha={options.opacity}
                      setAlpha={(v) => options.setOpacity(v)}

        />
        <div className={'opacity'}>opacity: {options.opacity}</div>
        <Select options={patternOptions} value={options.patternId} onChange={(val) => options.setPatternId(val)}/>
        {bufferOptions && bufferOptions.inset && <BufferItem title={'INSET'} options={bufferOptions.inset}/>}
        {bufferOptions && bufferOptions.outset && <BufferItem title={'OUTSET'} options={bufferOptions.outset}/>}
    </div>
});

type GraphicsItemProps = {
    item: GraphicElement;
};
export const GraphicsItem = observer(({ item }: GraphicsItemProps) => {
    const mainStore = useStores().main as MainStore;

    return <div className={'GraphicsItem'}>
        <Checkbox value={item.visible} onChange={(visible) => item.setVisible(visible)}/>

        <div className={'title'} onClick={() => item.setExpanded(!item.expanded)}>
            {item.id} {mainStore.highlightId === item.id ? '*' : ''}
        </div>
        {item.expanded && <div>
            <button onClick={() => mainStore.copySource = item}>Copy</button>
            <button onClick={() => mainStore.copySource && item.copyFrom(mainStore.copySource)}>Paste</button>
        </div>
        }

        {item.expanded && item.bandOptions.map(e => <BandItem key={e.bandId} options={e}/>)}
    </div>
});

type GraphicsPanelProps = {
    graphicsModel: GraphicsModel;
};
export const GraphicsPanel = observer(({ graphicsModel }: GraphicsPanelProps) => {
    const mainStore = useStores().main as MainStore;
    return <div className={'GraphicsPanel'}>
        <div className={'file-buttons'}>
            <button onClick={() => graphicsModel.save()}>SAVE</button>
            <button onClick={() => graphicsModel.load()}>LOAD</button>
        </div>
        <div className={'hover-info'}>
            {mainStore.highlightId}
        </div>
        {graphicsModel.elements.map(e => <GraphicsItem key={e.id} item={e}/>)}
    </div>
});
