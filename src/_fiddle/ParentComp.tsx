import React from "react";

export type ParentCompProps = { width: number, height: number };
type ParentCompState = { loaded: boolean, mouseX: number, mouseY: number, downX: number, downY: number }

export class ParentComp<T extends ParentCompProps> extends React.Component<T, ParentCompState> {
    drawFrameProps(): any {
        throw new Error('Must be implemented in subclass');
    }

    render() {
        let frameProps = this.drawFrameProps();
        return <div>
            {frameProps.info}
        </div>
    }
}
