import { BandType, HighlightSetting, ProjectSettings } from "@strategies/react-colorizer";
import { BandSettings } from "../BandSettings";

const dir = './live-build';

const Asset_Colorizer_Lightness_Image = dir+'/bands/Lightness.png';
const Asset_Colorizer_Rendered_Image = dir+'/bands/Rendered.png';
const Asset_Colorizer_Shadows_Image = dir+'/bands/Shadows Only.png';
const Asset_Colorizer_LineworkThin_Image = dir+'/bands/Linework (thin).png';
// const Asset_Colorizer_LineworkThick_Image = dir+'/bands/Linework (thick).png';
const Asset_Colorizer_InsetOutset_Image = dir+'/bands/blurredEdge.png';
const Asset_Colorizer_Depth_Image = dir+'/bands/zDepth.png';
// const Asset_BackgroundImage = dir+'/background.jpg';

const Asset_Colorizer_Data_Image = dir+'/keyStack.png';
const Asset_Colorizer_Key_Image = dir+'/key.png';
const Asset_Colorizer_Metadata = dir+'/metadata.json';

const Asset_Colorizer_Data = './data/colorizerDataBPY.json';

const bandSettings = [
    new BandSettings('Shadows', Asset_Colorizer_Shadows_Image, BandType.Redness, '#0d0646', 0.8, false, 2),
    // new BandSettings('Outlines (thick) - below', Asset_Colorizer_OutlinesThick_Image, BandType.Blackness, '#d6defd'),
    // new BandSettings('Rendered', Asset_Colorizer_Rendered_Image, BandType.MultiplyColorMasked, '#081e5e',  0.1),
    new BandSettings('Color', Asset_Colorizer_Lightness_Image, BandType.Redness, '#e7953a',  0.8, true),
    // new BandSettings('Linework (thick)', Asset_Colorizer_LineworkThick_Image, BandType.Blackness, '#052179'),
    new BandSettings('Linework (thin)', Asset_Colorizer_LineworkThin_Image, BandType.Blackness, '#482409', 0.4),
    // new BandSettings('Outlines (thick) - above', Asset_Colorizer_OutlinesThick_Image, BandType.Blackness, '#052179'),
    new BandSettings('Edges', Asset_Colorizer_InsetOutset_Image, BandType.InsetOutsetRB, '#000000', 0.3),
    new BandSettings('Edges (behind)', Asset_Colorizer_InsetOutset_Image, BandType.InsetOutsetRB, '#000000', 0.0),
    new BandSettings('Depth', Asset_Colorizer_Depth_Image, BandType.Hidden),
];
const highlightSettings: HighlightSetting[] = [
    // { bandId: 'Color', color: '#ff11cf', opacity:1 },
    { bandId: 'Shadows', color: '#490052', opacity:1 },
    // { bandId: 'Edges', color: '#300134', opacity:1 },
    { bandId: 'Linework (thin)', color: '#411160', opacity:0.25 },
    { bandId: 'Edges (behind)', color: '#ab4aab', opacity:1 },
]



const project: ProjectSettings = {
    projectId: 'bpy-high',
    // backgroundImage: Asset_BackgroundImage,

    // imageSize: { width: 1072, height: 816 },
    bandSettings,
    highlightSettings,
    dataImage: Asset_Colorizer_Data_Image,
    keyImage: Asset_Colorizer_Key_Image,
    metadataPath: Asset_Colorizer_Metadata,
    dataPath: Asset_Colorizer_Data,
};
export default project;




