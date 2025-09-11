import { useState } from "react";

import { tw } from "@functions/style";

import BoxChecked from "@images/vector/box_checked.svg";
import BoxUncheck from "@images/vector/box_uncheck.svg";

import Table, { TableProps } from "../Table";

interface CheckBoxTable<Data> extends TableProps<Data> {
    checkbox: number[];
    checkboxLabel?: string;
    onCheckboxChange: (value: number[]) => void;
}

const CheckBoxTable = <Data,>(props: CheckBoxTable<Data>) => {
    const [isScrollLeft, setScrollLeft] = useState(false);

    const formattedProps: Partial<CheckBoxTable<Data>> = { ...props };
    delete formattedProps.checkbox;
    delete formattedProps.onCheckboxChange;
    delete formattedProps.columns;
    delete formattedProps.rows;

    const checkButton = (checked: boolean) => {
        return <button type="button">{checked ? <BoxChecked /> : <BoxUncheck />}</button>;
    };

    return (
        <Table
            onScroll={({ left }) => {
                setScrollLeft(!!left);
            }}
            rows={props.rows}
            columns={[
                {
                    header: props.checkboxLabel,
                    value: (_, index) => checkButton(props.checkbox.includes(index)),
                    onClick: (_, index) => {
                        const checkboxIndex = props.checkbox.findIndex((index_) => index_ === index);

                        if (checkboxIndex >= 0) {
                            const newCheckbox = [...props.checkbox];
                            newCheckbox.splice(checkboxIndex, 1);
                            props.onCheckboxChange(newCheckbox);
                        } else {
                            props.onCheckboxChange([...props.checkbox, index]);
                        }
                    },
                    className: tw("w-8 text-center", isScrollLeft && "shadow"),
                },
                ...props.columns,
            ]}
            {...formattedProps}
        />
    );
};

export default CheckBoxTable;
