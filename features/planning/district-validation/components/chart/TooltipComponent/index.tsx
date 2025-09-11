import React from "react";

interface Props {
    list: any;
    title: any;
}

const TooltipComponent: React.FC<Props> = ({ list, title }) => {
    return (
        <div className="p-4 bg-white border rounded shadow">
            <h5 className="mb-2 text-sm font-bold">{title}</h5>
            <div className="flex gap-[2.75rem]">
                {list.length ? (
                    Array.from({ length: Math.ceil(list.length / 12) }, (_, index) =>
                        list.filter((_: any, index2: number) => index2 >= 12 * index && index2 < 12 * (index + 1))
                    ).map((dataColumn, index) => {
                        return (
                            <div key={`${index.toString()}`}>
                                {dataColumn.map((data: any) => {
                                    return (
                                        <div key={data.label} className="flex items-center text-sm whitespace-nowrap">
                                            <span>{data.label} :</span>
                                            <label className="font-bold">{data.value}</label>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })
                ) : (
                    <span>Data Empty</span>
                )}
            </div>
        </div>
    );
};

export default TooltipComponent;
