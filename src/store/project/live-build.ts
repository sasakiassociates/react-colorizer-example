import { BandType, HighlightSetting, ProjectSettings } from "@strategies/react-colorizer";
import { BandSettings } from "../BandSettings";

const Asset_Colorizer_Lightness_Image = './live-build/bands/Lightness.png';
// const Asset_Colorizer_Rendered_Image = './live-build/bands/Rendered.png';
const Asset_Colorizer_Shadows_Image = './live-build/bands/Shadows Only.png';
const Asset_Colorizer_LineworkThin_Image = './live-build/bands/Linework (thin).png';
const Asset_Colorizer_InsetOutset_Image = './live-build/bands/blurredEdge.png';
// import Asset_BackgroundImage from './live-build/background.jpg';

const Asset_Colorizer_Data_Image = './live-build/keyStack.png';
const Asset_Colorizer_Key_Image = './live-build/key.png';
const Asset_Colorizer_Metadata = './live-build/metadata.json';

const bandSettings = [
    new BandSettings('Shadows', Asset_Colorizer_Shadows_Image, BandType.Redness, '#0d0646', 0.8, false, 2),
    // new BandSettings('Outlines (thick) - below', Asset_Colorizer_OutlinesThick_Image, BandType.Blackness, '#d6defd'),
    new BandSettings('Color', Asset_Colorizer_Lightness_Image, BandType.Redness, '#dcc590',  0.8, true),
    // new BandSettings('Linework (thick)', Asset_Colorizer_LineworkThick_Image, BandType.Blackness, '#052179'),
    new BandSettings('Linework (thin)', Asset_Colorizer_LineworkThin_Image, BandType.Blackness, '#482409', 0.4),
    // new BandSettings('Outlines (thick) - above', Asset_Colorizer_OutlinesThick_Image, BandType.Blackness, '#052179'),
    new BandSettings('Edges', Asset_Colorizer_InsetOutset_Image, BandType.InsetOutsetRB, '#000000', 0.8),
    // new BandSettings('Depth', Asset_Colorizer_Depth_Image, BandType.Hidden),
];
const highlightSettings: HighlightSetting[] = [
    { bandId: 'Color', color: '#ff11cf' },
    { bandId: 'Shadows', color: '#490052', opacity:1 },
    { bandId: 'Edges', color: '#300134', opacity:1 },
    { bandId: 'Linework (thin)', color: '#000000', opacity:1 }
]

const project: ProjectSettings = {
    projectId: 'bpy-high',
    // backgroundImage: Asset_BackgroundImage,

    // imageSize: { width: 1072, height: 816 },
    bandSettings,
    highlightSettings,
    dataImage: Asset_Colorizer_Data_Image,
    keyImage: Asset_Colorizer_Key_Image,
    metadataPath: Asset_Colorizer_Metadata
};
export default project;

