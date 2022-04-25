import { ColorizerState, IColorizerLayer, IImageLayer } from "@strategies/react-colorizer";
import React, { Component } from "react";
import { ParentCompProps, ParentComp } from "./ParentComp";

type ChildCompProps = ParentCompProps & { colorizerStates: Map<string, ColorizerState> };

//testing to see what actually triggers a render on the parent component
//as expected, computed changes to colorizerStates within drawFrameProps will not trigger a redraw
//if accessed via layer
//however directly passing the colorizerStates from an observable should trigger the rerender

//the nice thing we had working in ReglCanvas was an autorun that would update the canvas via Regl
//WITHOUT triggering a rerender of the component - which simply renders a canvas and doesn't need to update


export class ChildComp extends ParentComp<ChildCompProps> {
    drawFrameProps() {
        let info = '';
        this.props.colorizerStates.forEach((value, key, map) => {
            info += key + ':' + value.fillColor + ';'
        })

        return {
            info: 'CANVAS ID: ' + info
        }
    }
}
