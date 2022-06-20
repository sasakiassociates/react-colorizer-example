import React, {FunctionComponent} from "react";
import {observer} from "mobx-react";

export type CheckboxProps = {
    label?: string;
    value: boolean;
    onChange: (value: boolean) => void;
};
const Checkbox: FunctionComponent<CheckboxProps> = ({onChange, value, label}: CheckboxProps) => {
    return (
        <label>{label} <input type="checkbox" checked={value} onChange={(e)=>{
            onChange((e.target as HTMLInputElement).checked);
        }
        }/></label>
    )
}

export default observer(Checkbox);
