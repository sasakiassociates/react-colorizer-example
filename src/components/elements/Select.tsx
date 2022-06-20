import { observer } from "mobx-react";
import { ChangeEvent } from "react";

type SelectProps = {
    readonly?: boolean;
    value: string;
    options: string[];
    onChange: (value: string) => void;
};
export const Select = observer(({ value, options, onChange, readonly }: SelectProps) => {
    return <select
        disabled={readonly}
        value={value}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
    >
        {options.map((value: string | number) => (
            <option key={value} value={value}>{value}</option>
        ))}
    </select>
});
