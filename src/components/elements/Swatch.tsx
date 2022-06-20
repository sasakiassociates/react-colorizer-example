import {observer} from "mobx-react";
import React, {MouseEventHandler} from "react";

export const Swatch = observer(({color, onClick}: { color: string, onClick?: () => void }) => {
    return <div className="Swatch" onClick={onClick} style={{backgroundColor: color}}/>;
});
