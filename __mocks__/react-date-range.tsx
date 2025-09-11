import { useEffect } from "react";

interface Props {
    onChange: (value: { selection: { startDate: string; endDate: string } }) => void;
}
export const DateRangePicker = ({ onChange }: Props) => {
    useEffect(() => {
        onChange({ selection: { startDate: "2012-12-11", endDate: "2012-12-12" } });
    }, []);

    return <div></div>;
};
